import Type from '../../types/Type'

abstract class RetType {
	abstract toString(): string
	abstract getType(types: Type[]): Type
}

export default RetType
