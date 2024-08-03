import { Type } from '@type-system/types'

import { Reducer } from './Reducer'

export class Identity extends Reducer {
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
