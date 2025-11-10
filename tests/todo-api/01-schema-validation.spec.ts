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

    test('TC002 - Verify schema of GET single todo response', async ({ todoApiPage }) => {
        // Create a todo first
        const createResponse = await todoApiPage.createTodo({
            title: 'Test Todo for Schema Validation',
            description: 'Testing schema validation',
            status: 'pending',
            priority: 'medium'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        // Get the todo by ID
        const response = await todoApiPage.getTodoById(todoId);
        const responseBody = await todoApiPage.getResponseBody(response);

        // Verify status code
        await todoApiPage.verifyStatusCode(response, 200);

        // Verify schema
        await todoApiPage.verifyGetTodoSchema(responseBody);

        // Verify success field and todo object
        await todoApiPage.verifySuccessField(responseBody, true);
        await todoApiPage.verifyHasProperty(responseBody, 'todo');
        await todoApiPage.verifyFieldType(responseBody.todo, 'object');
    });

    test('TC003 - Verify schema of POST create todo response', async ({ todoApiPage }) => {
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

    test('TC004 - Verify schema of PUT update todo response', async ({ todoApiPage }) => {
        // Create a todo first
        const createResponse = await todoApiPage.createTodo({
            title: 'Todo to Update',
            description: 'Original description',
            status: 'pending',
            priority: 'low'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        // Update the todo
        const response = await todoApiPage.updateTodo({
            id: todoId,
            title: 'Updated Todo Title',
            description: 'Updated description',
            status: 'in_progress',
            priority: 'high'
        });
        const responseBody = await todoApiPage.getResponseBody(response);

        // Verify status code
        await todoApiPage.verifyStatusCode(response, 200);

        // Verify schema
        await todoApiPage.verifyCreateOrUpdateTodoSchema(responseBody);

        // Verify response structure
        await todoApiPage.verifySuccessField(responseBody, true);
        await todoApiPage.verifyTodoId(responseBody, todoId);
    });

    test('TC005 - Verify schema of PATCH update todo response', async ({ todoApiPage }) => {
        // Create a todo first
        const createResponse = await todoApiPage.createTodo({
            title: 'Todo to Patch',
            description: 'Original description',
            status: 'pending',
            priority: 'medium'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        // Patch the todo (partial update)
        const response = await todoApiPage.patchTodo({
            id: todoId,
            status: 'completed'
        });
        const responseBody = await todoApiPage.getResponseBody(response);

        // Verify status code
        await todoApiPage.verifyStatusCode(response, 200);

        // Verify schema
        await todoApiPage.verifyCreateOrUpdateTodoSchema(responseBody);

        // Verify response structure
        await todoApiPage.verifySuccessField(responseBody, true);
        await todoApiPage.verifyTodoId(responseBody, todoId);
        await todoApiPage.verifyTodoStatus(responseBody, 'completed');
    });

    test('TC006 - Verify schema of DELETE todo response', async ({ todoApiPage }) => {
        // Create a todo first
        const createResponse = await todoApiPage.createTodo({
            title: 'Todo to Delete',
            description: 'Will be deleted',
            status: 'pending',
            priority: 'low'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        // Delete the todo
        const response = await todoApiPage.deleteTodo(todoId);
        const responseBody = await todoApiPage.getResponseBody(response);

        // Verify status code
        await todoApiPage.verifyStatusCode(response, 200);

        // Verify schema
        await todoApiPage.verifyDeleteTodoSchema(responseBody);

        // Verify response structure
        await todoApiPage.verifySuccessField(responseBody, true);
        await todoApiPage.verifyHasProperty(responseBody, 'deleted');
        await todoApiPage.verifyHasProperty(responseBody.deleted, 'id');
        await todoApiPage.verifyHasProperty(responseBody.deleted, 'message');
        await todoApiPage.verifyDeletedTodoId(responseBody, todoId);
    });

    test('TC007 - Verify schema of POST reset database response', async ({ todoApiPage }) => {
        // Reset database
        const response = await todoApiPage.resetDatabase();
        const responseBody = await todoApiPage.getResponseBody(response);

        // Verify status code
        await todoApiPage.verifyStatusCode(response, 200);

        // Verify schema
        await todoApiPage.verifyResetDatabaseSchema(responseBody);

        // Verify response structure
        await todoApiPage.verifySuccessField(responseBody, true);
        await todoApiPage.verifyHasProperty(responseBody, 'reset');
        await todoApiPage.verifyHasProperty(responseBody.reset, 'message');
        await todoApiPage.verifyHasProperty(responseBody.reset, 'sample_data');
    });

    test('TC008 - Verify schema of error response (404 Not Found)', async ({ todoApiPage }) => {
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
