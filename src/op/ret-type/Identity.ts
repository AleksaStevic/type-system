import Type from '../../types/Type'
import RetType from './RetType'

export class Identity extends RetType {
	constructor(private _t: Type) {
		super()
	}

	toString(): string {
		return this._t.toString()
	}

	getType(types: Type[]): Type {
		return this._t
	}
}

export function ret(t: Type) {
	return new Identity(t)
}
