import Type from '../types/Type'
import Def from './Def'

class Op {
	private _defs: Def[] = []

	constructor(private _name: string) {}

	get name() {
		return this._name
	}

	get defs() {
		return this._defs
	}

	addDef(def: Def) {
		// @TODO: check whether there doesn't exist a definition
		// that has overlaop with the definition you wanna add.
		this._defs.push(def)
	}

	addDefs(defs: Def[]) {
		for (const def of defs) this.addDef(def)
	}

	chooseDef(args: Type[]) {
		const defs = this._defs.filter(d => d.isSatisfiedBy(args))
		if (defs.length > 1) {
			throw new Error(
				`Multiple definitions found: ${defs
					.map(def => def.toString())
					.join(', ')}`,
			)
		}

		if (defs.length === 0) return undefined

		return defs[0]
	}

	exec(args: Type[]) {
		return this.chooseDef(args)?.retType.getType(args)
	}
}

export default Op
