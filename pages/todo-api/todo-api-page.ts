import { Page, APIRequestContext, APIResponse, expect } from '@playwright/test';
import { CommonPage } from '../common-page';
import { TodoApiLocators } from '../../locators/todo-api/todo-api-locators';
import { step } from '../../utils/logging';
import { SchemaValidator } from '../../utils/schema-validator';
import { TodoInput, TodoUpdate, TodoPatch } from '../../interfaces/todo.interface';

export class TodoApiPage extends CommonPage {
    private readonly todoApiLocators: TodoApiLocators;
    private request: APIRequestContext;

    constructor(page: Page) {
        super(page);
        this.todoApiLocators = new TodoApiLocators(page);
        this.request = page.request;
    }

    // GET Methods
    /**
     * Get all todos
     * @returns APIResponse
     */
    @step('Get all todos')
    async getAllTodos(): Promise<APIResponse> {
        return await this.request.get(this.todoApiLocators.endpoints.todos, {
            headers: {
                'Accept': this.todoApiLocators.headers.accept
            }
        });
    }

    /**
     * Get a specific todo by ID
     * @param id - Todo ID
     * @returns APIResponse
     */
    @step((id) => `Get todo by ID: ${id}`)
    async getTodoById(id: number): Promise<APIResponse> {
        return await this.request.get(this.todoApiLocators.endpoints.todo, {
            params: { id },
            headers: {
                'Accept': this.todoApiLocators.headers.accept
            }
        });
    }

    // POST Methods
    /**
     * Create a new todo
     * @param todoData - Todo data object
     * @returns APIResponse
     */
    @step('Create a new todo')
    async createTodo(todoData: TodoInput): Promise<APIResponse> {
        return await this.request.post(this.todoApiLocators.endpoints.todo, {
            data: todoData,
            headers: {
                'Content-Type': this.todoApiLocators.headers.contentType,
                'Accept': this.todoApiLocators.headers.accept
            }
        });
    }

    /**
     * Reset database with sample data
     * @returns APIResponse
     */
    @step('Reset database with sample data')
    async resetDatabase(): Promise<APIResponse> {
        return await this.request.post(this.todoApiLocators.endpoints.reset, {
            headers: {
                'Accept': this.todoApiLocators.headers.accept
            }
        });
    }

    // PUT Methods
    /**
     * Update an entire todo (all fields required)
     * @param todoData - Complete todo data object
     * @returns APIResponse
     */
    @step((todoData) => `Update entire todo with ID: ${todoData.id}`)
    async updateTodo(todoData: TodoUpdate): Promise<APIResponse> {
        return await this.request.put(this.todoApiLocators.endpoints.todo, {
            data: todoData,
            headers: {
                'Content-Type': this.todoApiLocators.headers.contentType,
                'Accept': this.todoApiLocators.headers.accept
            }
        });
    }

    // PATCH Methods
    /**
     * Partially update a todo (only specified fields)
     * @param todoData - Partial todo data object with at least id
     * @returns APIResponse
     */
    @step((todoData) => `Partially update todo with ID: ${todoData.id}`)
    async patchTodo(todoData: TodoPatch): Promise<APIResponse> {
        return await this.request.patch(this.todoApiLocators.endpoints.todo, {
            data: todoData,
            headers: {
                'Content-Type': this.todoApiLocators.headers.contentType,
                'Accept': this.todoApiLocators.headers.accept
            }
        });
    }

    // DELETE Methods
    /**
     * Delete a todo by ID
     * @param id - Todo ID
     * @returns APIResponse
     */
    @step((id) => `Delete todo with ID: ${id}`)
    async deleteTodo(id: number): Promise<APIResponse> {
        return await this.request.delete(this.todoApiLocators.endpoints.todo, {
            data: { id },
            headers: {
                'Content-Type': this.todoApiLocators.headers.contentType,
                'Accept': this.todoApiLocators.headers.accept
            }
        });
    }

    // Utility Methods
    /**
     * Parse JSON response body
     * @param response - API Response
     * @returns Parsed JSON object
     */
    async getResponseBody(response: APIResponse): Promise<any> {
        return await response.json();
    }

    /**
     * Get response status code
     * @param response - API Response
     * @returns Status code
     */
    getStatusCode(response: APIResponse): number {
        return response.status();
    }

