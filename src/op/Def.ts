import assert from 'assert'
import Type from '../types/Type'
import TypeConstraint from './type-constraint/TypeConstraint'
import { zip } from '../utils'
import RetType from './ret-type/RetType'
import TypeParam from './TypeParam'

class Def {
	constructor(
		private _params: (TypeConstraint | [TypeParam, TypeConstraint])[],
		private _retType: RetType,
	) {}

	get params() {
		return this._params
	}

	get retType() {
		return this._retType
	}

	private populateTypeParams(types: Type[]) {
		assert(this.params.length === types.length, 'Needs to be the same length')
		for (const [arg, param] of zip(types, this.params)) {
			if (!(param instanceof Array)) continue
			param[0].t = arg
		}
	}

	private cleanTypeParams() {
		for (const param of this.params) {
			if (!(param instanceof Array)) continue
			param[0].t = undefined
		}
	}

	isSatisfiedBy(types: Type[]) {
		if (this.params.length !== types.length) return false

		this.populateTypeParams(types)
		for (const [arg, param] of zip(types, this.params)) {
			if (param instanceof Array && param[1].isSatisfied(arg)) continue
			if (!(param instanceof Array) && param.isSatisfied(arg)) continue
			this.cleanTypeParams()
			return false
		}

		this.cleanTypeParams()

		return true
	}

	toString() {
		return `Def[(${this.params
			.map(p => p.toString())
			.join(', ')}) -> ${this.retType.toString()}]`
	}
}

export default Def
