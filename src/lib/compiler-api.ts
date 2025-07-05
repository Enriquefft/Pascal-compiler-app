"use server";
import type { AST } from "./ast";
import { env } from "@/env";

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
	const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/compile`, {
		body: code,
		headers: { "Content-Type": "text/plain" },
		method: "POST",
	});

	if (!response.ok) {
		throw new Error(`Request failed with status ${response.status}`);
	}

	const result: CompilationResult = await response.json();

	console.log("Compilation Result:", result);

	return result;
}
