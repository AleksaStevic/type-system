class UnknownTypeError extends Error {
	constructor(name: string) {
		super(`Type with the name '${name}' doesn't exist`)
	}
}

export default UnknownTypeError
