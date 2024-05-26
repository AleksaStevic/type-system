import Type from '../../types/Type'
import TypeConstraint from './TypeConstraint'

export class Identity extends TypeConstraint {
	constructor(private _t: Type) {
		super()
	}

	toString(): string {
		return this._t.toString()
	}

	isSatisfied(t: Type): boolean {
		return t.name === this._t.name
	}
}

export function id(t: Type) {
	return new Identity(t)
}
