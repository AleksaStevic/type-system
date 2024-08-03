import { PrimitiveType, StructType } from '@type-system/types'

describe('StructType', () => {
	test("Can't create a StructType with no subtypes", () => {
		expect(() => new StructType({})).toThrow()
	})

	test('toString', () => {
		const tPerson = new StructType({
			name: new PrimitiveType('str'),
			age: new PrimitiveType('int'),
		})

		expect(tPerson.toString()).toBe('{age:int,name:str}')
	})

	test('subtypes are always sorted', () => {
		const tAnimal = new StructType({
			age: new PrimitiveType('int'),
			name: new PrimitiveType('str'),
			bark: new PrimitiveType('bool'),
		})

		const anotherAnimal = new StructType({
			name: new PrimitiveType('str'),
			bark: new PrimitiveType('bool'),
			age: new PrimitiveType('int'),
		})

		expect(tAnimal.toString()).toBe(anotherAnimal.toString())
		expect(tAnimal.toString()).toBe('{age:int,bark:bool,name:str}')
		expect(anotherAnimal.toString()).toBe('{age:int,bark:bool,name:str}')
	})

	test('order of subtypes does not matter', () => {
		const int = new PrimitiveType('int')
		const str = new PrimitiveType('str')
		const bool = new PrimitiveType('bool')

		const tAnimal = new StructType({
			age: int,
			name: str,
			canFly: bool,
		})

		const anotherAnimal = new StructType({
			name: str,
			canFly: bool,
			age: int,
		})

		expect(tAnimal.assignableTo(anotherAnimal)).toBe(true)
		expect(anotherAnimal.assignableTo(tAnimal)).toBe(true)
		expect(tAnimal.eq(anotherAnimal)).toBe(true)
	})

	test('commonType', () => {
		const tPerson = new StructType({
			name: new PrimitiveType('str'),
			age: new PrimitiveType('int'),
		})

		const tAnimal = new StructType({
			name: new PrimitiveType('str'),
			age: new PrimitiveType('int'),
		})

		const tThing = new StructType({
			name: new PrimitiveType('str'),
		})

		expect(tPerson.commonType(tAnimal)?.eq(tPerson)).toBe(true)
		expect(tPerson.commonType(tAnimal)?.eq(tAnimal)).toBe(true)
		expect(tPerson.commonType(tThing)?.eq(tThing)).toBe(true)
	})

	test('StructType.extends', () => {
		const tPerson = new StructType({
			name: new PrimitiveType('str'),
			age: new PrimitiveType('int'),
		})

		const tWoman = StructType.extends(tPerson, {
			hairColor: new PrimitiveType('str'),
		})

		expect(tWoman.extends(tPerson)).toBe(true)
		expect(tWoman.assignableTo(tPerson)).toBe(true)
		expect(tWoman.eq(tPerson)).toBe(false)
	})
})
