import { mutableHandler, readonlyHandler } from './baseHandler'

export const createReactiveObject = (target, handler) => {
  return new Proxy(target, handler)
}
export const reactive = (target: Record<string, any>) => {
  return createReactiveObject(target, mutableHandler)
}
export const readonly = (target: Record<string, any>) => {
  return createReactiveObject(target, readonlyHandler)
}
