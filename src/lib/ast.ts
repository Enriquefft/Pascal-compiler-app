export enum BasicType {
  Integer = 'Integer',
  LongInt = 'LongInt',
  UnsignedInt = 'UnsignedInt',
  Real = 'Real',
  String = 'String',
}

export enum NodeKind {
  Program = 'Program',
  Block = 'Block',
  VarDecl = 'VarDecl',
  TypeDecl = 'TypeDecl',
  ConstDecl = 'ConstDecl',
  ProcedureDecl = 'ProcedureDecl',
  FunctionDecl = 'FunctionDecl',
  ParamDecl = 'ParamDecl',
  CompoundStmt = 'CompoundStmt',
  AssignStmt = 'AssignStmt',
  ProcCall = 'ProcCall',
  IfStmt = 'IfStmt',
  WhileStmt = 'WhileStmt',
  ForStmt = 'ForStmt',
  RepeatStmt = 'RepeatStmt',
  CaseStmt = 'CaseStmt',
  WithStmt = 'WithStmt',
  BinaryExpr = 'BinaryExpr',
  UnaryExpr = 'UnaryExpr',
  LiteralExpr = 'LiteralExpr',
  VariableExpr = 'VariableExpr',
  Range = 'Range',
  TypeSpec = 'TypeSpec',
  SimpleTypeSpec = 'SimpleTypeSpec',
  ArrayTypeSpec = 'ArrayTypeSpec',
  RecordTypeSpec = 'RecordTypeSpec',
  PointerTypeSpec = 'PointerTypeSpec',
  CaseLabel = 'CaseLabel',
  NewExpr = 'NewExpr',
  DisposeExpr = 'DisposeExpr',
}

export interface ASTNode {
  kind: NodeKind;
}

export interface Expression extends ASTNode {}
export interface Statement extends ASTNode {}
export interface Declaration extends ASTNode {}

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

export interface VarDecl extends Declaration {
  kind: NodeKind.VarDecl;
  names: string[];
  type: TypeSpec;
}

export interface ConstDecl extends Declaration {
  kind: NodeKind.ConstDecl;
  name: string;
  value: Expression;
}

export interface TypeDecl extends Declaration {
  kind: NodeKind.TypeDecl;
  name: string;
  type: TypeSpec;
}

export interface ProcedureDecl extends Declaration {
  kind: NodeKind.ProcedureDecl;
  name: string;
  params: ParamDecl[];
  body: Block;
}

export interface ParamDecl extends Declaration {
  kind: NodeKind.ParamDecl;
  names: string[];
  type: TypeSpec;
}

export interface FunctionDecl extends Declaration {
  kind: NodeKind.FunctionDecl;
  name: string;
  params: ParamDecl[];
  returnType: TypeSpec;
  body: Block;
}

export interface CompoundStmt extends Statement {
  kind: NodeKind.CompoundStmt;
  statements: Statement[];
}

export interface AssignStmt extends Statement {
  kind: NodeKind.AssignStmt;
  target: Expression;
  value: Expression;
}

export interface ProcCall extends Statement {
  kind: NodeKind.ProcCall;
  name: string;
  args: Expression[];
}

export interface IfStmt extends Statement {
  kind: NodeKind.IfStmt;
  condition: Expression;
  thenBranch: Statement;
  elseBranch?: Statement;
}

export interface WhileStmt extends Statement {
  kind: NodeKind.WhileStmt;
  condition: Expression;
  body: Statement;
}

export interface ForStmt extends Statement {
  kind: NodeKind.ForStmt;
  init: AssignStmt;
  downto: boolean;
  limit: Expression;
  body: Statement;
}

export interface RepeatStmt extends Statement {
  kind: NodeKind.RepeatStmt;
  body: Statement[];
  condition: Expression;
}

export interface CaseStmt extends Statement {
  kind: NodeKind.CaseStmt;
  expr: Expression;
  cases: CaseLabel[];
}

export interface WithStmt extends Statement {
  kind: NodeKind.WithStmt;
  recordExpr: Expression;
  body: Statement;
}

export interface BinaryExpr extends Expression {
  kind: NodeKind.BinaryExpr;
  left: Expression;
  op: string;
  right: Expression;
}

export interface UnaryExpr extends Expression {
  kind: NodeKind.UnaryExpr;
  op: string;
  operand: Expression;
}

export interface LiteralExpr extends Expression {
  kind: NodeKind.LiteralExpr;
  value: string;
}

export type Selector =
  | { kind: 'Field'; field: string }
  | { kind: 'Index'; index: Expression }
  | { kind: 'Pointer' };

export interface VariableExpr extends Expression {
  kind: NodeKind.VariableExpr;
  name: string;
  selectors: Selector[];
}

export interface Range extends ASTNode {
  kind: NodeKind.Range;
  start: number;
  end: number;
}

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

export interface CaseLabel extends ASTNode {
  kind: NodeKind.CaseLabel;
  constants: Expression[];
  stmt: Statement;
}

export interface NewExpr extends Expression {
  kind: NodeKind.NewExpr;
  variable: VariableExpr;
}

export interface DisposeExpr extends Expression {
  kind: NodeKind.DisposeExpr;
  variable: VariableExpr;
}

export interface AST {
  root: Program | null;
  valid: boolean;
}
