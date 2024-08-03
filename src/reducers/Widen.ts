import assert from 'assert'
import { Reducer } from './Reducer'
import { Type } from '@type-system/types'
import { commonType } from '@type-system/utils'

export class Widen extends Reducer {
	toString(): string {
		return 'Widen'
	}

	getType(types: Type[]): Type {
		const ct = commonType(types)
		assert(!!ct, 'Common type does not exist.')
		return ct
	}
}

export function widen() {
	return new Widen()
}
