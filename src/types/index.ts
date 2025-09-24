// Force rebuild
export const __dummy__ = true;

export interface Component {
  id: string;
  type: 'text' | 'button' | 'input' | 'card' | 'navbar' | 'form' | 'grid' | 'image';
  position: { x: number; y: number };
  size: { width: number; height: number };
  properties: ComponentProperties;
  children?: Component[];
}

export interface ComponentProperties {
  text?: string;
  color?: string;
  backgroundColor?: string;
  fontSize?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  src?: string;
  alt?: string;
  placeholder?: string;
  onClick?: string;
  [key: string]: any;
}

export interface LogicBlock {
  id: string;
  type: 'input' | 'auth' | 'database' | 'transform' | 'response';
  position: { x: number; y: number };
  data: any;
  connections: string[];
}

export interface DatabaseTable {
  id: string;
  name: string;
  fields: DatabaseField[];
  position: { x: number; y: number };
  relations: DatabaseRelation[];
}

export interface DatabaseField {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'uuid';
  required: boolean;
  unique: boolean;
  defaultValue?: string;
}

export interface DatabaseRelation {
  id: string;
  from: string;
  to: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
}

export interface Project {
  id?: string;
  name: string;
  description?: string;
  components: Component[];
  logicBlocks: LogicBlock[];
  databaseTables: DatabaseTable[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AIResponse {
  code: string;
  explanation: string;
  suggestions?: string[];
}