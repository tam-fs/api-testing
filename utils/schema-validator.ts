/**
 * Schema Validator Utility for API Response Validation
 */
export class SchemaValidator {
    /**
     * Validate Todo object schema
     * @param todo - Todo object to validate
     * @returns validation result
     */
    static validateTodoSchema(todo: any): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        // Required fields
        if (!todo.hasOwnProperty('id')) {
            errors.push('Missing required field: id');
        } else if (typeof todo.id !== 'number') {
            errors.push('Field "id" must be a number');
        }

        if (!todo.hasOwnProperty('title')) {
            errors.push('Missing required field: title');
        } else if (typeof todo.title !== 'string') {
            errors.push('Field "title" must be a string');
        }

        // Optional fields with type validation
        if (todo.hasOwnProperty('description') && todo.description !== null && typeof todo.description !== 'string') {
            errors.push('Field "description" must be a string or null');
        }

        if (todo.hasOwnProperty('status')) {
            if (!['pending', 'in_progress', 'completed'].includes(todo.status)) {
                errors.push('Field "status" must be one of: pending, in_progress, completed');
            }
        }

        if (todo.hasOwnProperty('priority')) {
            if (!['low', 'medium', 'high'].includes(todo.priority)) {
                errors.push('Field "priority" must be one of: low, medium, high');
            }
        }

        if (todo.hasOwnProperty('due_date') && todo.due_date !== null && typeof todo.due_date !== 'string') {
            errors.push('Field "due_date" must be a string (datetime format) or null');
        }

        if (todo.hasOwnProperty('user_id') && typeof todo.user_id !== 'number') {
            errors.push('Field "user_id" must be a number');
        }

        if (todo.hasOwnProperty('created_at') && typeof todo.created_at !== 'string') {
            errors.push('Field "created_at" must be a string (datetime format)');
        }

        if (todo.hasOwnProperty('updated_at') && typeof todo.updated_at !== 'string') {
            errors.push('Field "updated_at" must be a string (datetime format)');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate GET all todos response schema
     * @param response - Response body
     * @returns validation result
     */
    static validateGetAllTodosResponse(response: any): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        // Check required fields
        if (!response.hasOwnProperty('success')) {
            errors.push('Missing required field: success');
        } else if (typeof response.success !== 'boolean') {
            errors.push('Field "success" must be a boolean');
        }

        if (!response.hasOwnProperty('todos')) {
            errors.push('Missing required field: todos');
        } else if (!Array.isArray(response.todos)) {
            errors.push('Field "todos" must be an array');
        } else {
            // Validate each todo in the array
            response.todos.forEach((todo: any, index: number) => {
                const todoValidation = this.validateTodoSchema(todo);
                if (!todoValidation.valid) {
                    errors.push(`Todo at index ${index} is invalid: ${todoValidation.errors.join(', ')}`);
                }
            });
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate GET single todo response schema
     * @param response - Response body
     * @returns validation result
     */
    static validateGetTodoResponse(response: any): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        // Check required fields
        if (!response.hasOwnProperty('success')) {
            errors.push('Missing required field: success');
        } else if (typeof response.success !== 'boolean') {
            errors.push('Field "success" must be a boolean');
        }

        if (!response.hasOwnProperty('todo')) {
            errors.push('Missing required field: todo');
        } else if (typeof response.todo !== 'object') {
            errors.push('Field "todo" must be an object');
        } else {
            // Validate the todo object
            const todoValidation = this.validateTodoSchema(response.todo);
            if (!todoValidation.valid) {
                errors.push(`Todo is invalid: ${todoValidation.errors.join(', ')}`);
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate POST/PUT/PATCH todo response schema
     * @param response - Response body
     * @returns validation result
     */
    static validateCreateOrUpdateTodoResponse(response: any): { valid: boolean; errors: string[] } {
        return this.validateGetTodoResponse(response);
    }

    /**
     * Validate DELETE todo response schema
     * @param response - Response body
     * @returns validation result
     */
    static validateDeleteTodoResponse(response: any): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        // Check required fields
        if (!response.hasOwnProperty('success')) {
            errors.push('Missing required field: success');
        } else if (typeof response.success !== 'boolean') {
            errors.push('Field "success" must be a boolean');
        }

        if (!response.hasOwnProperty('deleted')) {
            errors.push('Missing required field: deleted');
        } else if (typeof response.deleted !== 'object') {
            errors.push('Field "deleted" must be an object');
        } else {
            // Validate deleted object
            if (!response.deleted.hasOwnProperty('id')) {
                errors.push('Missing required field in deleted object: id');
            } else if (typeof response.deleted.id !== 'number') {
                errors.push('Field "deleted.id" must be a number');
            }

            if (!response.deleted.hasOwnProperty('message')) {
                errors.push('Missing required field in deleted object: message');
            } else if (typeof response.deleted.message !== 'string') {
                errors.push('Field "deleted.message" must be a string');
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate Reset response schema
     * @param response - Response body
     * @returns validation result
     */
    static validateResetResponse(response: any): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        // Check required fields
        if (!response.hasOwnProperty('success')) {
            errors.push('Missing required field: success');
        } else if (typeof response.success !== 'boolean') {
            errors.push('Field "success" must be a boolean');
        }

        if (!response.hasOwnProperty('reset')) {
            errors.push('Missing required field: reset');
        } else if (typeof response.reset !== 'object') {
            errors.push('Field "reset" must be an object');
        } else {
            // Validate reset object
            if (!response.reset.hasOwnProperty('message')) {
                errors.push('Missing required field in reset object: message');
            } else if (typeof response.reset.message !== 'string') {
                errors.push('Field "reset.message" must be a string');
            }

            if (!response.reset.hasOwnProperty('sample_data')) {
                errors.push('Missing required field in reset object: sample_data');
            } else if (typeof response.reset.sample_data !== 'object') {
                errors.push('Field "reset.sample_data" must be an object');
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate error response schema
     * @param response - Response body
     * @returns validation result
     */
    static validateErrorResponse(response: any): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        // Check required fields
        if (!response.hasOwnProperty('success')) {
            errors.push('Missing required field: success');
        } else if (response.success !== false) {
            errors.push('Field "success" must be false for error responses');
        }

        if (!response.hasOwnProperty('message') && !response.hasOwnProperty('error')) {
            errors.push('Missing error field: must have either "message" or "error"');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }
}
