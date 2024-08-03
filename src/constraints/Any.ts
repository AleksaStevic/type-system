import { Type } from '@type-system/types'

import { TypeConstraint } from './TypeConstraint'

export class Any extends TypeConstraint {
	toString(): string {
		return 'any'
	}

	isSatisfied(t: Type): boolean {
		return true
	}
}

export function any() {
	return new Any()
}
