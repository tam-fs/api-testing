import { test } from '../base-test';

test.describe('Todo API - Schema Validation', () => {
    test.beforeEach(async ({ todoApiPage }) => {
        // Reset database before each test to ensure clean state
        const resetResponse = await todoApiPage.resetDatabase();
        const resetBody = await todoApiPage.getResponseBody(resetResponse);
        await todoApiPage.verifySuccessField(resetBody, true);
    });

    test('TC001 - Verify schema of GET all todos response', async ({ todoApiPage }) => {
        // Get all todos
        const response = await todoApiPage.getAllTodos();
        const responseBody = await todoApiPage.getResponseBody(response);

        // Verify status code
        await todoApiPage.verifyStatusCode(response, 200);

        // Verify schema
        await todoApiPage.verifyGetAllTodosSchema(responseBody);

        // Verify success field and structure
        await todoApiPage.verifySuccessField(responseBody, true);
        await todoApiPage.verifyHasProperty(responseBody, 'todos');
        await todoApiPage.verifyIsArray(responseBody.todos);
    });

    test('TC002 - Verify schema of POST create todo response', async ({ todoApiPage }) => {
        // Create a new todo
        const response = await todoApiPage.createTodo({
            title: 'New Todo for Schema Test',
            description: 'Testing POST schema validation',
            status: 'pending',
            priority: 'high'
        });
        const responseBody = await todoApiPage.getResponseBody(response);

        // Verify status code
        await todoApiPage.verifyStatusCode(response, 201);

        // Verify schema
        await todoApiPage.verifyCreateOrUpdateTodoSchema(responseBody);

        // Verify response structure
        await todoApiPage.verifySuccessField(responseBody, true);
        await todoApiPage.verifyHasProperty(responseBody, 'todo');
        await todoApiPage.verifyHasProperty(responseBody.todo, 'id');
        await todoApiPage.verifyHasProperty(responseBody.todo, 'title');
    });

    test('TC003 - Verify schema of error response (404 Not Found)', async ({ todoApiPage }) => {
        // Try to get a non-existent todo
        const response = await todoApiPage.getTodoById(999999);
        const responseBody = await todoApiPage.getResponseBody(response);

        // Verify status code
        await todoApiPage.verifyStatusCode(response, 404);

        // Verify error schema
        await todoApiPage.verifyErrorResponseSchema(responseBody);

        // Verify error response structure
        await todoApiPage.verifySuccessField(responseBody, false);
    });
});
