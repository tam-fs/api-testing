import { APIResponse } from '@playwright/test';
import { step } from '../../../utils/logging';
import { BaseApi } from '../base/base-api';
import { SchemaValidations } from '../validations/schema-validations';

export class GetMethods extends BaseApi {
    private schemaValidations: SchemaValidations;

    constructor(request: any, autoValidateSchema: boolean = true) {
        super(request, autoValidateSchema);
        this.schemaValidations = new SchemaValidations();
    }

    /**
     * Get all todos with automatic schema validation
     * @returns APIResponse
     */
    @step('Get all todos')
    async getAllTodos(): Promise<APIResponse> {
        const response = await this.request.get(this.endpoints.todos);
        if (this.autoValidateSchema && response.ok()) {
            const body = await this.getCachedResponseBody(response);
            await this.schemaValidations.verifyGetAllTodosSchema(body);
        }

        return response;
    }

    /**
     * Get a specific todo by ID with automatic schema validation
     * @param id - Todo ID
     * @returns APIResponse
     */
    @step((id) => `Get todo by ID: ${id}`)
    async getTodoById(id: number): Promise<APIResponse> {
        const response = await this.request.get(this.endpoints.todo, {
            params: { id }
        });

        // Auto validate schema if enabled
        if (this.autoValidateSchema) {
            const body = await this.getCachedResponseBody(response);
            if (response.ok()) {
                await this.schemaValidations.verifyGetTodoSchema(body);
            } else {
                await this.schemaValidations.verifyErrorResponseSchema(body);
            }
        }

        return response;
    }
}
