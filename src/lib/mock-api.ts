import { type AST, NodeKind } from "./ast";

export interface CompilationResult {
	tokens: { token_name: string; token_content: string }[];
	ast: AST;
	asm: string;
	output: string;
}

export async function compilePascal(code: string): Promise<CompilationResult> {
	return new Promise((resolve) => {
		setTimeout(() => {
			const parts = code.split(/\s+/).filter(Boolean);
			const tokens = parts.map((t, i) => ({
				token_content: t,
				token_name: `TOKEN_${i}`,
			}));

			const ast: AST = {
				root: {
					block: {
						declarations: [],
						kind: NodeKind.Block,
						statements: [
							{
								kind: NodeKind.CompoundStmt,
								statements: [
									{
										args: [
											{ kind: NodeKind.LiteralExpr, value: "Hello World" },
										],
										kind: NodeKind.ProcCall,
										name: "writeln",
									},
								],
							},
						],
					},
					kind: NodeKind.Program,
					name: "MockProgram",
				},
				valid: true,
			};

			resolve({
				asm: "; mocked ASM code\nMOV AX, BX",
				ast,
				output: "mocked output",
				tokens,
			});
		}, 1000);
	});
}
