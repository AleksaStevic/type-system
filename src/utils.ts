import assert from 'assert'
import { Type } from '@type-system/types'

/**
 * Normalizes an array of types. Doesn't modify the input array, returns a new array.
 *
 * Type array is said to be normalized if:
 * there don't exist types T and U for which T is assignable to U.
 *
 * @param types Input array
 * @returns Normalized array of types
 */
export function normalize<T extends Type>(types: T[]) {
	let normalized: T[] = []

	for (const type of types) {
		if (normalized.some(t => type.assignableTo(t))) continue
		normalized = normalized.filter(t => !t.assignableTo(type))
		normalized.push(type)
	}

	return normalized
}

/**
 * Generates all combinations of `k` elements from array
 *
 * @example
 * choose(3, [a, b, c, d])
 * // [a, b, c]
 * // [a, b, d]
 * // [a, c, d]
 * // [b, c, d]
 *
 * @param k Combination length
 * @param arr Source array
 * @returns Array containing all combinations of length `k`
 */
export function choose<T>(k: number, arr: readonly T[]) {
	const sourceLength = arr.length
	if (k > sourceLength) return []

	const combos: T[][] = [] // Stores valid combinations as they are generated.

	// Accepts a partial combination, an index into sourceArray,
	// and the number of elements required to be added to create a full-length combination.
	// Called recursively to build combinations, adding subsequent elements at each call depth.
	const makeNextCombos = (
		workingCombo: T[],
		currentIndex: number,
		remainingCount: number,
	) => {
		const oneAwayFromComboLength = remainingCount == 1

		// For each element that remaines to be added to the working combination.
		for (
			let sourceIndex = currentIndex;
			sourceIndex < sourceLength;
			sourceIndex++
		) {
			// Get next (possibly partial) combination.
			const next = [...workingCombo, arr[sourceIndex]]

			if (oneAwayFromComboLength) {
				// Combo of right length found, save it.
				combos.push(next)
			} else {
				// Otherwise go deeper to add more elements to the current partial combination.
				makeNextCombos(next, sourceIndex + 1, remainingCount - 1)
			}
		}
	}

	makeNextCombos([], 0, k)
	return combos
}

/**
 * Generates all possible combinations of length from 2 to `array.length`
 *  of elements from array.
 * @param arr
 * @returns Array containing all possible combinations
 */
export function allCombos<T>(arr: readonly T[]) {
	const allCombinations = []
	for (let i = 2; i <= arr.length; ++i) {
		allCombinations.push(...choose(i, arr))
	}

	return allCombinations
}

/**
 * Generates all permutations of an array.
 *
 * @param arr
 * @returns Array containing all permutations.
 */
export function permute<T>(arr: T[]) {
	let length = arr.length,
		result = [[...arr]],
		c = new Array(length).fill(0),
		i = 1,
		k,
		p

	while (i < length) {
		if (c[i] < i) {
			k = i % 2 && c[i]
			p = arr[i]
			arr[i] = arr[k]
			arr[k] = p
			++c[i]
			i = 1
			result.push(arr.slice())
		} else {
			c[i] = 0
			++i
		}
	}
	return result
}

export function commonType(types: ReadonlyArray<Type>) {
	let ct: Type = types[0]
	for (let i = 1; i < types.length; ++i) {
		let t = types[i].commonType(ct)
		if (!t) return undefined
		ct = t
	}
	return ct
}

export function* zip<U, V>(arr1: U[], arr2: V[]) {
	assert(arr1.length === arr2.length, 'Arrays are not the same length.')
	for (let i = 0; i < arr1.length; ++i) yield [arr1[i], arr2[i]] as [U, V]
}

export function splitArray<T>(
	original: readonly T[],
	condition: (v: T) => boolean,
): [satisfiesCondition: T[], rest: T[]] {
	const satisfiesCondition = []
	const rest = []
	for (const val of original) {
		if (condition(val)) satisfiesCondition.push(val)
		else rest.push(val)
	}

	return [satisfiesCondition, rest]
}
