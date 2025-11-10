import { Page } from '@playwright/test';
import { CommonLocators } from '../common-locators';

export class TodoApiLocators extends CommonLocators {
    // Base URL
    public readonly baseUrl: string = 'https://material.playwrightvn.com/api/todo-app/v1';

    // API Endpoints
    public readonly endpoints = {
        todos: `${this.baseUrl}/todos.php`,
        todo: `${this.baseUrl}/todo.php`,
        reset: `${this.baseUrl}/reset.php`
    };

    // Headers
    public readonly headers = {
        contentType: 'application/json',
        accept: 'application/json'
    };

    constructor(page: Page) {
        super(page);
    }

    protected initializeLocators(): void {
        // No UI locators needed for API testing
    }
}
