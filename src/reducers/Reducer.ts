import { Type } from '@type-system/types'

/**
 * Reducer is a class that represents a type reducer function.
 * It is used to reduce a list of types to a single type.
 * It is commonly used with operations to specify the type of the result.
 */
export abstract class Reducer {
	abstract toString(): string
	abstract getType(types: Type[]): Type
}
