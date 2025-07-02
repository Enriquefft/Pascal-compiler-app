"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { ASTTree } from "@/components/ast-tree";
import { ModeToggle } from "@/components/mode-toogle";
import { SubmitButton } from "@/components/submit-button";
import { PresetPicker } from "@/components/preset-picker";
import { CopyButton } from "@/components/copy-button";
import {
	Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardAction,
        CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { compilePascal } from "@/lib/compiler-api";
import { showErrorToast } from "@/lib/handle-error";

export function PascalCompiler() {
	const [code, setCode] = useState("");
	const {
		mutateAsync,
		data: result,
		isPending,
	} = useMutation({
		mutationFn: compilePascal,
		onError: showErrorToast,
	});

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		await mutateAsync(code);
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
                                        <CardAction>
                                                <CopyButton value={code} />
                                        </CardAction>
                                </CardHeader>
                                <CardContent>
                                        <div className="mb-4">
                                                <PresetPicker onSelect={setCode} />
                                        </div>
                                        <form onSubmit={onSubmit} className="space-y-4">
                                                <Textarea
                                                        value={code}
                                                        onChange={(e) => setCode(e.target.value)}
                                                        placeholder="begin\n  writeln('Hello World');\nend."
                                                        className="min-h-[180px]"
                                                />
                                                <SubmitButton isSubmitting={isPending}>Compile</SubmitButton>
                                        </form>
                                </CardContent>
			</Card>

			{result && (
				<div className="grid gap-6">
					{result.error && (
						<Card className="border-destructive text-destructive">
							<CardHeader>
								<CardTitle>Error</CardTitle>
								{result.line !== undefined && result.column !== undefined && (
									<CardDescription>
										Line {result.line}, Column {result.column}
									</CardDescription>
								)}
							</CardHeader>
							<CardContent>
								<pre className="whitespace-pre-wrap text-sm font-mono">
									{result.error}
								</pre>
							</CardContent>
						</Card>
					)}

                                        {result.tokens && (
                                                <Card>
                                                        <CardHeader>
                                                                <CardTitle>Tokens</CardTitle>
                                                                <CardAction>
                                                                        <CopyButton
                                                                                value={result.tokens
                                                                                        .map((t) => `${t.token_name} ${t.token_content}`)
                                                                                        .join("\n")}
                                                                        />
                                                                </CardAction>
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
					)}

					{result.ast && (
						<Card>
							<CardHeader>
								<CardTitle>AST</CardTitle>
							</CardHeader>
							<CardContent>
								<ASTTree ast={result.ast} />
							</CardContent>
						</Card>
					)}

                                        {result.asm && (
                                                <Card>
                                                        <CardHeader>
                                                                <CardTitle>ASM Code</CardTitle>
                                                                <CardAction>
                                                                        <CopyButton value={result.asm} />
                                                                </CardAction>
                                                        </CardHeader>
                                                        <CardContent>
                                                                <pre className="whitespace-pre-wrap text-sm font-mono">
                                                                        {result.asm}
                                                                </pre>
                                                        </CardContent>
                                                </Card>
                                        )}

                                        {result.output && (
                                                <Card>
                                                        <CardHeader>
                                                                <CardTitle>Output</CardTitle>
                                                                <CardAction>
                                                                        <CopyButton value={result.output} />
                                                                </CardAction>
                                                        </CardHeader>
                                                        <CardContent>
                                                                <pre className="whitespace-pre-wrap text-sm font-mono">
                                                                        {result.output}
                                                                </pre>
                                                        </CardContent>
                                                </Card>
                                        )}
				</div>
			)}
		</div>
	);
}