    /**
     * Get response headers
     * @param response - API Response
     * @returns Response headers
     */
    getHeaders(response: APIResponse): any {
        return response.headers();
    }

    // ============================================
    // VERIFICATION METHODS
    // ============================================

    /**
     * Verify response status code
     * @param response - API Response
     * @param expectedStatusCode - Expected status code
     */
    @step((response, expectedStatusCode) => `Verify status code is ${expectedStatusCode}`)
    async verifyStatusCode(response: APIResponse, expectedStatusCode: number): Promise<void> {
        expect(this.getStatusCode(response)).toBe(expectedStatusCode);
    }

    /**
     * Verify response success field
     * @param responseBody - Response body
     * @param expectedSuccess - Expected success value
     */
    @step((responseBody, expectedSuccess) => `Verify success field is ${expectedSuccess}`)
    async verifySuccessField(responseBody: any, expectedSuccess: boolean): Promise<void> {
        expect(responseBody.success).toBe(expectedSuccess);
    }

    /**
     * Verify schema for GET all todos response
     * @param responseBody - Response body
     */
    @step('Verify GET all todos response schema')
    async verifyGetAllTodosSchema(responseBody: any): Promise<void> {
        const validation = SchemaValidator.validateGetAllTodosResponse(responseBody);
        expect(validation.valid, `Schema validation failed: ${validation.errors.join(', ')}`).toBe(true);
    }

    /**
     * Verify schema for GET single todo response
     * @param responseBody - Response body
     */
    @step('Verify GET single todo response schema')
    async verifyGetTodoSchema(responseBody: any): Promise<void> {
        const validation = SchemaValidator.validateGetTodoResponse(responseBody);
        expect(validation.valid, `Schema validation failed: ${validation.errors.join(', ')}`).toBe(true);
    }

    /**
     * Verify schema for POST/PUT/PATCH response
     * @param responseBody - Response body
     */
    @step('Verify create or update todo response schema')
    async verifyCreateOrUpdateTodoSchema(responseBody: any): Promise<void> {
        const validation = SchemaValidator.validateCreateOrUpdateTodoResponse(responseBody);
        expect(validation.valid, `Schema validation failed: ${validation.errors.join(', ')}`).toBe(true);
    }

    /**
     * Verify schema for DELETE response
     * @param responseBody - Response body
     */
    @step('Verify DELETE response schema')
    async verifyDeleteTodoSchema(responseBody: any): Promise<void> {
        // Normalize deleted.id from string to number for schema validation
        const normalizedBody = {
            ...responseBody,
            deleted: {
                ...responseBody.deleted,
                id: Number(responseBody.deleted.id)
            }
        };
        const validation = SchemaValidator.validateDeleteTodoResponse(normalizedBody);
        expect(validation.valid, `Schema validation failed: ${validation.errors.join(', ')}`).toBe(true);
    }

    /**
     * Verify schema for reset database response
     * @param responseBody - Response body
     */
    @step('Verify reset database response schema')
    async verifyResetDatabaseSchema(responseBody: any): Promise<void> {
        const validation = SchemaValidator.validateResetResponse(responseBody);
        expect(validation.valid, `Schema validation failed: ${validation.errors.join(', ')}`).toBe(true);
    }

    /**
     * Verify schema for error response
     * @param responseBody - Response body
     */
    @step('Verify error response schema')
    async verifyErrorResponseSchema(responseBody: any): Promise<void> {
        const validation = SchemaValidator.validateErrorResponse(responseBody);
        expect(validation.valid, `Schema validation failed: ${validation.errors.join(', ')}`).toBe(true);
    }

    /**
     * Verify response has required property
     * @param responseBody - Response body
     * @param propertyName - Property name
     */
    @step((responseBody, propertyName) => `Verify response has property: ${propertyName}`)
    async verifyHasProperty(responseBody: any, propertyName: string): Promise<void> {
        expect(responseBody).toHaveProperty(propertyName);
    }

    /**
     * Verify response body is array
     * @param data - Data to verify
     */
    @step('Verify response data is array')
    async verifyIsArray(data: any): Promise<void> {
        expect(Array.isArray(data)).toBe(true);
    }

