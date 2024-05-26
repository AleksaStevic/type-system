import assert from 'assert'
import Type from '../../types/Type'
import { commonType } from '../../utils'
import RetType from './RetType'

export class Widen extends RetType {
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
