import { APIRequestContext, APIResponse } from '@playwright/test';
import { GetMethods } from './methods/get-methods';
import { PostMethods } from './methods/post-methods';
import { PutMethods } from './methods/put-methods';
import { PatchMethods } from './methods/patch-methods';
import { DeleteMethods } from './methods/delete-methods';
import { SchemaValidations } from './validations/schema-validations';
import { CreateTodoRequest, UpdateTodoRequest, PatchTodoRequest } from '../../interfaces/todo.schema';

/**
 * Main Todo API class that composes all HTTP method handlers and validations
 * This class provides a unified interface for API testing
 */
export class TodoApiPage {
    private getMethods: GetMethods;
    private postMethods: PostMethods;
    private putMethods: PutMethods;
    private patchMethods: PatchMethods;
    private deleteMethods: DeleteMethods;
    public validations: SchemaValidations;

    constructor(request: APIRequestContext, autoValidateSchema: boolean = true) {
        // Initialize all method handlers with the same request context
        this.getMethods = new GetMethods(request, autoValidateSchema);
        this.postMethods = new PostMethods(request, autoValidateSchema);
        this.putMethods = new PutMethods(request, autoValidateSchema);
        this.patchMethods = new PatchMethods(request, autoValidateSchema);
        this.deleteMethods = new DeleteMethods(request, autoValidateSchema);

        // Initialize validations
        this.validations = new SchemaValidations();
    }

    /**
     * Enable or disable automatic schema validation for all methods
     * @param enabled - Whether to enable auto validation
     */
    setAutoSchemaValidation(enabled: boolean): void {
        this.getMethods.setAutoSchemaValidation(enabled);
        this.postMethods.setAutoSchemaValidation(enabled);
        this.putMethods.setAutoSchemaValidation(enabled);
        this.patchMethods.setAutoSchemaValidation(enabled);
        this.deleteMethods.setAutoSchemaValidation(enabled);
    }

    // ============================================
    // HTTP METHOD DELEGATES
    // ============================================

    // GET Methods
    async getAllTodos(): Promise<APIResponse> {
        return await this.getMethods.getAllTodos();
    }

    async getTodoById(id: number): Promise<APIResponse> {
        return await this.getMethods.getTodoById(id);
    }

    // POST Methods
    async createTodo(todoData: CreateTodoRequest): Promise<APIResponse> {
        return await this.postMethods.createTodo(todoData);
    }

    async resetDatabase(): Promise<APIResponse> {
        return await this.postMethods.resetDatabase();
    }

    // PUT Methods
    async updateTodo(todoData: UpdateTodoRequest): Promise<APIResponse> {
        return await this.putMethods.updateTodo(todoData);
    }

    // PATCH Methods
    async patchTodo(todoData: PatchTodoRequest): Promise<APIResponse> {
        return await this.patchMethods.patchTodo(todoData);
    }

    // DELETE Methods
    async deleteTodo(id: number): Promise<APIResponse> {
        return await this.deleteMethods.deleteTodo(id);
    }

    // ============================================
    // UTILITY METHODS (from BaseApi)
    // ============================================

    async getResponseBody(response: APIResponse): Promise<any> {
        return await this.getMethods.getResponseBody(response);
    }

    getStatusCode(response: APIResponse): number {
        return this.getMethods.getStatusCode(response);
    }

    getHeaders(response: APIResponse): any {
        return this.getMethods.getHeaders(response);
    }

    // ============================================
    // VALIDATION DELEGATES
    // ============================================

    async verifyStatusCode(response: APIResponse, expectedStatusCode: number): Promise<void> {
        return await this.validations.verifyStatusCode(response, expectedStatusCode);
    }

    async verifySuccessField(responseBody: any, expectedSuccess: boolean): Promise<void> {
        return await this.validations.verifySuccessField(responseBody, expectedSuccess);
    }

    async verifyGetAllTodosSchema(responseBody: any): Promise<void> {
        return await this.validations.verifyGetAllTodosSchema(responseBody);
    }

    async verifyGetTodoSchema(responseBody: any): Promise<void> {
        return await this.validations.verifyGetTodoSchema(responseBody);
    }

    async verifyCreateOrUpdateTodoSchema(responseBody: any): Promise<void> {
        return await this.validations.verifyCreateOrUpdateTodoSchema(responseBody);
    }

