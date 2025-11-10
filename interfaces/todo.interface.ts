export enum Status {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface Todo {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  status: Status;
  priority: Priority;
  due_date: string | null;      // ISO datetime
  created_at: string;           // ISO datetime
  updated_at: string;           // ISO datetime
}

export interface TodoInput {
  title: string;
  description?: string | null;
  status?: Status;
  priority?: Priority;
  due_date?: string | null;
  user_id?: number;
}

export interface TodoUpdate extends TodoInput {
  id: number;
}

export interface TodoPatch {
  id: number;
  title?: string;
  description?: string | null;
  status?: Status;
  priority?: Priority;
  due_date?: string | null;
  user_id?: number;
}

export interface ApiError {
  success: boolean;
  message: string;
}
