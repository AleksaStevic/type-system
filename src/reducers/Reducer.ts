import { Type } from '@type-system/types'

export abstract class Reducer {
	abstract toString(): string
	abstract getType(types: Type[]): Type
}
