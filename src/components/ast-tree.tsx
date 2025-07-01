"use client";
import dynamic from "next/dynamic";
import { type CSSProperties } from "react";
import type { RawNodeDatum } from "react-d3-tree";
import type { AST, ASTNode } from "@/lib/ast";

const Tree = dynamic(() => import("react-d3-tree").then((mod) => mod.Tree), {
	ssr: false,
});

interface ASTRawNodeDatum extends RawNodeDatum {
	children?: ASTRawNodeDatum[];
}

function isASTNode(value: unknown): value is ASTNode {
	return !!value && typeof value === "object" && "kind" in value;
}

function astNodeToTree(node: ASTNode, label?: string): ASTRawNodeDatum {
	const name = label ? `${node.kind} (${label})` : node.kind;
	const attributes: Record<string, string | number | boolean> = {};
	const children: ASTRawNodeDatum[] = [];

	for (const [key, value] of Object.entries(node)) {
		if (key === "kind") continue;
		if (Array.isArray(value)) {
			if (value.length > 0 && isASTNode(value[0])) {
				children.push({
					children: (value as ASTNode[]).map((v) => astNodeToTree(v)),
					name: key,
				});
			} else if (value.length > 0) {
				attributes[key] = JSON.stringify(value);
			}
		} else if (isASTNode(value)) {
			children.push(astNodeToTree(value, key));
		} else if (value !== undefined) {
			attributes[key] = String(value);
		}
	}

	return { attributes, children, name };
}

export function ASTTree({ ast }: { ast?: AST }) {
        if (!ast?.root) return null;
        const data = astNodeToTree(ast.root);
	const containerStyles: CSSProperties = { height: "500px", width: "100%" };
	return (
		<div style={containerStyles} className="border rounded-md bg-muted/50">
			<Tree data={data} orientation="vertical" pathFunc="elbow" />
		</div>
	);
}
