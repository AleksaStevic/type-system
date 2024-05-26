import Type from '../../types/Type'
import TypeConstraint from './TypeConstraint'

export class And extends TypeConstraint {
	constructor(
		private _t1: TypeConstraint,
		private _t2: TypeConstraint,
	) {
		super()
	}

	toString(): string {
		return `${this._t1.toString()} and ${this._t2.toString()}`
	}

	isSatisfied(t: Type): boolean {
		return this._t1.isSatisfied(t) && this._t2.isSatisfied(t)
	}
}

export function and(t1: TypeConstraint, t2: TypeConstraint) {
	return new And(t1, t2)
}
