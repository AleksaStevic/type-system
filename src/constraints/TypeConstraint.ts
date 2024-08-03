import { Type } from '@type-system/types'

export abstract class TypeConstraint {
	abstract toString(): string
	abstract isSatisfied(t: Type): boolean
}
