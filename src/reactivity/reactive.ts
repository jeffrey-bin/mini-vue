import { track, trigger } from './effect'

export const reactive = (target: Record<string, any>) => {
  return new Proxy(target, {
    get(target, key) {
      const res = Reflect.get(target, key)
      // 收集依赖
      track(target, key)
      return res
    },
    set(target, key, value) {
      Reflect.set(target, key, value)
      // 触发依赖
      trigger(target, key)
      return true
    },
  })
}
