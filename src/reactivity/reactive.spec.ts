import { isReactive, isReadonly, reactive, readonly } from './reactive'

describe('reactive test', () => {
  test('normal reactive', () => {
    const initialObj = {
      name: 'digua',
      age: 18,
    }
    const reactiveObj = reactive(initialObj)

    // init
    expect(reactiveObj.age).toBe(18)

    // update
    reactiveObj.age++
    expect(reactiveObj.age).toBe(19)

    reactiveObj.name = 'jeffrey'
    expect(reactiveObj.name).toBe('jeffrey')
  })
  it('readonly', () => {
    const initialObj = {
      name: 'digua',
      age: 18,
    }
    const reactiveObj = readonly(initialObj)
    reactiveObj.age = 18
  })
  it('can not set on readonly object', () => {
    console.warn = jest.fn()
    const initialObj = {
      name: 'digua',
      age: 18,
    }
    const reactiveObj = readonly(initialObj)

    // update
    reactiveObj.age++
    expect(console.warn).toBeCalled()
  })

  it('is reactive', () => {
    const initialObj = {
      name: 'digua',
      age: 18,
    }

    const reactiveObj = reactive(initialObj)
    expect(isReactive(reactiveObj)).toBe(true)
    expect(isReactive (initialObj)).toBe(false)
  })
  it('is readonly ', () => {
    const initialObj = {
      name: 'digua',
      age: 18,
    }

    const readonlyObj = readonly(initialObj)
    expect(isReadonly(readonlyObj)).toBe(true)
    expect(isReadonly(initialObj)).toBe(false)
  })
})
