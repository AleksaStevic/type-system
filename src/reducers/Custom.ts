import { Type } from '@type-system/types'
import { Reducer } from './Reducer'

export class Custom extends Reducer {
	constructor(
		private _getType: (types: Type[]) => Type,
		private _toString: string,
	) {
		super()
	}

	toString(): string {
		return this._toString
	}

	getType(types: Type[]): Type {
		return this._getType(types)
	}
}

export function custom(cb: (types: Type[]) => Type, toString: string) {
	return new Custom(cb, toString)
}
