import Type from './Type'
import assert from 'assert'
import UnionType from './UnionType'
import TupleType from './TupleType'

class PrimitiveType extends Type {
	private _parent: PrimitiveType | undefined

	get parent(): PrimitiveType | undefined {
		return this._parent
	}

	set parent(parent: PrimitiveType | undefined) {
		assert(parent !== this, "Can't add self as parent.")
		assert(
			!parent?.extends(this),
			"Can't add directi/indirect child as parent.",
		)
		this._parent = parent
	}

	path(t: PrimitiveType) {
		let search: PrimitiveType | undefined = this
		const path = []
		while (true) {
			if (!search) return undefined
			path.push(search)
			if (search === t) return path
			search = search.parent
		}
	}

	pathToRoot() {
		let search: PrimitiveType | undefined = this
		const path = []
		while (search) {
			path.push(search)
			search = search.parent
		}

		return path
	}

	eq(t: Type): boolean {
		return t.name === this.name
	}

	extends(t: Type): boolean {
		if (t instanceof PrimitiveType) {
			if (t === this) return false
			return !!this.path(t)
		}

		if (t instanceof UnionType) {
			return t.types.find(t => this.assignableTo(t)) !== undefined
		}

		if (t instanceof TupleType) return false

		assert(false, 'Not implemented')
	}

	commonType(type: Type): Type | undefined {
		if (type instanceof PrimitiveType) {
			return this.pathToRoot().find(t => type.assignableTo(t))
		}

		if (type instanceof UnionType) {
			return type.memberCommonType()?.commonType(this)
		}

		assert(false, 'Not implemented')
	}

	toString() {
		return this.name
	}
}

export default PrimitiveType
