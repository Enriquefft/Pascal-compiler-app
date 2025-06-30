"use client";

import { useState } from "react";
import { ASTTree } from "@/components/ast-tree";
import { ModeToggle } from "@/components/mode-toogle";
import { SubmitButton } from "@/components/submit-button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { type CompilationResult, compilePascal } from "@/lib/mock-api";

export function PascalCompiler() {
	const [code, setCode] = useState("");
	const [result, setResult] = useState<CompilationResult | null>(null);
	const [loading, setLoading] = useState(false);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		const res = await compilePascal(code);
		setResult(res);
		setLoading(false);
	}

	return (
		<div className="container mx-auto max-w-4xl py-10 space-y-6">
			<div className="flex justify-end">
				<ModeToggle />
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Pascal Playground</CardTitle>
					<CardDescription>
						Enter your Pascal code and compile it
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={onSubmit} className="space-y-4">
						<Textarea
							value={code}
							onChange={(e) => setCode(e.target.value)}
							placeholder="begin\n  writeln('Hello World');\nend."
							className="min-h-[180px]"
						/>
						<SubmitButton isSubmitting={loading}>Compile</SubmitButton>
					</form>
				</CardContent>
			</Card>

			{result && (
				<div className="grid gap-6">
					<Card>
						<CardHeader>
							<CardTitle>Tokens</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="text-sm font-mono space-y-1">
								{result.tokens.map((t, i) => (
									<li
										key={i.toString()}
										className="flex justify-between border-b last:border-none py-1"
									>
										<span className="font-semibold">{t.token_name}</span>
										<span className="text-muted-foreground">
											{t.token_content}
										</span>
									</li>
								))}
							</ul>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>AST</CardTitle>
						</CardHeader>
						<CardContent>
							<ASTTree ast={result.ast} />
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>ASM Code</CardTitle>
						</CardHeader>
						<CardContent>
							<pre className="whitespace-pre-wrap text-sm font-mono">
								{result.asm}
							</pre>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Output</CardTitle>
						</CardHeader>
						<CardContent>
							<pre className="whitespace-pre-wrap text-sm font-mono">
								{result.output}
							</pre>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
}
