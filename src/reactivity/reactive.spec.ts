import { reactive } from "./reactive";

describe('reactive test', () => {
    test('happy path', () => {
        const initialObj = {
            name: 'digua',
            age: 18
        }
        const reactiveObj = reactive(initialObj)

        //init
        expect(reactiveObj.age).toBe(18);

        //update
        reactiveObj.age++
        expect(reactiveObj.age).toBe(19);

        reactiveObj.name = 'jeffrey'
        expect(reactiveObj.name).toBe('jeffrey');


    })
});


