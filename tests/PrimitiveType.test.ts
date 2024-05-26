import PrimitiveType from '../src/types/PrimitiveType'

describe('Type parents', () => {
	describe('set parent()', () => {
		test("can't add self as parent", () => {
			const t = new PrimitiveType('t')
			expect(() => (t.parent = t)).toThrow()
		})

		test("can't add direct/indirect child as parent", () => {
			const t1 = new PrimitiveType('t1')
			const t2 = new PrimitiveType('t2')
			t1.parent = t2
			expect(() => (t2.parent = t1)).toThrow()

			const u1 = new PrimitiveType('u1')
			const u2 = new PrimitiveType('u2')
			const u3 = new PrimitiveType('u3')
			u1.parent = u2
			u2.parent = u3
			expect(() => (u3.parent = u1)).toThrow()
		})
	})
})

describe('Type name', () => {
	test("can't create a type with empty name", () => {
		expect(() => new PrimitiveType('')).toThrow()
	})

	test('get name() always returns a non-empty string', () => {
		const t = new PrimitiveType('t')
		expect(typeof t.name).toBe('string')
		expect(typeof t.name).toBeTruthy()
	})
})

describe('Type relations', () => {
	describe('extends()', () => {
		test('t1 should extend t2 if t2 is direct parent of t1', () => {
			const t1 = new PrimitiveType('t1')
			const t2 = new PrimitiveType('t2')
			t1.parent = t2
			expect(t1.extends(t2)).toBe(true)
		})

		test('t1 should extend t2 if t2 is indirect parent of t1', () => {
			const t = new PrimitiveType('t1')
			const m = new PrimitiveType('m1')
			const p = new PrimitiveType('p1')
			t.parent = m
			m.parent = p
			expect(t.extends(p)).toBe(true)
		})

		test('t1 should not extend if t2 if t2 is not direct/indirect parent of t1', () => {
			const t1 = new PrimitiveType('t1')
			const t2 = new PrimitiveType('t2')
			const p1 = new PrimitiveType('p1')
			const p2 = new PrimitiveType('p2')
			const pp = new PrimitiveType('pp')
			t1.parent = p1
			t2.parent = p2
			p1.parent = pp
			p2.parent = pp
			expect(t1.extends(t2)).toBe(false)
			expect(t2.extends(t1)).toBe(false)
			expect(p1.extends(t1)).toBe(false)
			expect(p2.extends(t2)).toBe(false)
			expect(pp.extends(p1)).toBe(false)
			expect(pp.extends(p2)).toBe(false)
		})

		test('should be irreflexive', () => {
			const t = new PrimitiveType('t')
			expect(t.extends(t)).toBe(false)
		})

		test('should be asymmetric', () => {
			const t1 = new PrimitiveType('t1')
			const t2 = new PrimitiveType('t2')
			const p1 = new PrimitiveType('p1')
			const p2 = new PrimitiveType('p2')
			const pp = new PrimitiveType('pp')
			t1.parent = p1
			t2.parent = p2
			p1.parent = pp
			p2.parent = pp

			expect(p1.extends(t1)).toBe(false)
			expect(p2.extends(t2)).toBe(false)
			expect(pp.extends(p1)).toBe(false)
			expect(pp.extends(t1)).toBe(false)
		})

		test('should be transitive', () => {
			const t1 = new PrimitiveType('t1')
			const t2 = new PrimitiveType('t2')
			const t3 = new PrimitiveType('t3')
			t1.parent = t2
			t2.parent = t3
			// A and B => C <=> -A or -B or C
			expect(!t1.extends(t2) || !t2.extends(t3) || t1.extends(t3))
		})
	})

	describe('extendedBy()', () => {
		test('t1 should be extended by t2 if t1 is direct parent of t2', () => {
			const t1 = new PrimitiveType('t1')
			const t2 = new PrimitiveType('t2')
			t2.parent = t1
			expect(t1.extendedBy(t2)).toBe(true)
		})

		test('t1 should be extended by t2 if t1 is indirect parent of t2', () => {
			const t1 = new PrimitiveType('t1')
			const tm = new PrimitiveType('m1')
			const t2 = new PrimitiveType('p1')
			t1.parent = tm
			tm.parent = t2
			expect(t2.extendedBy(t1)).toBe(true)
		})

		test('t1 should not be extended by t2 if t1 is not direct/indirect parent of t2', () => {
			const t1 = new PrimitiveType('t1')
			const t2 = new PrimitiveType('t2')
			const p1 = new PrimitiveType('p1')
			const p2 = new PrimitiveType('p2')
			const pp = new PrimitiveType('pp')
			t1.parent = p1
			t2.parent = p2
			p1.parent = pp
			p2.parent = pp
			expect(t2.extendedBy(t1)).toBe(false)
			expect(t1.extendedBy(t2)).toBe(false)
			expect(t1.extendedBy(p1)).toBe(false)
			expect(t2.extendedBy(p2)).toBe(false)
			expect(p1.extendedBy(p2)).toBe(false)
			expect(p2.extendedBy(pp)).toBe(false)
		})

		test('should be irreflexive', () => {
			const t = new PrimitiveType('t')
			expect(t.extendedBy(t)).toBe(false)
		})

		test('should be asymmetric', () => {
			// @TODO: this is enforced in addParent
		})

		test('should be transitive', () => {
			const t1 = new PrimitiveType('t1')
			const t2 = new PrimitiveType('t2')
			const t3 = new PrimitiveType('t3')
			t1.parent = t2
			t2.parent = t3
			// A and B => C <=> -A or -B or C
			expect(!t2.extendedBy(t1) || !t3.extendedBy(t2) || t3.extendedBy(t1))
		})
	})

	describe('assignableTo()', () => {
		test('t1 is assignable to t2 if t2 is direct parent of t1', () => {
			const t1 = new PrimitiveType('t1')
			const t2 = new PrimitiveType('t2')
			t1.parent = t2
			expect(t1.assignableTo(t2)).toBe(true)
			expect(t1.assignableTo(t1)).toBe(true)
		})

		test('t1 is assignable to t2 if t2 is indirect parent of t1', () => {
			const t = new PrimitiveType('t1')
			const m = new PrimitiveType('m1')
			const p = new PrimitiveType('p1')
			t.parent = m
			m.parent = p
			expect(t.assignableTo(p)).toBe(true)
		})

		test('t1 should not be assignable to t2 if t2 is not direct/indirect parent of t1 and t2 != t1', () => {
			const t1 = new PrimitiveType('t1')
			const t2 = new PrimitiveType('t2')
			const p1 = new PrimitiveType('p1')
			const p2 = new PrimitiveType('p2')
			const pp = new PrimitiveType('pp')
			t1.parent = p1
			t2.parent = p2
			p1.parent = pp
			p2.parent = pp
			expect(t1.assignableTo(t2)).toBe(false)
			expect(t2.assignableTo(t1)).toBe(false)
			expect(p1.assignableTo(t1)).toBe(false)
			expect(p2.assignableTo(t2)).toBe(false)
			expect(pp.assignableTo(p1)).toBe(false)
			expect(pp.assignableTo(p2)).toBe(false)
		})

		test('should be reflexive', () => {
			const t = new PrimitiveType('t')
			expect(t.assignableTo(t)).toBe(true)
		})

		test('should be antisymmetric', () => {
			// T1 assignable to T2 and T2 assignableTo T1 => T1 = T2
			// @TODO: should be enforced via previous rules
		})

		test('should be transitive', () => {
			const t1 = new PrimitiveType('t1')
			const t2 = new PrimitiveType('t2')
			const t3 = new PrimitiveType('t3')
			t1.parent = t2
			t2.parent = t3
			// A and B => C <=> -A or -B or C
			expect(
				!t1.assignableTo(t2) || !t2.assignableTo(t3) || t1.assignableTo(t3),
			)
		})
	})
})

