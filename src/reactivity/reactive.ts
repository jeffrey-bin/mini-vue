import { mutableHandler, readonlyHandler } from './baseHandler'
export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
}

export const createReactiveObject = (target, handler) => {
  return new Proxy(target, handler)
}
export const reactive = (target: Record<string, any>) => {
  return createReactiveObject(target, mutableHandler)
}
export const readonly = (target: Record<string, any>) => {
  return createReactiveObject(target, readonlyHandler)
}
export const isReactive = (target) => {
  return !!target[ReactiveFlags.IS_REACTIVE]
}
export const isReadonly = (target) => {
  return !!target[ReactiveFlags.IS_READONLY]
}
