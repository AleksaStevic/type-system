import Type from '../../types/Type'

import TypeConstraint from './TypeConstraint'

export class Satisfies extends TypeConstraint {
	constructor(private _t: Type) {
		super()
	}

	toString(): string {
		return `Sat[${this._t.toString()}]`
	}

	isSatisfied(t: Type): boolean {
		return t.assignableTo(this._t)
	}
}

export function sat(t: Type) {
	return new Satisfies(t)
}
