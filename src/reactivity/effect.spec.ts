import { effect, stop } from './effect'
import { reactive } from './reactive'

describe('effect test', () => {
  test('should update correctly', () => {
    const initialObj = {
      name: 'digua',
      age: 18,
    }
    const reactiveObj = reactive(initialObj)

    // init
    let agePlus1
    let namePlusSuper
    effect(() => {
      agePlus1 = reactiveObj.age + 1
      namePlusSuper = `super${reactiveObj.name}`
    })
    expect(agePlus1).toBe(19)
    expect(namePlusSuper).toBe('superdigua')

    // update
    reactiveObj.age++
    expect(agePlus1).toBe(20)

    reactiveObj.name = 'jeffrey'
    expect(namePlusSuper).toBe('superjeffrey')
  })
  it('should return runner when call effect', () => {
    let account = 1
    const runner = effect(() => {
      account++
      return 'foo'
    })
    expect(runner()).toBe('foo')
    expect(account).toBe(3)
  })
  it('scheduler', () => {
    let dummy
    let runnerInScheduler: any
    let runner: any
    const obj = reactive({ foo: 1 })
    const scheduler = jest.fn(() => {
      runnerInScheduler = runner
    })

    runner = effect(
      () => {
        dummy = obj.foo
      },
      { scheduler },
    )

    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)
    // should be called on first trigger
    obj.foo++
    expect(scheduler).toHaveBeenCalledTimes(1)
    // should not run yet
    expect(dummy).toBe(1)
    // manually run
    runnerInScheduler()
    // should have run
    expect(dummy).toBe(2)
  })
  it('stop', () => {
    let dummy
    const obj = reactive({ prop: 1 })
    const runner = effect(() => {
      dummy = obj.prop
    })
    obj.prop = 2
    expect(dummy).toBe(2)
    stop(runner)
    obj.prop = 3
    expect(dummy).toBe(2)
    obj.prop++
    expect(dummy).toBe(2)
    // stopped effect should still be manually callable
    runner()
    expect(dummy).toBe(4)
  })

  it('events: onStop', () => {
    const onStop = jest.fn()
    const runner = effect(() => {}, {
      onStop,
    })

    stop(runner)
    expect(onStop).toHaveBeenCalled()
  })
})
