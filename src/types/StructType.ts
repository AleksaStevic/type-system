import assert from 'assert'
import Type from './Type'
import UnionType from './UnionType'

class StructType extends Type {
	constructor(private _props: Record<string, Type>) {
		assert(
			Object.keys(_props).length > 0,
			"Can't create a struct type with no props.",
		)
		const propNames = Object.entries(_props)
			.sort((p1, p2) => (p1[0] < p2[0] ? -1 : p1[0] === p2[0] ? 0 : 1))
			.map(p => `${p[0]}:${p[1].toString()}`)
			.join(',')
		super(`{${propNames}}`)
	}

	extends(t: Type): boolean {
		if (this.eq(t)) return false

		if (t instanceof UnionType)
			return t.types.find(t => this.assignableTo(t)) !== undefined
		if (!(t instanceof StructType)) return false

		const myProps = Object.keys(this._props)
		const otherProps = Object.keys(t._props)

		if (!otherProps.every(p => myProps.includes(p))) return false

		if (!otherProps.every(p => t._props[p].eq(this._props[p]))) return false

		return true
	}

	eq(t: Type): boolean {
		return t.name === this.name
	}

	commonType(t: Type): Type | undefined {
		if (this.eq(t)) return this
		if (t instanceof UnionType && this.extends(t)) return t
		if (!(t instanceof StructType)) return undefined

		const myProps = Object.keys(this._props)
		const otherProps = Object.keys(t._props)

		const commonProps = new Set(
			[...myProps, ...otherProps].filter(
				p => myProps.includes(p) && otherProps.includes(p),
			),
		)

		const resProps = Object.fromEntries(
			[...commonProps]
				.filter(p => this._props[p].eq(t._props[p]))
				.map(p => [p, this._props[p]]),
		)

		return new StructType(resProps)
	}

	toString(): string {
		return this.name
	}

	static extends(base: StructType, additional: Record<string, Type>) {
		assert(
			!Object.keys(additional).some(p => p in base._props),
			'Properties need to be unique',
		)
		return new StructType({
			...base._props,
			...additional,
		})
	}
}

export default StructType
