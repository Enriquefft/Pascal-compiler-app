"use client";
import dynamic from "next/dynamic";
import { CSSProperties } from "react";
import type { AST, ASTNode } from "@/lib/ast";

const Tree = dynamic(() => import("react-d3-tree").then(mod => mod.Tree), {
  ssr: false,
});

function astNodeToTree(node: ASTNode, label?: string) {
  const name = label ? `${node.kind} (${label})` : node.kind;
  const attributes: Record<string, string> = {};
  const children: any[] = [];

  for (const [key, value] of Object.entries(node)) {
    if (key === "kind") continue;
    if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === "object" && value[0] && "kind" in value[0]) {
        children.push({ name: key, children: value.map((v) => astNodeToTree(v as ASTNode)) });
      } else if (value.length > 0) {
        attributes[key] = JSON.stringify(value);
      }
    } else if (value && typeof value === "object" && "kind" in value) {
      children.push(astNodeToTree(value as ASTNode, key));
    } else if (value !== undefined) {
      attributes[key] = String(value);
    }
  }

  return { name, attributes, children };
}

export function ASTTree({ ast }: { ast: AST }) {
  if (!ast.root) return null;
  const data = astNodeToTree(ast.root);
  const containerStyles: CSSProperties = { width: "100%", height: "500px" };
  return (
    <div style={containerStyles} className="border rounded-md bg-muted/50">
      <Tree data={data} orientation="vertical" pathFunc="elbow" />
    </div>
  );
}

