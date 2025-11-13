import { APIRequestContext, APIResponse } from '@playwright/test';

export class BaseApi {
    protected readonly request: APIRequestContext;
    protected autoValidateSchema: boolean = true;
    protected responseBodyCache: Map<APIResponse, any> = new Map();

    // API Endpoints - relative paths that will be appended to baseURL from playwright.config.ts
    protected readonly endpoints = {
        todos: 'todos.php',
        todo: 'todo.php',
        reset: 'reset.php'
    };

    constructor(request: APIRequestContext, autoValidateSchema: boolean = true) {
        this.request = request;
        this.autoValidateSchema = autoValidateSchema;
    }

    /**
     * Enable or disable automatic schema validation
     * @param enabled - Whether to enable auto validation
     */
    setAutoSchemaValidation(enabled: boolean): void {
        this.autoValidateSchema = enabled;
    }

    /**
     * Helper method to get and cache response body
     * @param response - API Response
     * @returns Cached or freshly parsed JSON body
     */
    protected async getCachedResponseBody(response: APIResponse): Promise<any> {
        if (!this.responseBodyCache.has(response)) {
            const body = await response.json();
            this.responseBodyCache.set(response, body);
        }
        return this.responseBodyCache.get(response);
    }

    /**
     * Parse JSON response body (uses cache to avoid reading response body multiple times)
     * @param response - API Response
     * @returns Parsed JSON object
     */
    async getResponseBody(response: APIResponse): Promise<any> {
        return await this.getCachedResponseBody(response);
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
}
