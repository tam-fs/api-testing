import { APIResponse } from '@playwright/test';
import { step } from '../../../utils/logging';
import { BaseApi } from '../base/base-api';
import { SchemaValidations } from '../validations/schema-validations';
import { UpdateTodoRequest } from '../../../interfaces/todo.schema';

export class PutMethods extends BaseApi {
    private schemaValidations: SchemaValidations;

    constructor(request: any, autoValidateSchema: boolean = true) {
        super(request, autoValidateSchema);
        this.schemaValidations = new SchemaValidations();
    }

    /**
     * Update an entire todo (all fields required) with automatic schema validation
     * @param todoData - Complete todo data object
     * @returns APIResponse
     */
    @step((todoData) => `Update entire todo with ID: ${todoData.id}`)
    async updateTodo(todoData: UpdateTodoRequest): Promise<APIResponse> {
        const response = await this.request.put(this.endpoints.todo, {
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
}
