import { z } from 'zod';
import {
    TodoSchema,
    GetAllTodosResponseSchema,
    GetTodoResponseSchema,
    CreateTodoResponseSchema,
    DeleteTodoResponseSchema,
    ResetDatabaseResponseSchema,
    ErrorResponseSchema,
} from '../interfaces/todo.schema';

/**
 * Schema Validator Utility for API Response Validation using Zod
 */
export class SchemaValidator {
    /**
     * Helper method to convert Zod validation error to readable format
     * @param error - Zod error object
     * @returns Array of error messages
     */
    private static formatZodErrors(error: z.ZodError): string[] {
        return error.issues.map((err: z.ZodIssue) => {
            const path = err.path.join('.');
            return `${path ? `${path}: ` : ''}${err.message}`;
        });
    }

    /**
     * Validate Todo object schema
     * @param todo - Todo object to validate
     * @returns validation result
     */
    static validateTodoSchema(todo: any): { valid: boolean; errors: string[] } {
        const result = TodoSchema.safeParse(todo);

        if (result.success) {
            return { valid: true, errors: [] };
        }

        return {
            valid: false,
            errors: this.formatZodErrors(result.error)
        };
    }

    /**
     * Validate GET all todos response schema
     * @param response - Response body
     * @returns validation result
     */
    static validateGetAllTodosResponse(response: any): { valid: boolean; errors: string[] } {
        const result = GetAllTodosResponseSchema.safeParse(response);

        if (result.success) {
            return { valid: true, errors: [] };
        }

        return {
            valid: false,
            errors: this.formatZodErrors(result.error)
        };
    }

    /**
     * Validate GET single todo response schema
     * @param response - Response body
     * @returns validation result
     */
    static validateGetTodoResponse(response: any): { valid: boolean; errors: string[] } {
        const result = GetTodoResponseSchema.safeParse(response);

        if (result.success) {
            return { valid: true, errors: [] };
        }

        return {
            valid: false,
            errors: this.formatZodErrors(result.error)
        };
    }

    /**
     * Validate POST/PUT/PATCH todo response schema
     * @param response - Response body
     * @returns validation result
     */
    static validateCreateOrUpdateTodoResponse(response: any): { valid: boolean; errors: string[] } {
        const result = CreateTodoResponseSchema.safeParse(response);

        if (result.success) {
            return { valid: true, errors: [] };
        }

        return {
            valid: false,
            errors: this.formatZodErrors(result.error)
        };
    }

    /**
     * Validate DELETE todo response schema
     * @param response - Response body
     * @returns validation result
     */
    static validateDeleteTodoResponse(response: any): { valid: boolean; errors: string[] } {
        const result = DeleteTodoResponseSchema.safeParse(response);

        if (result.success) {
            return { valid: true, errors: [] };
        }

        return {
            valid: false,
            errors: this.formatZodErrors(result.error)
        };
    }

    /**
     * Validate Reset response schema
     * @param response - Response body
     * @returns validation result
     */
    static validateResetResponse(response: any): { valid: boolean; errors: string[] } {
        const result = ResetDatabaseResponseSchema.safeParse(response);

        if (result.success) {
            return { valid: true, errors: [] };
        }

        return {
            valid: false,
            errors: this.formatZodErrors(result.error)
        };
    }

    /**
     * Validate error response schema
     * @param response - Response body
     * @returns validation result
     */
    static validateErrorResponse(response: any): { valid: boolean; errors: string[] } {
        const result = ErrorResponseSchema.safeParse(response);

        if (result.success) {
            return { valid: true, errors: [] };
        }

        return {
            valid: false,
            errors: this.formatZodErrors(result.error)
        };
    }
}
