import { ErrorMap } from '../exception/abstract-server-exception';

let globalErrorMap: ErrorMap<string> | null = null;

export const setGlobalErrorMap = (errorMap: ErrorMap<string>) => {
  globalErrorMap = errorMap;
};

export const getGlobalErrorMap = (): ErrorMap<string> => {
  if (!globalErrorMap) {
    throw new Error('Global error map has not been set.');
  }
  return globalErrorMap;
};
