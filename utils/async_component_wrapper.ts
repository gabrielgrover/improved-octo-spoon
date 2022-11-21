/**
 * This is a hack because react / typescript does not understand that async components are a thing
 */
export function async_component_wrapper<T, R>(
  fn: (arg: T) => Promise<R>
): (arg: T) => R {
  return fn as (arg: T) => R;
}
