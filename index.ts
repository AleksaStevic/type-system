import TypeSystem from './src/TypeSystem'
import Def from './src/op/Def'
import Op from './src/op/Op'
import { ret } from './src/op/ret-type/Identity'
import { sat } from './src/op/type-constraint/Satisfies'
import { id } from './src/op/type-constraint/Identity'
import { widen } from './src/op/ret-type/Widen'
import TypeParam from './src/op/TypeParam'
import { larger } from './src/op/type-constraint/Larger'
import { any } from './src/op/type-constraint/Any'
import { atIndex } from './src/op/ret-type/AtIndex'
import { custom } from './src/op/ret-type/Custom'
import TupleType from './src/types/TupleType'
import StructType from './src/types/StructType'

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

const ts = new TypeSystem([
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
const strT = ts.primitive(str)
const TT = ts.primitive(T)
const FT = ts.primitive(F)
const boolT = ts.primitive(bool)

const add = new Op('+')
add.addDef(new Def([sat(numT), sat(numT)], widen()))
add.addDef(new Def([id(strT), sat(ts.union(strT, numT))], ret(strT)))

const cast = new Op('cast')
const t = new TypeParam('t')
cast.addDef(new Def([[t, sat(numT)], larger(t)], widen()))

const ternary = new Op('?:')
ternary.addDef(new Def([id(TT), any(), any()], atIndex(1)))
ternary.addDef(new Def([id(FT), any(), any()], atIndex(2)))
ternary.addDef(
	new Def(
		[id(boolT), any(), any()],
		custom(types => {
			return ts.union(types[1], types[2])
		}, '$1 | $2'),
	),
)

// console.log(ternary.chooseDef([boolT, realT, strT])?.toString())
// console.log(ternary.exec([boolT, realT, strT])?.toString())

// const tuple = new TupleType([intT, qT])
// console.log(tuple.toString())

// const tupleInt = ts.union(int, tuple)

// console.log(tupleInt.toString())

const personT = new StructType({
	name: strT,
	age: intT,
})

const womanT = new StructType({
	name: strT,
	age: intT,
	hairColor: strT,
})

const pet = new StructType({
	name: strT,
	race: strT,
})

console.log(pet.extends(personT))
console.log(pet.extends(womanT))
console.log(pet.commonType(womanT)?.commonType(personT)?.toString())

const dogT = StructType.extends(pet, {
	hasNecklace: boolT,
})

console.log(dogT.toString())

console.log(womanT.commonType(personT)?.eq(personT))
