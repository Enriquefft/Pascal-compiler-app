import { AST, NodeKind } from "./ast";

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
      const tokens = parts.map((t, i) => ({ token_name: `TOKEN_${i}`, token_content: t }));

      const ast: AST = {
        valid: true,
        root: {
          kind: NodeKind.Program,
          name: "MockProgram",
          block: {
            kind: NodeKind.Block,
            declarations: [],
            statements: [
              {
                kind: NodeKind.CompoundStmt,
                statements: [
                  {
                    kind: NodeKind.ProcCall,
                    name: "writeln",
                    args: [
                      { kind: NodeKind.LiteralExpr, value: "Hello World" },
                    ],
                  },
                ],
              },
            ],
          },
        },
      };

      resolve({
        tokens,
        ast,
        asm: '; mocked ASM code\nMOV AX, BX',
        output: 'mocked output',
      });
    }, 1000);
  });
}
