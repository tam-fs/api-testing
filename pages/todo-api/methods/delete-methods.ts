import { APIResponse } from '@playwright/test';
import { step } from '../../../utils/logging';
import { BaseApi } from '../base/base-api';
import { SchemaValidations } from '../validations/schema-validations';

export class DeleteMethods extends BaseApi {
    private schemaValidations: SchemaValidations;

    constructor(request: any, autoValidateSchema: boolean = true) {
        super(request, autoValidateSchema);
        this.schemaValidations = new SchemaValidations();
    }

    /**
     * Delete a todo by ID with automatic schema validation
     * @param id - Todo ID
     * @returns APIResponse
     */
    @step((id) => `Delete todo with ID: ${id}`)
    async deleteTodo(id: number): Promise<APIResponse> {
        const response = await this.request.delete(this.endpoints.todo, {
            data: { id }
        });

        // Auto validate schema if enabled
        if (this.autoValidateSchema) {
            const body = await this.getCachedResponseBody(response);
            if (response.ok()) {
                await this.schemaValidations.verifyDeleteTodoSchema(body);
            } else {
                await this.schemaValidations.verifyErrorResponseSchema(body);
            }
        }

        return response;
    }
}
