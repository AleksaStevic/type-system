import Type from '../../types/Type'
import TypeConstraint from './TypeConstraint'

export class Larger extends TypeConstraint {
	constructor(private _t: Type) {
		super()
	}

	toString(): string {
		return `Larger[${this._t.toString()}]`
	}

	isSatisfied(t: Type): boolean {
		return this._t.assignableTo(t)
	}
}

export function larger(t: Type) {
	return new Larger(t)
}