    async verifyDeleteTodoSchema(responseBody: any): Promise<void> {
        return await this.validations.verifyDeleteTodoSchema(responseBody);
    }

    async verifyResetDatabaseSchema(responseBody: any): Promise<void> {
        return await this.validations.verifyResetDatabaseSchema(responseBody);
    }

    async verifyErrorResponseSchema(responseBody: any): Promise<void> {
        return await this.validations.verifyErrorResponseSchema(responseBody);
    }

    async verifyHasProperty(responseBody: any, propertyName: string): Promise<void> {
        return await this.validations.verifyHasProperty(responseBody, propertyName);
    }

    async verifyIsArray(data: any): Promise<void> {
        return await this.validations.verifyIsArray(data);
    }

    async verifyArrayLengthGreaterThan(array: any[], value: number): Promise<void> {
        return await this.validations.verifyArrayLengthGreaterThan(array, value);
    }

    async verifyFieldEquals(actualValue: any, expectedValue: any, fieldName?: string): Promise<void> {
        return await this.validations.verifyFieldEquals(actualValue, expectedValue, fieldName);
    }

    async verifyFieldNotEquals(actualValue: any, expectedValue: any, fieldName?: string): Promise<void> {
        return await this.validations.verifyFieldNotEquals(actualValue, expectedValue, fieldName);
    }

    async verifyTodoId(responseBody: any, expectedId: number): Promise<void> {
        return await this.validations.verifyTodoId(responseBody, expectedId);
    }

    async verifyTodoTitle(responseBody: any, expectedTitle: string): Promise<void> {
        return await this.validations.verifyTodoTitle(responseBody, expectedTitle);
    }

    async verifyTodoDescription(responseBody: any, expectedDescription: string): Promise<void> {
        return await this.validations.verifyTodoDescription(responseBody, expectedDescription);
    }

    async verifyTodoStatus(responseBody: any, expectedStatus: string): Promise<void> {
        return await this.validations.verifyTodoStatus(responseBody, expectedStatus);
    }

    async verifyTodoPriority(responseBody: any, expectedPriority: string): Promise<void> {
        return await this.validations.verifyTodoPriority(responseBody, expectedPriority);
    }

    async verifyTodoUserId(responseBody: any, expectedUserId: number): Promise<void> {
        return await this.validations.verifyTodoUserId(responseBody, expectedUserId);
    }

    async verifyDeletedTodoId(responseBody: any, expectedId: number): Promise<void> {
        return await this.validations.verifyDeletedTodoId(responseBody, expectedId);
    }

    async verifyArrayContains(array: any[], value: any): Promise<void> {
        return await this.validations.verifyArrayContains(array, value);
    }

    async verifyFieldType(value: any, expectedType: string): Promise<void> {
        return await this.validations.verifyFieldType(value, expectedType);
    }

    async verifyTodosOrderedByDate(todos: any[]): Promise<void> {
        return await this.validations.verifyTodosOrderedByDate(todos);
    }

    async verifyTodoHasRequiredFields(todo: any): Promise<void> {
        return await this.validations.verifyTodoHasRequiredFields(todo);
    }

    async verifyValidStatus(status: string): Promise<void> {
        return await this.validations.verifyValidStatus(status);
    }

    async verifyValidPriority(priority: string): Promise<void> {
        return await this.validations.verifyValidPriority(priority);
    }

    async verifyArrayLength(array: any[], expectedLength: number): Promise<void> {
        return await this.validations.verifyArrayLength(array, expectedLength);
    }

    async verifyHasMessage(responseBody: any): Promise<void> {
        return await this.validations.verifyHasMessage(responseBody);
    }

    async verifyDeletedMessage(responseBody: any): Promise<void> {
        return await this.validations.verifyDeletedMessage(responseBody);
    }

    async verifyResetSampleData(responseBody: any): Promise<void> {
        return await this.validations.verifyResetSampleData(responseBody);
    }

    async verifyTodoExistsInArray(todos: any[], todoId: number): Promise<void> {
        return await this.validations.verifyTodoExistsInArray(todos, todoId);
    }

    async verifyFoundTodoDetails(
        foundTodo: any,
        expectedTitle: string,
        expectedStatus?: string,
        expectedPriority?: string
    ): Promise<void> {
        return await this.validations.verifyFoundTodoDetails(foundTodo, expectedTitle, expectedStatus, expectedPriority);
    }
}
