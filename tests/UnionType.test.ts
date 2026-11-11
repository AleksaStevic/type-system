import { Context as TypeSystem } from '@type-system/Context'

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

describe('Type name', () => {
	test('name is a string with type names separated by | (pipe char)', () => {
		expect(ts.union(str, int).name).toBe('int|str')
		expect(ts.union(str, str).name).toBe('str')
		expect(ts.union(str, int, bool).name).toBe('bool|int|str')
		expect(ts.union(q, int, nat).name).toBe('q')
	})

	test('types in union name are always sorted', () => {
		expect(ts.union(q, str, bool).name).toBe(
			['str', 'bool', 'q'].sort().join('|'),
		)
	})
})

describe('Type relations', () => {
	describe('extends()', () => {
		test('should be irreflexive', () => {
			const strOrInt = ts.union(str, int)
			const intOrIm = ts.union(int, im)
			const bool = ts.union(T, F)

			expect(strOrInt.extends(strOrInt)).toBe(false)
			expect(intOrIm.extends(intOrIm)).toBe(false)
			expect(bool.extends(bool)).toBe(false)
		})

		test('should be asymetric', () => {
			const strInt = ts.union(str, int)
			const strIntF = ts.union(str, int, F)
			expect(strInt.extends(strIntF)).toBe(true)
			expect(strIntF.extends(strInt)).toBe(false)
		})

		test('should be transitive', () => {
			const strInt = ts.union(str, int)
			const strIntBool = ts.union(str, int, bool)
			const realBoolStr = ts.union(str, real, bool)

			expect(strInt.extends(strIntBool)).toBe(true)
			expect(strIntBool.extends(realBoolStr)).toBe(true)
			expect(strInt.extends(realBoolStr)).toBe(true)
		})
	})
	describe('extendedBy()', () => {
		test('should be inverse of extends', () => {
			const strInt = ts.union(str, int)
			const strIntBool = ts.union(str, int, bool)
			expect(strIntBool.extends(strInt)).toBe(false)
			expect(strIntBool.extendedBy(strInt)).toBe(true)
		})

		test('should be irreflexive', () => {
			const strOrInt = ts.union(str, int)
			const intOrIm = ts.union(int, im)
			const bool = ts.union(T, F)

			expect(strOrInt.extendedBy(strOrInt)).toBe(false)
			expect(intOrIm.extendedBy(intOrIm)).toBe(false)
			expect(bool.extendedBy(bool)).toBe(false)
		})

		test('should be asymetric', () => {
			const strInt = ts.union(str, int)
			const strIntF = ts.union(str, int, F)
			expect(strIntF.extendedBy(strInt)).toBe(true)
			expect(strInt.extendedBy(strIntF)).toBe(false)
		})

		test('should be transitive', () => {
			const strInt = ts.union(str, int)
			const strIntBool = ts.union(str, int, bool)
			const realBoolStr = ts.union(str, real, bool)

			expect(strIntBool.extendedBy(strInt)).toBe(true)
			expect(realBoolStr.extendedBy(strIntBool)).toBe(true)
			expect(realBoolStr.extendedBy(strInt)).toBe(true)
		})
	})
	describe('assignableTo()', () => {
		test('should be reflexive', () => {
			const strInt = ts.union(str, int)
			const realT = ts.union(real, T)
			expect(strInt.assignableTo(strInt)).toBe(true)
			expect(realT.assignableTo(realT)).toBe(true)
		})

		test('should be antisymmetric', () => {
			// T1 assignable to T2 and T2 assignableTo T1 => T1 = T2
			// @TODO: should be enforced via previous rules
		})

		test('should be transitive', () => {
			const t1 = ts.union(str, int)
			const t2 = ts.union(str, int, bool)
			const t3 = ts.union(str, int, bool, real)
			// A and B => C <=> -A or -B or C
			expect(
				!t1.assignableTo(t2) || !t2.assignableTo(t3) || t1.assignableTo(t3),
			)
		})
	})
})
