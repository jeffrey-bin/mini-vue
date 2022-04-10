export type Dep = Set<ReactiveEffect>

const targetMap = new WeakMap<Record<string, any>, Map<string | symbol, Dep>>()

let activeEffect: ReactiveEffect

class ReactiveEffect {
  deps: Dep[] = []
  active = true
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
    const { deps } = this
    if (deps.length > 0 || this.active) {
      for (let index = 0; index < deps.length; index++) {
        const dep = deps[index]
        dep.delete(this)
      }
      this.active = false
      this.deps.length = 0
    }
  }
}

export const effect = (fn: Function, options?: any) => {
  const reactiveEffect = new ReactiveEffect(fn, options?.scheduler)
  reactiveEffect.run()
  return reactiveEffect.run.bind(reactiveEffect)
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

  // deps => dep(effects)
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
    console.log('target not tracked')
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
