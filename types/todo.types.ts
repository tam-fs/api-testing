/**
 * Todo API Types and Interfaces
 * Contains all type definitions for Todo API testing
 */

export type TodoStatus = 'pending' | 'in_progress' | 'completed';
export type TodoPriority = 'low' | 'medium' | 'high';

/**
 * Base Todo interface - represents a complete todo item from API
 */
export interface Todo {
    id: number;
    title: string;
    description?: string | null;
    status: TodoStatus;
    priority: TodoPriority;
    due_date?: string | null;
    user_id: number;
    created_at: string;
    updated_at: string;
}

/**
 * Create Todo Request - data needed to create a new todo
 */
export interface CreateTodoRequest {
    title: string;
    description?: string;
    status?: TodoStatus;
    priority?: TodoPriority;
    due_date?: string;
    user_id?: number;
}

/**
 * Update Todo Request - data needed to fully update a todo (PUT)
 */
export interface UpdateTodoRequest {
    id: number;
    title: string;
    description?: string;
    status?: TodoStatus;
    priority?: TodoPriority;
    due_date?: string;
    user_id?: number;
}

/**
 * Patch Todo Request - data needed to partially update a todo (PATCH)
 */
export interface PatchTodoRequest {
    id: number;
    title?: string;
    description?: string;
    status?: TodoStatus;
    priority?: TodoPriority;
    due_date?: string;
    user_id?: number;
}

/**
 * API Response interfaces
 */
export interface ApiResponse<T> {
    success: boolean;
    [key: string]: any;
}

export interface GetAllTodosResponse extends ApiResponse<Todo[]> {
    todos: Todo[];
}

export interface GetTodoResponse extends ApiResponse<Todo> {
    todo: Todo;
}

export interface CreateTodoResponse extends ApiResponse<Todo> {
    todo: Todo;
}

export interface UpdateTodoResponse extends ApiResponse<Todo> {
    todo: Todo;
}

export interface DeleteTodoResponse extends ApiResponse<any> {
    deleted: {
        id: number;
        message: string;
    };
}

export interface ResetDatabaseResponse extends ApiResponse<any> {
    reset: {
        message: string;
        sample_data: {
            todos: number;
        };
    };
}

export interface ErrorResponse extends ApiResponse<any> {
    message: string;
}

/**
 * Test Case Data interface
 */
export interface TodoTestCase {
    id: string;
    description: string;
    data: CreateTodoRequest;
    expectedStatus: number;
    expectedResponse?: Partial<Todo>;
}

/**
 * Default values for Todo creation
 */
export const TODO_DEFAULTS = {
    status: 'pending' as TodoStatus,
    priority: 'medium' as TodoPriority,
    user_id: 1,
} as const;
