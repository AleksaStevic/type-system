/**
 * Represents a general Type in the type system.
 * Each specific type must extend this abstract class.
 */
abstract class Type {
	/**
	 * Constructs a new Type instance.
	 *
	 * Every Type instance is uniquely identified by its type name.
	 *
	 * @param _name The name that identifies the type. It must be non-empty.
	 */
	constructor(private _name: string) {
		if (!this._name) throw new Error('Type name cannot be empty string.')
	}

	/**
	 * Checks if the current type is a subtype of the provided type `t`.
	 *
	 * This function adheres to a strict partial order relation between types:
	 * - Irreflexive: A type `T` is never a subtype of itself, i.e., `T < T` is false.
	 * - Asymmetric: For any types `T` and `U`, if `T` is a subtype of `U`, `U` is not a subtype of `T`.
	 * - Transitive: For any types `T`, `U`, and `V`, if `T` is a subtype of `U` and `U` is a subtype of `V`, then `T` is a subtype of `V`.
	 *
	 * @param t The type against which the subtype check is performed.
	 * @returns True if `this` is a subtype of `t`, false otherwise.
	 */
	abstract extends(t: Type): boolean

	/**
	 * Check whether types are equal.
	 *
	 * @param t Other type
	 */
	abstract eq(t: Type): boolean

	/**
	 * Determines the least upper bound type for two types.
	 *
	 * Given the current type `T` and the provided type `U`, this method returns
	 * the "lowest" type `V` such that both `T` and `U` are assignable to `V` (or `T <= V` and `U <= V`).
	 * If no such type exists, it returns `undefined`.
	 *
	 * @param t The type to combine with the current type.
	 * @returns The least upper bound type or `undefined` if it doesn't exist.
	 */
	abstract commonType(t: Type): Type | undefined

	/**
	 * Returns a string representation of the type.
	 *
	 * @returns The string representation of the type.
	 */
	abstract toString(): string

	/**
	 * Gets the name that uniquely identifies the type.
	 *
	 * @returns The name of the type.
	 */
	get name() {
		return this._name
	}

	/**
	 * Checks if the current type is extended by the provided type `t`.
	 *
	 * This is the inverse relation to the `extends` method.
	 *
	 * @param t The type to check.
	 * @returns True if `t` is a subtype of `this`, false otherwise.
	 */
	extendedBy(t: Type) {
		return t.extends(this)
	}

	/**
	 * Checks if the current type extends the provided type `t` or if they are the same type.
	 *
	 * This method adheres to a partial order relation between types:
	 * - Reflexive: A type T is assignable to itself.
	 * - Antisymmetric: For any types T and U, if T is assignable to U and U is assignable to T, then T and U are the same type.
	 * - Transitive: For any types T, U, and V, if T is assignable to U and U is assignable to V, then T is assignable to V.
	 *
	 * Note: Unlike the `extends` method, this relation is not strict.
	 *
	 * @param t The type to check.
	 * @returns True if `this` is a subtype of `t` or they are the same type, false otherwise.
	 */
	assignableTo(t: Type) {
		return this.extends(t) || this.name === t.name
	}
}

export default Type
