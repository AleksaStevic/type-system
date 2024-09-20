import { Type } from '@type-system/types'

import { Def } from './Def'

type CallableOp = Op & ((...args: Type[]) => Type | undefined)

export class Op extends Function {
	private _defs: Def[] = []

	private constructor(private _name: string) {
		super()
		return new Proxy(this, {
			apply(target, thisArg, args) {
				return Reflect.apply(target.exec, target, args)
			},
		})
	}

	static create(name: string) {
		return new Op(name) as CallableOp
	}

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

		return this as unknown as CallableOp
	}

	addDefs(defs: Def[]) {
		for (const def of defs) this.addDef(def)

		return this as unknown as CallableOp
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

	exec(...args: Type[]) {
		return this.chooseDef(args)?.retType.getType(args)
	}
}
