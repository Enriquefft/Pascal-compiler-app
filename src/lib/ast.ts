/**
 * AST type definitions for the Pascal compiler.
 * This mirrors the structures defined in include/parser/ast.hpp.
 */

export enum BasicType {
	Integer = "Integer",
	LongInt = "LongInt",
	UnsignedInt = "UnsignedInt",
	Real = "Real",
	String = "String",
}

export enum NodeKind {
	Program = "Program",
	Block = "Block",
	VarDecl = "VarDecl",
	VarSection = "VarSection",
	TypeDecl = "TypeDecl",
	ConstDecl = "ConstDecl",
	ProcedureDecl = "ProcedureDecl",
	FunctionDecl = "FunctionDecl",
	ParamDecl = "ParamDecl",
	CompoundStmt = "CompoundStmt",
	AssignStmt = "AssignStmt",
	ProcCall = "ProcCall",
	IfStmt = "IfStmt",
	WhileStmt = "WhileStmt",
	ForStmt = "ForStmt",
	RepeatStmt = "RepeatStmt",
	CaseStmt = "CaseStmt",
	WithStmt = "WithStmt",
	BinaryExpr = "BinaryExpr",
	UnaryExpr = "UnaryExpr",
	LiteralExpr = "LiteralExpr",
	VariableExpr = "VariableExpr",
	Range = "Range",
	TypeSpec = "TypeSpec",
	SimpleTypeSpec = "SimpleTypeSpec",
	ArrayTypeSpec = "ArrayTypeSpec",
	RecordTypeSpec = "RecordTypeSpec",
	PointerTypeSpec = "PointerTypeSpec",
	CaseLabel = "CaseLabel",
	NewExpr = "NewExpr",
	DisposeExpr = "DisposeExpr",
}

export interface ASTNode {
	kind: NodeKind;
}

export type Expression =
	| BinaryExpr
	| UnaryExpr
	| LiteralExpr
	| VariableExpr
	| NewExpr
	| DisposeExpr;

export type Statement =
	| CompoundStmt
	| AssignStmt
	| ProcCall
	| IfStmt
	| WhileStmt
	| ForStmt
	| RepeatStmt
	| CaseStmt
	| WithStmt;

export type Declaration =
	| VarDecl
	| ConstDecl
	| TypeDecl
	| ProcedureDecl
	| FunctionDecl
	| ParamDecl;

/* Program structure */

export interface Program extends ASTNode {
	kind: NodeKind.Program;
	name: string;
	block: Block;
}

export interface Block extends ASTNode {
	kind: NodeKind.Block;
	declarations: Declaration[];
	statements: Statement[];
}

/* Declarations */

export interface VarDecl {
	kind: NodeKind.VarDecl;
	names: string[];
	type: TypeSpec;
}

export interface ConstDecl {
	kind: NodeKind.ConstDecl;
	name: string;
	value: Expression;
}

export interface TypeDecl {
	kind: NodeKind.TypeDecl;
	name: string;
	type: TypeSpec;
}

export interface ProcedureDecl {
	kind: NodeKind.ProcedureDecl;
	name: string;
	params: ParamDecl[];
	body: Block;
}

export interface ParamDecl {
	kind: NodeKind.ParamDecl;
	names: string[];
	type: TypeSpec;
}

export interface FunctionDecl {
	kind: NodeKind.FunctionDecl;
	name: string;
	params: ParamDecl[];
	returnType: TypeSpec;
	body: Block;
}

/* Statements */

export interface CompoundStmt {
	kind: NodeKind.CompoundStmt;
	statements: Statement[];
}

export interface AssignStmt {
	kind: NodeKind.AssignStmt;
	target: Expression;
	value: Expression;
}

export interface ProcCall {
	kind: NodeKind.ProcCall;
	name: string;
	args: Expression[];
}

export interface IfStmt {
	kind: NodeKind.IfStmt;
	condition: Expression;
	thenBranch: Statement;
	elseBranch?: Statement;
}

export interface WhileStmt {
	kind: NodeKind.WhileStmt;
	condition: Expression;
	body: Statement;
}

export interface ForStmt {
	kind: NodeKind.ForStmt;
	init: AssignStmt;
	downto: boolean;
	limit: Expression;
	body: Statement;
}

export interface RepeatStmt {
	kind: NodeKind.RepeatStmt;
	body: Statement[];
	condition: Expression;
}

export interface CaseStmt {
	kind: NodeKind.CaseStmt;
	expr: Expression;
	cases: CaseLabel[];
}

export interface WithStmt {
	kind: NodeKind.WithStmt;
	recordExpr: Expression;
	body: Statement;
}

/* Expressions */

export interface BinaryExpr {
	kind: NodeKind.BinaryExpr;
	left: Expression;
	op: string;
	right: Expression;
}

export interface UnaryExpr {
	kind: NodeKind.UnaryExpr;
	op: string;
	operand: Expression;
}

export interface LiteralExpr {
	kind: NodeKind.LiteralExpr;
	value: string;
}

export type Selector =
	| { kind: "Field"; field: string }
	| { kind: "Index"; index: Expression }
	| { kind: "Pointer" };

export interface VariableExpr {
	kind: NodeKind.VariableExpr;
	name: string;
	selectors: Selector[];
}

export interface Range extends ASTNode {
	kind: NodeKind.Range;
	start: number;
	end: number;
}

/* Type specifications */

export interface TypeSpec extends ASTNode {}

export interface SimpleTypeSpec extends TypeSpec {
	kind: NodeKind.SimpleTypeSpec;
	basic: BasicType;
	name?: string;
}

export interface ArrayTypeSpec extends TypeSpec {
	kind: NodeKind.ArrayTypeSpec;
	ranges: Range[];
	elementType: TypeSpec;
}

export interface RecordTypeSpec extends TypeSpec {
	kind: NodeKind.RecordTypeSpec;
	fields: VarDecl[];
}

export interface PointerTypeSpec extends TypeSpec {
	kind: NodeKind.PointerTypeSpec;
	refType: TypeSpec;
}

/* Case labels */

export interface CaseLabel extends ASTNode {
	kind: NodeKind.CaseLabel;
	constants: Expression[];
	stmt: Statement;
}

/* Memory management expressions */

export interface NewExpr {
	kind: NodeKind.NewExpr;
	variable: VariableExpr;
}

export interface DisposeExpr {
	kind: NodeKind.DisposeExpr;
	variable: VariableExpr;
}

/* Root AST container */

export interface AST extends ASTNode {
	root: Program | null;
	valid: boolean;
}
