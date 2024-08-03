export class Sort {
	constructor(private name: string) {}
}

export function sort(name: string) {
	return new Sort(name)
}
