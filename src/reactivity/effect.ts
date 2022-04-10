import { extend } from '../utils'

export type Dep = Set<ReactiveEffect>
export interface ReactiveEffectRunner<T = any> {
  (): T
  effect: ReactiveEffect
}
const targetMap = new WeakMap<Record<string, any>, Map<string | symbol, Dep>>()

let activeEffect: ReactiveEffect

export const cleanupEffects = (effect: ReactiveEffect) => {
  const { deps } = effect
  if (deps.length > 0) {
    for (let index = 0; index < deps.length; index++) {
      const dep = deps[index]
      dep.delete(effect)
    }

    effect.deps.length = 0
  }
}

class ReactiveEffect {
  deps: Dep[] = []
  active = true
  onStop: Function = (): void => {}

  constructor(public fn, public scheduler) {
  }

  /**
     * run
     */
  public run() {
    if (!this.active)
      return this.fn()

    activeEffect = this
    return this.fn()
  }

  /**
     * stop
     */
  public stop() {
    if (this.active) {
      cleanupEffects(this)
      this.active = false
    }
    if (this.onStop)
      this.onStop()
  }
}

export const effect = (fn: Function, options?: any): ReactiveEffectRunner => {
  const reactiveEffect = new ReactiveEffect(fn, options?.scheduler)
  extend(reactiveEffect, options)
  reactiveEffect.run()
  const runner = reactiveEffect.run.bind(reactiveEffect) as ReactiveEffectRunner
  runner.effect = reactiveEffect
  return runner
}
export const stop = (runner: ReactiveEffectRunner) => {
  runner.effect.stop()
}

export const track = (target: Record<string, any>, key: string | symbol) => {
  if (!activeEffect || !activeEffect.active)
    return

  let deps: Map<string | symbol, Dep>
  let dep: Dep

  // target => deps
  if (targetMap.has(target)) {
    deps = targetMap.get(target)!
  }
  else {
    deps = new Map()
    targetMap.set(target, deps)
  }

  // deps => dep
  if (deps.has(key)) {
    dep = deps.get(key)!
  }
  else {
    dep = new Set()
    deps.set(key, dep)
  }

  dep.add(activeEffect)

  activeEffect.deps.push(dep)
}

export const trigger = (target, key) => {
  if (!targetMap.has(target)) {
    // never been tracked
    return
  }
  const deps = targetMap.get(target)
  const dep = deps!.get(key)
  for (const effect of dep!) {
    if (effect.scheduler)
      effect.scheduler()
    else
      effect.run()
  }
}
