export class InvalidNameError extends Error {
	constructor(name: string) {
		super(`Type with the name '${name}' already exsits`)
	}
}
