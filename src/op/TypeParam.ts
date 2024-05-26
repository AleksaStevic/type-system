import assert from 'assert'
import Type from '../types/Type'

class TypeParam extends Type {
	private _t: Type | undefined = undefined

	set t(t: Type | undefined) {
		this._t = t
	}

	get t() {
		return this._t
	}

	eq(t: Type): boolean {
		return this._t?.name === t.name
	}

	extends(t: Type): boolean {
		assert(this._t, 'Not populated')
		return this._t.extends(t)
	}

	commonType(t: Type): Type | undefined {
		assert(this._t, 'Not populated')
		return this._t.commonType(t)
	}

	toString(): string {
		assert(this._t, 'Not populated')
		return this._t.toString()
	}
}

export default TypeParam
