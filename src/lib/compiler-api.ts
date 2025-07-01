import { type AST } from "./ast";

export interface CompilationResult {
        tokens?: { token_name: string; token_content: string }[];
        ast?: AST;
        asm?: string;
        output?: string;
        error?: string;
        line?: number;
        column?: number;
}

export async function compilePascal(code: string): Promise<CompilationResult> {
        const response = await fetch(
                "https://pascal-compiler.onrender.com/compile",
                {
                        body: code,
                        headers: { "Content-Type": "text/plain" },
                        method: "POST",
                },
        );

        if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
        }

        return (await response.json()) as CompilationResult;
}
