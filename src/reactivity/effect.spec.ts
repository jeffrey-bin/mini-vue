import { effect } from './effect'
import { reactive } from './reactive'

describe('effet test', () => {
  test('happy path', () => {
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

    // stop
    // effectEntry.stop()

    // reactiveObj.age++
    // expect(agePlus1).toBe(20)

    // reactiveObj.name = 'daidai'
    // expect(namePlusSuper).toBe('superjeffrey')
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
})
