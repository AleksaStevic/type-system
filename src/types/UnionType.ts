import assert from 'assert'

import TypeSystem from '@type-system/TypeSystem'

import { commonType } from '../utils'
import { PrimitiveType } from './PrimitiveType'
import { TupleType } from './TupleType'
import { Type } from './Type'

export class UnionType extends Type {
	// @TODO missing type sorting
	constructor(
		private _types: Type[] = [],
		name: string,
		private _ts: TypeSystem,
	) {
		super(name)
	}

	get types(): ReadonlyArray<Type> {
		return this._types
	}

	add(t: Type) {
		return this._ts.union(...this.types, t)
	}

	eq(t: Type): boolean {
		// @TODO: add instanceof check everywhere
		return t.name === this.name && t instanceof UnionType
	}

	extends(t: Type): boolean {
		// If they are the same type (type is uniquely identified by it's name)
		// then they don't extend each other as it should be strict partial relation.
		if (this.name === t.name) return false

		if (t instanceof PrimitiveType) {
			const ct = this.memberCommonType()
			if (!ct) return false
			return ct.extends(t)
		}

		if (t instanceof UnionType) {
			return this._types.every(mt => mt.extends(t))
		}

		if (t instanceof TupleType) return false

		assert(false, 'Not implemented')
	}

	commonType(t: Type) {
		return this.add(t)
	}

	memberCommonType() {
		return commonType(this.types)
	}

	toString() {
		return this._types.map(t => t.name).join('|')
	}
}
