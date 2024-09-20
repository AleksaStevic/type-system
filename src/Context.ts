import assert from 'assert'

import { InvalidNameError, UnknownTypeError } from './errors'
import { PrimitiveType } from './types/PrimitiveType'
import { Type } from './types/Type'
import { UnionType } from './types/UnionType'
import { normalize, splitArray } from './utils'

type TypeDef =
	| {
			name: string
			covered?: boolean
			subtypes: TypeDef[]
	  }
	| string

export class Context {
	private _types: Map<string, PrimitiveType> = new Map([
		['base', new PrimitiveType('base')],
	])

	private _coveredTypes: Map<string[], PrimitiveType> = new Map()

	constructor(defs: TypeDef[] = []) {
		assert(
			this._types.get('base') instanceof PrimitiveType,
			"'base' type is not primitive.",
		)

		if (!defs) return
		for (const def of defs) {
			this.createTypeFromTypeDef(def)
		}
	}

	/**
	 * @param names Type names (of primitive types) or type objects
	 *
	 * @returns Union type name or undefined if there is no reason to
	 * create union type. For example: if the reduced type is a primitive type in the end:
	 * `real (reals) | im (imaginary numbers)` union is reduced to `num` (all numbers)
	 * which is a primitive type.
	 */
	union(...names: (string | Type)[]): Type {
		assert(names.length > 0, 'Needs at least one argument.')
		if (names.length === 1)
			return typeof names[0] === 'string' ? this.primitive(names[0]) : names[0]

		const cleanedTypes = this.reduceTypeArray(
			names.flatMap(t => {
				if (typeof t === 'string') return this.primitive(t)
				if (t instanceof UnionType) return t.types
				return t
			}),
		)

		const name = cleanedTypes
			.map(t => t.name)
			.sort()
			.join('|')

		const normalized = normalize(cleanedTypes)
		if (normalized.length === 1) return normalized[0]
		return new UnionType(normalized, name, this)
	}

	/**
	 * Checks whether type exsists in this type system.
	 *
	 * @param name Type name.
	 * @returns Wether type exsists.
	 */
	exists(name: string) {
		return this._types.has(name)
	}

	/**
	 * The base (root) type.
	 */
	get base(): PrimitiveType {
		return this._types.get('base') as PrimitiveType
	}

	primitive(name: string) {
		const t = this._types.get(name)
		if (!t) throw new UnknownTypeError(name)
		assert(t instanceof PrimitiveType, `Type '${name}' is not primitive type.`)
		return t
	}

	private addType(name: string) {
		if (this._types.has(name)) throw new InvalidNameError(name)
		const type = new PrimitiveType(name)
		this._types.set(name, type)
		return type
	}

	private addCoveredType(names: string[], type: PrimitiveType) {
		const key = [...names].sort()
		if (this.getCoveredType(key))
			throw new Error(`Covered type for ${names} already exists.`)
		this._coveredTypes.set(key, type)
		return key
	}

	private getCoveredType(names: string[]) {
		const key = [...names].sort()
		for (const [k, v] of this._coveredTypes.entries()) {
			if (JSON.stringify(k) === JSON.stringify(key)) return v
		}
	}

	private createTypeFromTypeDef(type: TypeDef, parent = this.base) {
		const covered = typeof type === 'string' ? false : !!type.covered
		const subtypes = typeof type === 'string' ? [] : type.subtypes
		const name = typeof type === 'string' ? type : type.name
		assert(
			!covered || subtypes.length > 1,
			`Can't add covered type '${name}' if it hass less than 2 subtypes: '${subtypes}'.`,
		)
		const t = this.addType(name)
		t.parent = parent

		for (const subtype of subtypes) {
			this.createTypeFromTypeDef(subtype, t)
		}

		if (covered) {
			const subtypeNames = subtypes
				.map(t => (typeof t === 'string' ? t : t.name))
				.sort()
			this.addCoveredType(subtypeNames, t)
		}
	}

	/**
	 * Cleans the provided array of type names by replacing multiple types
	 * that cover the same parent type with that parent type.
	 *
	 * @example We know that `Bool` is actually `True | False`.
	 * ```
	 * const types = this.reduceTypeArray([True, False, Int])
	 * console.log(types) // [Bool, Int]
	 * ```
	 * @param types
	 *
	 * @returns Cleaned array
	 */
	public reduceTypeArray(types: readonly Type[]) {
		const [primitiveTypes, otherTypes] = splitArray(
			types,
			t => t instanceof PrimitiveType,
		)
		let primitiveTypeNames = primitiveTypes.map(t => t.name)
		let repeat
		do {
			repeat = false
			for (const [subtypes, coveredType] of this._coveredTypes) {
				if (!subtypes.every(st => primitiveTypeNames.includes(st))) continue

				primitiveTypeNames = primitiveTypeNames
					.filter(n => !subtypes.includes(n))
					.concat([coveredType.name])
				repeat = true
			}
		} while (repeat)

		return primitiveTypeNames
			.map<Type>(name => this.primitive(name))
			.concat(otherTypes)
	}
}