    /**
     * Verify array length is greater than value
     * @param array - Array to verify
     * @param value - Minimum value
     */
    @step((array, value) => `Verify array length > ${value}`)
    async verifyArrayLengthGreaterThan(array: any[], value: number): Promise<void> {
        expect(array.length).toBeGreaterThan(value);
    }

    /**
     * Verify field value equals expected value
     * @param actualValue - Actual value
     * @param expectedValue - Expected value
     * @param fieldName - Field name for logging
     */
    @step((actualValue, expectedValue, fieldName) => `Verify ${fieldName} equals ${expectedValue}`)
    async verifyFieldEquals(actualValue: any, expectedValue: any, fieldName?: string): Promise<void> {
        expect(actualValue).toBe(expectedValue);
    }

    /**
     * Verify field value not equals expected value
     * @param actualValue - Actual value
     * @param expectedValue - Expected value
     * @param fieldName - Field name for logging
     */
    @step((actualValue, expectedValue, fieldName) => `Verify ${fieldName} not equals ${expectedValue}`)
    async verifyFieldNotEquals(actualValue: any, expectedValue: any, fieldName?: string): Promise<void> {
        expect(actualValue).not.toBe(expectedValue);
    }

    /**
     * Verify todo ID in response
     * @param responseBody - Response body
     * @param expectedId - Expected ID
     */
    @step((responseBody, expectedId) => `Verify todo ID is ${expectedId}`)
    async verifyTodoId(responseBody: any, expectedId: number): Promise<void> {
        expect(responseBody.todo.id).toBe(expectedId);
    }

    /**
     * Verify todo title
     * @param responseBody - Response body
     * @param expectedTitle - Expected title
     */
    @step((responseBody, expectedTitle) => `Verify todo title is "${expectedTitle}"`)
    async verifyTodoTitle(responseBody: any, expectedTitle: string): Promise<void> {
        expect(responseBody.todo.title).toBe(expectedTitle);
    }

    /**
     * Verify todo description
     * @param responseBody - Response body
     * @param expectedDescription - Expected description
     */
    @step((responseBody, expectedDescription) => `Verify todo description is "${expectedDescription}"`)
    async verifyTodoDescription(responseBody: any, expectedDescription: string): Promise<void> {
        expect(responseBody.todo.description).toBe(expectedDescription);
    }

    /**
     * Verify todo status
     * @param responseBody - Response body
     * @param expectedStatus - Expected status
     */
    @step((responseBody, expectedStatus) => `Verify todo status is "${expectedStatus}"`)
    async verifyTodoStatus(responseBody: any, expectedStatus: string): Promise<void> {
        expect(responseBody.todo.status).toBe(expectedStatus);
    }

    /**
     * Verify todo priority
     * @param responseBody - Response body
     * @param expectedPriority - Expected priority
     */
    @step((responseBody, expectedPriority) => `Verify todo priority is "${expectedPriority}"`)
    async verifyTodoPriority(responseBody: any, expectedPriority: string): Promise<void> {
        expect(responseBody.todo.priority).toBe(expectedPriority);
    }

    /**
     * Verify todo user_id
     * @param responseBody - Response body
     * @param expectedUserId - Expected user_id
     */
    @step((responseBody, expectedUserId) => `Verify todo user_id is ${expectedUserId}`)
    async verifyTodoUserId(responseBody: any, expectedUserId: number): Promise<void> {
        expect(responseBody.todo.user_id).toBe(expectedUserId);
    }

    /**
     * Verify deleted todo ID
     * @param responseBody - Response body
     * @param expectedId - Expected deleted ID
     */
    @step((responseBody, expectedId) => `Verify deleted todo ID is ${expectedId}`)
    async verifyDeletedTodoId(responseBody: any, expectedId: number): Promise<void> {
        expect(Number(responseBody.deleted.id)).toBe(expectedId);
    }

    /**
     * Verify array contains value
     * @param array - Array to check
     * @param value - Value to find
     */
    @step((array, value) => `Verify array contains ${value}`)
    async verifyArrayContains(array: any[], value: any): Promise<void> {
        expect(array).toContain(value);
    }

    /**
     * Verify data type of field
     * @param value - Value to check
     * @param expectedType - Expected type ('string', 'number', 'boolean', 'object')
     */
    @step((value, expectedType) => `Verify field type is ${expectedType}`)
    async verifyFieldType(value: any, expectedType: string): Promise<void> {
        expect(typeof value).toBe(expectedType);
    }

