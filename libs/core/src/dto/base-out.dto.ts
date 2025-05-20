import { ClassConstructor } from 'class-transformer';

export class BaseOutDto {
  static of<T>(this: ClassConstructor<T>, partial?: Partial<T>): T {
    return Object.assign(new this() as object, partial) as T;
  }
}
