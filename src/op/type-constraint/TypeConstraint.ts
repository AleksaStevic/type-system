import Type from '../../types/Type'

abstract class TypeConstraint {
	abstract toString(): string
	abstract isSatisfied(t: Type): boolean
}

export default TypeConstraint
