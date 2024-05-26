import PrimitiveType from '../src/types/PrimitiveType'
import { normalize, permute } from '../src/utils'

describe('normalize(types)', () => {
	test('[] is always normalized', () => {
		expect(normalize([])).toEqual([])
	})

	test('[type] is always normalized', () => {
		const a = new PrimitiveType('a')
		expect(normalize([a])).toEqual([a])
	})

	test("normalized array doesn't contain duplicate types", () => {
		const float = new PrimitiveType('float')
		expect(normalize([float, float])).toEqual([float])
	})

	test("normalized array doesn't contain any types T and U for which T is assignable to U", () => {
		const number = new PrimitiveType('number')
		const float = new PrimitiveType('float')
		const int = new PrimitiveType('int')
		const char = new PrimitiveType('char')
		const string = new PrimitiveType('string')
		const bool = new PrimitiveType('bool')
		const t = new PrimitiveType('true')
		const f = new PrimitiveType('false')
		const base = new PrimitiveType('base')
		int.parent = float
		float.parent = number
		number.parent = base
		string.parent = base
		char.parent = base
		bool.parent = base
		t.parent = bool
		f.parent = bool

		expect(normalize([number, int])).toEqual([number])
		expect(normalize([number, float])).toEqual([number])
		expect(normalize([float, int])).toEqual([float])
		expect(normalize([float, int, number])).toEqual([number])
		expect(normalize([float, int, char])).toEqual([float, char])
		expect(normalize([int, base])).toEqual([base])
		expect(normalize([float, char, string])).toEqual([float, char, string])
		expect(normalize([char, string, bool])).toEqual([char, string, bool])
		expect(normalize([float, char, int, base])).toEqual([base])
		expect(normalize([char, string, float, int, bool, base])).toEqual([base])
		expect(normalize([int, float, t, bool])).toEqual([float, bool])
		expect(normalize([int, int, float, float])).toEqual([float])
	})

	test("array order doesn't matter", () => {
		const number = new PrimitiveType('number')
		const float = new PrimitiveType('float')
		const char = new PrimitiveType('char')
		float.parent = number

		const types = [number, float, char]

		for (const permutation of permute(types)) {
			try {
				expect(normalize(permutation)).toEqual([number, char])
			} catch (e) {
				expect(normalize(permutation)).toEqual([char, number])
			}
		}
	})
})

describe('permute(arr)', () => {
	test('permute([])=[]', () => {
		expect(permute([])).toEqual([[]])
		expect(permute(['a'])).toEqual([['a']])
	})

	test('correctly generates all permuations of array', () => {
		expect(permute(['a', 'b', 'c'])).toEqual([
			['a', 'b', 'c'],
			['b', 'a', 'c'],
			['c', 'a', 'b'],
			['a', 'c', 'b'],
			['b', 'c', 'a'],
			['c', 'b', 'a'],
		])
	})
})