describe('Type operations', () => {
	describe('commonType(t1, t2)', () => {
		test('commonType(t, t) = t', () => {
			const t = new PrimitiveType('t')
			expect(t.commonType(t)).toBe(t)
		})

		test('commonType(t, p) = p where p is parent of t', () => {
			const t = new PrimitiveType('t')
			const p = new PrimitiveType('p')
			t.parent = p

			expect(t.commonType(p)).toBe(p)
		})

		test('commonType(t1, t2) = p where p is parent of t1 and t2', () => {
			const Q = new PrimitiveType('Q')
			const I = new PrimitiveType('I')
			const R = new PrimitiveType('R')
			Q.parent = R
			I.parent = R

			expect(Q.commonType(I)).toBe(R)
		})

		test('commonType(t1, t2) = p where both t1 and t2 extend p', () => {
			const nat = new PrimitiveType('nat')
			const int = new PrimitiveType('int')
			const Q = new PrimitiveType('Q')
			const I = new PrimitiveType('I')
			const R = new PrimitiveType('R')
			nat.parent = int
			int.parent = Q
			Q.parent = R
			I.parent = R

			expect(nat.commonType(I)).toBe(R)
		})

		test("commonType(t1, t2) = undefined if t1 and t2 don't share any parents", () => {
			const I = new PrimitiveType('I')
			const Q = new PrimitiveType('Q')
			expect(I.commonType(Q)).toBe(undefined)
		})

		test('commonType(t1,t2) = commonType(t2, t1)', () => {
			const nat = new PrimitiveType('nat')
			const int = new PrimitiveType('int')
			const Q = new PrimitiveType('Q')
			const I = new PrimitiveType('I')
			const R = new PrimitiveType('R')
			nat.parent = int
			int.parent = Q
			Q.parent = R
			I.parent = R

			expect(nat.commonType(I)).toBe(R)
			expect(I.commonType(nat)).toBe(R)
		})

		test('commonType(t1, t2) is minimal', () => {
			const nat = new PrimitiveType('nat')
			const int = new PrimitiveType('int')
			const Q = new PrimitiveType('Q')
			const I = new PrimitiveType('I')
			const R = new PrimitiveType('R')
			const num = new PrimitiveType('num')
			nat.parent = int
			int.parent = Q
			Q.parent = R
			I.parent = R
			R.parent = num

			expect(nat.commonType(I)).toBe(R)
			expect(nat.commonType(int)).toBe(int)
		})
	})
})
