import { APIResponse } from '@playwright/test';
import { step } from '../../../utils/logging';
import { BaseApi } from '../base/base-api';
import { SchemaValidations } from '../validations/schema-validations';
import { PatchTodoRequest } from '../../../interfaces/todo.schema';

export class PatchMethods extends BaseApi {
    private schemaValidations: SchemaValidations;

    constructor(request: any, autoValidateSchema: boolean = true) {
        super(request, autoValidateSchema);
        this.schemaValidations = new SchemaValidations();
    }

    /**
     * Partially update a todo (only specified fields) with automatic schema validation
     * @param todoData - Partial todo data object with at least id
     * @returns APIResponse
     */
    @step((todoData) => `Partially update todo with ID: ${todoData.id}`)
    async patchTodo(todoData: PatchTodoRequest): Promise<APIResponse> {
        const response = await this.request.patch(this.endpoints.todo, {
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
