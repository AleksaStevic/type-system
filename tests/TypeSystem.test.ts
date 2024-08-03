import { InvalidNameError } from '@type-system/errors'
import { PrimitiveType } from '@type-system/types'
import TypeSystem from '@type-system/TypeSystem'

describe('Type Creation', () => {
	test('base type is created automatically', () => {
		const ts = new TypeSystem()
		expect(ts.base).not.toBeFalsy()
	})

	test("can't create a base type", () => {
		expect(() => new TypeSystem(['base'])).toThrow(InvalidNameError)
	})

	test("can't create two types with the same name", () => {
		expect(() => new TypeSystem(['float', 'float', 'int'])).toThrowError(
			InvalidNameError,
		)
	})

	test('Union Type Creation', () => {
		const bool = 'bool'
		const T = 'T'
		const F = 'F'

		const char = 'char'
		const a = 'a'
		const b = 'b'

		const str = 'str'
		const emptyStr = 'emptyStr'
		const nonEmptyStr = 'nonEmptyStr'

		const num = 'num'
		const real = 'real'
		const im = 'im'
		const q = 'q'
		const i = 'i'
		const int = 'int'
		const nat = 'nat'

		const ts = new TypeSystem([
			{
				name: bool,
				covered: true,
				subtypes: [T, F],
			},
			{
				name: char,
				subtypes: [a, b],
			},
			{
				name: str,
				subtypes: [emptyStr, nonEmptyStr],
				covered: true,
			},
			{
				name: num,
				covered: true,
				subtypes: [
					im,
					{
						name: real,
						covered: true,
						subtypes: [
							i,
							{
								name: q,
								subtypes: [
									{
										name: int,
										subtypes: [nat],
									},
								],
							},
						],
					},
				],
			},
		])

		expect(ts.union(nat, i).name).toBe('i|nat')
		expect(ts.union(T, i).name).toBe('T|i')
		expect(ts.union(T, F).name).toBe(bool)
		expect(ts.union(emptyStr, nonEmptyStr).name).toBe(str)
		expect(ts.union(real, im).name).toBe('num')
		expect(ts.union(q, i).name).toBe(real)
		expect(ts.union(q, i, im).name).toBe('num')
		expect(ts.union(num, nat).name).toBe(num)
		expect(ts.union(int, im, T).name).toBe('T|im|int')
		expect(() => ts.union().name).toThrow()
		expect(() => ts.union(int).name).not.toThrow()
		expect(ts.union(int).name).toBe(int)
	})
})

describe('Subtype Creation', () => {
	test("can't create a base type as subtype of any other type", () => {
		expect(
			() =>
				new TypeSystem([
					{
						name: 'number',
						subtypes: ['base'],
					},
				]),
		).toThrowError(InvalidNameError)
	})

	test("can't create two subtypes with the same name", () => {
		expect(
			() =>
				new TypeSystem([
					{
						name: 'number',
						subtypes: ['float', 'float'],
					},
				]),
		).toThrowError(InvalidNameError)
	})

	test('can create multiple subtypes at once', () => {
		expect(
			() =>
				new TypeSystem([
					{
						name: 'num',
						subtypes: ['float', 'int'],
					},
				]),
		).not.toThrow()
	})

	test("can't create a subtype that has parents p1 and p2 for which p1 extends p2", () => {
		const number = 'number'
		const int = 'int'
		const float = 'float'
		expect(
			() =>
				new TypeSystem([
					{
						name: number,
						subtypes: [
							int,
							{
								name: float,
								subtypes: [int],
							},
						],
					},
				]),
		).toThrowError(InvalidNameError)
	})
})

describe('Type Existence (Primitive types)', () => {
	test('base type always exsists', () => {
		expect(new TypeSystem().exists('base')).toBe(true)
	})

	test("type that is not created doesn't exist", () => {
		expect(new TypeSystem().exists('int')).toBe(false)
	})

	test('type that is created always exsists', () => {
		expect(new TypeSystem(['float']).exists('float')).toBe(true)
	})
})

describe('Base Type', () => {
	test('base type always exsists', () => {
		expect(new TypeSystem().base).toBeDefined()
		expect(new TypeSystem().base).toBeInstanceOf(PrimitiveType)
	})
})
