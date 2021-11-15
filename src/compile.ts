import fs from 'fs';
import Transpile from "./core/transpiler";

export function Compile(sourceFile: string, outFile: string) {
	let source = fs.readFileSync(sourceFile, 'utf8');
	let transpiled = Transpile(source, {});
	fs.writeFileSync(outFile, transpiled);
}