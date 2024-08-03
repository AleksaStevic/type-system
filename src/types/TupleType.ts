import { PrimitiveType } from './PrimitiveType'
import { Type } from './Type'
import { UnionType } from './UnionType'

export class TupleType extends Type {
	constructor(private _types: Type[]) {
		super(`(${_types.map(t => t.name).join(',')})`)
	}

	eq(t: Type): boolean {
		return this.name === t.name
	}

	extends(t: Type): boolean {
		if (t instanceof TupleType) {
			if (this.name === t.name) return false
			if (this._types.length !== t._types.length) return false
			return this._types.every((mt, i) => mt.extends(t._types[i]))
		}

		if (t instanceof UnionType) {
			const tuples = t.types.filter(
				(tt): tt is TupleType => tt instanceof TupleType,
			)

			return tuples.some(tuple => this.extends(tuple))
		}

		return false
	}

	commonType(t: Type): Type | undefined {
		return this.name === t.name ? t : undefined
	}

	toString(): string {
		return this.name
	}
}
