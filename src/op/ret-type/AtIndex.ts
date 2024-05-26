import assert from 'assert'
import Type from '../../types/Type'
import RetType from './RetType'

export class AtIndex extends RetType {
	constructor(private _i: number) {
		super()
	}

	toString(): string {
		return 'First'
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
