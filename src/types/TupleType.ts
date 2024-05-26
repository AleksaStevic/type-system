import Type from './Type'

class TupleType extends Type {
	constructor(private _types: Type[]) {
		super(`(${_types.map(t => t.name).join(',')})`)
	}

	eq(t: Type): boolean {
		return this.name === t.name
	}

	extends(t: Type): boolean {
		return false
	}

	commonType(t: Type): Type | undefined {
		return this.name === t.name ? t : undefined
	}

	toString(): string {
		return this.name
	}
}

export default TupleType
