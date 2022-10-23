export type Fn<T, R> = (t: T) => R;

export function isFunction<T>(fn: T) {
  return typeof fn === 'function';
}
