import { z } from 'zod';

/**
 * Todo API Types and Zod Schemas
 * Contains all type definitions and validation schemas for Todo API testing
 */

// Enums as Zod schemas
export const StatusEnum = z.enum(['pending', 'in_progress', 'completed']);
export const PriorityEnum = z.enum(['low', 'medium', 'high']);

// Legacy type exports for backward compatibility
export type TodoStatus = z.infer<typeof StatusEnum>;
export type TodoPriority = z.infer<typeof PriorityEnum>;

/**
 * Base Todo Schema - represents a complete todo item from API
 */
export const TodoSchema = z.object({
    id: z.number(),
    user_id: z.number(),
    title: z.string(),
    description: z.string().nullable(),
    status: StatusEnum,
    priority: PriorityEnum,
    due_date: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
});

/**
 * Create Todo Request Schema - data needed to create a new todo
 */
export const CreateTodoRequestSchema = z.object({
    title: z.string(),
    description: z.string().nullable().optional(),
    status: StatusEnum.optional(),
    priority: PriorityEnum.optional(),
    due_date: z.string().nullable().optional(),
    user_id: z.number().optional(),
});

/**
 * Update Todo Request Schema - data needed to fully update a todo (PUT)
 */
export const UpdateTodoRequestSchema = z.object({
    id: z.number(),
    title: z.string(),
    description: z.string().nullable().optional(),
    status: StatusEnum.optional(),
    priority: PriorityEnum.optional(),
    due_date: z.string().nullable().optional(),
    user_id: z.number().optional(),
});

/**
 * Patch Todo Request Schema - data needed to partially update a todo (PATCH)
 */
export const PatchTodoRequestSchema = z.object({
    id: z.number(),
    title: z.string().optional(),
    description: z.string().nullable().optional(),
    status: StatusEnum.optional(),
    priority: PriorityEnum.optional(),
    due_date: z.string().nullable().optional(),
    user_id: z.number().optional(),
});

/**
 * API Response Schemas
 */
export const GetAllTodosResponseSchema = z.object({
    success: z.boolean(),
    todos: z.array(TodoSchema),
});

export const GetTodoResponseSchema = z.object({
    success: z.boolean(),
    todo: TodoSchema,
});

export const CreateTodoResponseSchema = z.object({
    success: z.boolean(),
    todo: TodoSchema,
});

export const UpdateTodoResponseSchema = z.object({
    success: z.boolean(),
    todo: TodoSchema,
});

export const DeleteTodoResponseSchema = z.object({
    success: z.boolean(),
    deleted: z.object({
        id: z.number(),
        message: z.string(),
    }),
});

export const ResetDatabaseResponseSchema = z.object({
    success: z.boolean(),
    reset: z.object({
        message: z.string(),
        sample_data: z.object({
            todos: z.number(),
        }),
    }),
});

export const ErrorResponseSchema = z.object({
    success: z.literal(false),
    message: z.string(),
});

/**
 * Type exports (inferred from Zod schemas)
 */
export type Todo = z.infer<typeof TodoSchema>;
export type CreateTodoRequest = z.infer<typeof CreateTodoRequestSchema>;
export type UpdateTodoRequest = z.infer<typeof UpdateTodoRequestSchema>;
export type PatchTodoRequest = z.infer<typeof PatchTodoRequestSchema>;
export type GetAllTodosResponse = z.infer<typeof GetAllTodosResponseSchema>;
export type GetTodoResponse = z.infer<typeof GetTodoResponseSchema>;
export type CreateTodoResponse = z.infer<typeof CreateTodoResponseSchema>;
export type UpdateTodoResponse = z.infer<typeof UpdateTodoResponseSchema>;
export type DeleteTodoResponse = z.infer<typeof DeleteTodoResponseSchema>;
export type ResetDatabaseResponse = z.infer<typeof ResetDatabaseResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

/**
 * Legacy interface for backward compatibility
 */
export interface ApiResponse<T> {
    success: boolean;
    [key: string]: any;
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

export enum Status {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed'
}

export enum Priority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high'
}