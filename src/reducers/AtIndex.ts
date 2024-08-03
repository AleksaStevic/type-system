import assert from 'assert'

import { Type } from '@type-system/types'

import { Reducer } from './Reducer'

export class AtIndex extends Reducer {
	constructor(private _i: number) {
		super()
	}

	toString(): string {
		return `[${this._i}]`
	}

	getType(types: Type[]): Type {
		assert(
			types.length > this._i,
			`Needs at least ${this._i + 1} number of types.`,
		)
		return types[this._i]
	}
}

export function atIndex(i: number) {
	return new AtIndex(i)
}

export function first() {
	return new AtIndex(0)
}

export function last() {}
