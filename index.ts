import { any, id, larger, sat } from '@type-system/constraints'
import { Context } from '@type-system/Context'
import { Def, Op, TypeParam } from '@type-system/ops'
import { atIndex, custom, ret, widen } from '@type-system/reducers'
import { TupleType } from '@type-system/types'

const bool = 'bool'
const T = 'T'
const F = 'F'

const char = 'char'
const a = 'a'
const b = 'b'

const str = 'str'
const emptyStr = 'emptyStr'
const nonEmptyStr = 'nonEmptyStr'

const num = 'num'
const real = 'real'
const im = 'im'
const q = 'q'
const i = 'i'
const int = 'int'
const nat = 'nat'

const ts = new Context([
	{
		name: bool,
		covered: true,
		subtypes: [T, F],
	},
	{
		name: char,
		subtypes: [a, b],
	},
	{
		name: str,
		subtypes: [emptyStr, nonEmptyStr],
		covered: true,
	},
	{
		name: num,
		covered: true,
		subtypes: [
			im,
			{
				name: real,
				covered: true,
				subtypes: [
					i,
					{
						name: q,
						subtypes: [
							{
								name: int,
								subtypes: [nat],
							},
						],
					},
				],
			},
		],
	},
])

const numT = ts.primitive(num)
const intT = ts.primitive(int)
const realT = ts.primitive(real)
const qT = ts.primitive(q)
const iT = ts.primitive(i)
const strT = ts.primitive(str)
const TT = ts.primitive(T)
const FT = ts.primitive(F)
const boolT = ts.primitive(bool)

const binaryNumOpDef = new Def([sat(numT), sat(numT)], widen())

const add = Op.create('+')
	.addDef(binaryNumOpDef)
	.addDef(new Def([sat(strT), sat(intT)], ret(strT)))
	.addDef(new Def([sat(intT), sat(strT)], ret(strT)))
	.addDef(new Def([sat(strT), sat(strT)], ret(strT)))
const sub = Op.create('-').addDef(binaryNumOpDef)
const mul = Op.create('*').addDef(binaryNumOpDef)
const div = Op.create('/').addDef(binaryNumOpDef)

const resultType = mul(add(intT, realT)!, iT)
const result2 = add(strT, intT)

console.log(resultType?.toString())
console.log(result2?.toString())

const twoNumbersRetBool = new Def([sat(numT), sat(numT)], ret(boolT))

const gt = Op.create('>')
gt.addDef(twoNumbersRetBool)
const lt = Op.create('<')
lt.addDef(twoNumbersRetBool)
const gte = Op.create('>=')
gte.addDef(twoNumbersRetBool)
const lte = Op.create('<=')
lte.addDef(twoNumbersRetBool)

// const ternary = new Op('?:')
// ternary.addDef(new Def([id(TT), any(), any()], atIndex(1)))
// ternary.addDef(new Def([id(FT), any(), any()], atIndex(2)))
// ternary.addDef(
// 	new Def(
// 		[id(boolT), any(), any()],
// 		custom(types => {
// 			return ts.union(types[1], types[2])
// 		}, '$1 | $2'),
// 	),
// )
