import { HttpService } from '@nestjs/axios';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  BrokenCircuitError,
  circuitBreaker,
  CircuitBreakerPolicy,
  ConsecutiveBreaker,
  ExponentialBackoff,
  handleAll,
  IMergedPolicy,
  IRetryContext,
  retry,
  RetryPolicy,
  wrap,
} from 'cockatiel';
import { createLRU } from 'lru.min';
import { HttpServiceException } from '@libs/shared/error/http-service-exception';
import {
  HTTP_SERVICE_ERROR,
  HttpServiceErrorKey,
} from '@libs/shared/error/http-service-error';

import { ResponseEntity } from '../dto/response-entity';

type CircuitBreaker = IMergedPolicy<
  IRetryContext,
  never,
  [RetryPolicy, CircuitBreakerPolicy]
>;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * application level 의 서킷브레이커 적용
 */
export abstract class BaseHttpService {
  private static readonly maxRetries = 1;
  private static readonly retryDelay = 1000;

  protected baseUrl: string;
  protected headers?: Record<string, string>;

  protected readonly retryWithBreakerCache = createLRU<string, CircuitBreaker>({
    max: 1000,
  });

  protected constructor(
    protected readonly httpService: HttpService,
    protected readonly host: string,
    protected readonly port?: number,
  ) {
    this.baseUrl = this?.port ? `${this.host}:${this.port}` : `${this.host}`;
  }

  async request<ResponseData>(
    options: {
      url: string;
      method: HttpMethod;
      params?: Record<string, any>;
      body?: unknown;
      headers?: Record<string, string>;
    },
    errorKey: HttpServiceErrorKey,
    inActiveCircuitBreaker?: boolean,
  ): Promise<ResponseEntity<ResponseData>> {
    const url = this._normalizeUrl(options.url);
    const headers: Record<string, string> = {
      ...this.headers,
      ...(options.headers ?? {}),
    };

    const requestOptions: AxiosRequestConfig = {
      baseURL: this.baseUrl,
      url: url,
      method: options.method,
      headers: headers,
      params: options.params,
      data: options.body,
    };

    if (inActiveCircuitBreaker === true) {
      return await this.httpService.axiosRef.request(requestOptions);
    }

    const result = await this.execute<ResponseData>(requestOptions, errorKey);

    const { code, data, success } = result.data;

    if (success) {
      return result.data;
    }

    const error = {
      request: {
        url: options.url,
        data: options.body,
        headers: options.headers,
      },
      headers: result.headers,
      data: data,
      status: code,
    };

    throw new HttpServiceException(
      errorKey,
      HTTP_SERVICE_ERROR,
      'HttpProvider error : ' + JSON.stringify(error),
    );
  }

  protected async execute<ResponseData>(
    requestConfig: AxiosRequestConfig,
    errorKey: HttpServiceErrorKey,
  ): Promise<AxiosResponse<ResponseEntity<ResponseData>, unknown>> {
    if (!requestConfig.baseURL || !requestConfig.url || !requestConfig.method) {
      throw new HttpServiceException(
        errorKey,
        HTTP_SERVICE_ERROR,
        'Invalid request config',
      );
    }

    // url endPoint 로 구분
    const key =
      requestConfig.baseURL + requestConfig.url + requestConfig.method;
    // LRU 캐시에서 서킷 브레이커 조회
    let circuitBreakerWithRetry = this.retryWithBreakerCache.get(key);

    // 캐시에 없으면 새로 생성
    if (!circuitBreakerWithRetry) {
      const retryPolicy = retry(handleAll, {
        maxAttempts: BaseHttpService.maxRetries,
        backoff: new ExponentialBackoff({
          initialDelay: BaseHttpService.retryDelay,
        }),
      });

      const circuitBreakerPolicy = circuitBreaker(handleAll, {
        halfOpenAfter: 15000,
        breaker: new ConsecutiveBreaker(5),
      });

      circuitBreakerWithRetry = wrap(retryPolicy, circuitBreakerPolicy);

      // LRU 캐시에 저장 (자동으로 크기 제한 관리)
      this.retryWithBreakerCache.set(key, circuitBreakerWithRetry);
    }

    try {
      return await circuitBreakerWithRetry.execute(() =>
        this.httpService.axiosRef.request<ResponseEntity<ResponseData>>(
          requestConfig,
        ),
      );
    } catch (e) {
      if (e instanceof BrokenCircuitError && errorKey) {
        throw new HttpServiceException(
          errorKey,
          HTTP_SERVICE_ERROR,
          'circuit circuit broken ' + this.constructor.name,
          true,
        );
      }

      if (e instanceof AxiosError) {
        const responseInfo = e.response
          ? {
              status: e.response.status,
              statusText: e.response.statusText,
              headers: e.response.headers,
              data: e.response.data as unknown,
            }
          : 'No response received';

        throw new HttpServiceException(
          errorKey,
          HTTP_SERVICE_ERROR,
          e.message,
          {
            req: requestConfig,
            res: responseInfo,
          },
        );
      }

      if (e instanceof Error) {
        throw new HttpServiceException(
          errorKey,
          HTTP_SERVICE_ERROR,
          e.message,
          {
            req: requestConfig,
            stack: e.stack,
          },
        );
      }

      throw e;
    }
  }

  /**
   * dynamic 한 id의 경우 {id}로 치환
   */
  private _normalizeUrl(url: string): string {
    const fullUrl = `/${url}`.replace(/\/{2,}/g, '/');
    // ID 패턴 숫자를 문자열 {id}로 치환
    return fullUrl.replace(/\/\d+/g, '/{id}');
  }
}
