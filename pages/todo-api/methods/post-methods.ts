import { APIResponse } from '@playwright/test';
import { step } from '../../../utils/logging';
import { BaseApi } from '../base/base-api';
import { SchemaValidations } from '../validations/schema-validations';
import { CreateTodoRequest } from '../../../interfaces/todo.schema';

export class PostMethods extends BaseApi {
    private schemaValidations: SchemaValidations;

    constructor(request: any, autoValidateSchema: boolean = true) {
        super(request, autoValidateSchema);
        this.schemaValidations = new SchemaValidations();
    }

    /**
     * Create a new todo with automatic schema validation
     * @param todoData - Todo data object
     * @returns APIResponse
     */
    @step('Create a new todo')
    async createTodo(todoData: CreateTodoRequest): Promise<APIResponse> {
        const response = await this.request.post(this.endpoints.todo, {
            data: todoData
        });

        // Auto validate schema if enabled
        if (this.autoValidateSchema) {
            const body = await this.getCachedResponseBody(response);
            if (response.ok()) {
                await this.schemaValidations.verifyCreateOrUpdateTodoSchema(body);
            } else {
                await this.schemaValidations.verifyErrorResponseSchema(body);
            }
        }

        return response;
    }

    /**
     * Reset database with sample data with automatic schema validation
     * @returns APIResponse
     */
    @step('Reset database with sample data')
    async resetDatabase(): Promise<APIResponse> {
        const response = await this.request.post(this.endpoints.reset);

        // Auto validate schema if enabled
        if (this.autoValidateSchema && response.ok()) {
            const body = await this.getCachedResponseBody(response);
            await this.schemaValidations.verifyResetDatabaseSchema(body);
        }

        return response;
    }
}
