/**
 * Transpiler options
 */
interface TranspilerOptions {

}

/**
 * Transpiler class
 */
class Transpiler {
	private options: TranspilerOptions;
	private source: string = '';

	constructor(options: TranspilerOptions = {}) {
		this.options = options;
	}

	private readWhile(condition: (c: string) => boolean, startIndex: number): [string, number] {
		let result = '';
		let i = startIndex;
		for (i; i < this.source.length; i++) {
			result += this.source[i];
			if (!condition(this.source[i])) break;
		}
		return [result, i];
	}

	private parseReturnedJSX(): [string, number] {
		const returnIndex = this.source.indexOf('return');
		let startIndex = -1;
		let isJSX = false;
		let jsx = '';
		if (returnIndex > -1) {
			let jsxRootTag = '';
			let jsxRootTagName = '';
			for (let i = returnIndex; i < this.source.length; i++) {
				if (this.source[i] === '<') {
					if (!isJSX) {
						startIndex = i;
						isJSX = true;
						[jsxRootTag, i] = this.readWhile(c => c !== '>', i);
						jsxRootTagName = jsxRootTag.split(' ')[0];
						jsx += jsxRootTag;
						if (jsxRootTagName.endsWith('/>')) {
							isJSX = false;
							break;
						}
					}
					else if (i + 1 < this.source.length && this.source[i + 1] === '/') {
						let jsxCloseRoot;
						[jsxCloseRoot, i] = this.readWhile(c => c !== '>', i);
						const jsxCloseRootName = jsxCloseRoot.split(/[\s>]+/gi)[0];
						if (jsxCloseRootName === jsxRootTagName) {
							isJSX = false;
							break;
						}
					}
				}
				jsx += this.source[i];
			}
		}

		if (isJSX) throw new Error("Unexpected end of JSX code!");

		return [jsx, startIndex];
	}

	public transpile(sourceCode: string): string {
		this.source = sourceCode;

		/**
		 * Find all jsx tags in the source code and convert them to
		 * JavaScript code with functions that return a DOM element instead.
		 */

		const [jsx, jsxStart] = this.parseReturnedJSX();
		return jsx;
	}
}

/**
 * Transpile JSX code into a JavaScript code.
 * @param source The JSX source code to transpile.
 * @param options The transpiler options.
 * @returns The transpiled JavaScript code.
 */
export default function Transpile(source: string, options: TranspilerOptions = {}): string {
	return new Transpiler(options).transpile(source);
}