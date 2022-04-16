import { track, trigger } from './effect'
import { ReactiveFlags } from './reactive'
export const createGetter = (isReadonly: boolean) => {
  return function(target, key) {
    const res = Reflect.get(target, key)
    if (key === ReactiveFlags.IS_REACTIVE)
      return !isReadonly

    else if (key === ReactiveFlags.IS_READONLY)
      return isReadonly

    if (!isReadonly) {
      // track deps
      track(target, key)
    }

    return res
  }
}
export const createSetter = () => {
  return function(target, key, value) {
    Reflect.set(target, key, value)
    // 触发依赖
    trigger(target, key)
    return true
  }
}
const get = createGetter(false)
const set = createSetter()
const readonlyGet = createGetter(true)

export const mutableHandler = {
  get,
  set,
}
export const readonlyHandler = {
  get: readonlyGet,
  // the logic below is too simple to use createSetter
  set() {
    console.warn('can not set on readonly object')
    return true
  },
}
