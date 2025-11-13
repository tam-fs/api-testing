import { APIResponse, expect } from '@playwright/test';
import { step } from '../../../utils/logging';
import { SchemaValidator } from '../../../utils/schema-validator';

export class SchemaValidations {
    /**
     * Verify response status code
     * @param response - API Response
     * @param expectedStatusCode - Expected status code
     */
    @step((response, expectedStatusCode) => `Verify status code is ${expectedStatusCode}`)
    async verifyStatusCode(response: APIResponse, expectedStatusCode: number): Promise<void> {
        // First check response.ok() for clarity - helps identify if status is in 2xx range
        const isSuccessStatus = expectedStatusCode >= 200 && expectedStatusCode < 300;
        expect(response.ok(), `Expected response.ok() to be ${isSuccessStatus} for status ${expectedStatusCode}`).toBe(isSuccessStatus);

        // Then check exact status code
        expect(response.status()).toBe(expectedStatusCode);
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
     * Verify array length equals expected value
     * @param array - Array to check
     * @param expectedLength - Expected length
     */
    @step((array, expectedLength) => `Verify array length is ${expectedLength}`)
    async verifyArrayLength(array: any[], expectedLength: number): Promise<void> {
        expect(array.length).toBe(expectedLength);
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

}