    /**
     * Verify todos are ordered by date (newest first)
     * @param todos - Array of todos
     */
    @step('Verify todos are ordered by creation date (newest first)')
    async verifyTodosOrderedByDate(todos: any[]): Promise<void> {
        if (todos.length > 1) {
            const firstTodoDate = new Date(todos[0].created_at);
            const secondTodoDate = new Date(todos[1].created_at);
            expect(firstTodoDate >= secondTodoDate).toBe(true);
        }
    }

    /**
     * Verify todo has all required fields
     * @param todo - Todo object
     */
    @step('Verify todo has all required fields')
    async verifyTodoHasRequiredFields(todo: any): Promise<void> {
        expect(todo).toHaveProperty('id');
        expect(todo).toHaveProperty('title');
        expect(todo).toHaveProperty('description');
        expect(todo).toHaveProperty('status');
        expect(todo).toHaveProperty('priority');
        expect(todo).toHaveProperty('created_at');
        expect(todo).toHaveProperty('updated_at');
    }

    /**
     * Verify todo status is valid enum value
     * @param status - Status to verify
     */
    @step((status) => `Verify status "${status}" is valid`)
    async verifyValidStatus(status: string): Promise<void> {
        expect(['pending', 'in_progress', 'completed']).toContain(status);
    }

    /**
     * Verify todo priority is valid enum value
     * @param priority - Priority to verify
     */
    @step((priority) => `Verify priority "${priority}" is valid`)
    async verifyValidPriority(priority: string): Promise<void> {
        expect(['low', 'medium', 'high']).toContain(priority);
    }

    /**
     * Verify array length equals expected value
     * @param array - Array to check
     * @param expectedLength - Expected length
     */
    @step((array, expectedLength) => `Verify array length is ${expectedLength}`)
    async verifyArrayLength(array: any[], expectedLength: number): Promise<void> {
        expect(array.length).toBe(expectedLength);
    }

    /**
     * Verify response has property with message
     * @param responseBody - Response body
     */
    @step('Verify response has message property')
    async verifyHasMessage(responseBody: any): Promise<void> {
        expect(responseBody).toHaveProperty('message');
    }

    /**
     * Verify deleted message exists and is valid
     * @param responseBody - Response body
     */
    @step('Verify deleted message is valid')
    async verifyDeletedMessage(responseBody: any): Promise<void> {
        expect(responseBody.deleted.message).toBeDefined();
        expect(typeof responseBody.deleted.message).toBe('string');
        expect(responseBody.deleted.message.length).toBeGreaterThan(0);
    }

    /**
     * Verify reset response has sample_data
     * @param responseBody - Response body
     */
    @step('Verify reset response has sample_data')
    async verifyResetSampleData(responseBody: any): Promise<void> {
        expect(responseBody.reset).toHaveProperty('sample_data');
        expect(responseBody.reset.sample_data).toHaveProperty('todos');
        expect(typeof responseBody.reset.sample_data.todos).toBe('number');
        expect(responseBody.reset.sample_data.todos).toBeGreaterThan(0);
    }

    /**
     * Verify todo exists in array by ID
     * @param todos - Array of todos
     * @param todoId - ID to find
     */
    @step((todos, todoId) => `Verify todo with ID ${todoId} exists in array`)
    async verifyTodoExistsInArray(todos: any[], todoId: number): Promise<void> {
        const foundTodo = todos.find((todo: any) => todo.id === todoId);
        expect(foundTodo).toBeDefined();
    }

    /**
     * Verify found todo details
     * @param foundTodo - Found todo object
     * @param expectedTitle - Expected title
     * @param expectedStatus - Expected status
     * @param expectedPriority - Expected priority
     */
    @step('Verify found todo details')
    async verifyFoundTodoDetails(
        foundTodo: any,
        expectedTitle: string,
        expectedStatus?: string,
        expectedPriority?: string
    ): Promise<void> {
        expect(foundTodo.title).toBe(expectedTitle);
        if (expectedStatus) {
            expect(foundTodo.status).toBe(expectedStatus);
        }
        if (expectedPriority) {
            expect(foundTodo.priority).toBe(expectedPriority);
        }
    }
}
