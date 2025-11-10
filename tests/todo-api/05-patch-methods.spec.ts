import { test } from '../base-test';

test.describe('Todo API - PATCH Methods', () => {
    test.beforeEach(async ({ todoApiPage }) => {
        const resetResponse = await todoApiPage.resetDatabase();
        const resetBody = await todoApiPage.getResponseBody(resetResponse);
        await todoApiPage.verifySuccessField(resetBody, true);
    });

    test('TC047 - PATCH update only todo title', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: 'Original Title',
            description: 'Original description',
            status: 'pending',
            priority: 'low'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const response = await todoApiPage.patchTodo({
            id: todoId,
            title: 'Patched Title'
        });
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, 200);
        await todoApiPage.verifySuccessField(responseBody, true);
        await todoApiPage.verifyTodoTitle(responseBody, 'Patched Title');
        await todoApiPage.verifyTodoDescription(responseBody, 'Original description');
        await todoApiPage.verifyTodoStatus(responseBody, 'pending');
        await todoApiPage.verifyTodoPriority(responseBody, 'low');
    });

    test('TC048 - PATCH update only todo status', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: 'Todo Status Patch',
            description: 'Testing patch',
            status: 'pending',
            priority: 'medium'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const response = await todoApiPage.patchTodo({
            id: todoId,
            status: 'in_progress'
        });
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, 200);
        await todoApiPage.verifyTodoStatus(responseBody, 'in_progress');
        await todoApiPage.verifyTodoTitle(responseBody, 'Todo Status Patch');
        await todoApiPage.verifyTodoDescription(responseBody, 'Testing patch');
        await todoApiPage.verifyTodoPriority(responseBody, 'medium');
    });

    test('TC049 - PATCH update only todo priority', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: 'Todo Priority Patch',
            status: 'pending',
            priority: 'low'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const response = await todoApiPage.patchTodo({
            id: todoId,
            priority: 'high'
        });
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, 200);
        await todoApiPage.verifyTodoPriority(responseBody, 'high');
        await todoApiPage.verifyTodoTitle(responseBody, 'Todo Priority Patch');
        await todoApiPage.verifyTodoStatus(responseBody, 'pending');
    });

    test('TC050 - PATCH update only todo description', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: 'Todo Description Patch',
            description: 'Original description',
            status: 'pending',
            priority: 'medium'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const response = await todoApiPage.patchTodo({
            id: todoId,
            description: 'Patched description'
        });
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, 200);
        await todoApiPage.verifyTodoDescription(responseBody, 'Patched description');
        await todoApiPage.verifyTodoTitle(responseBody, 'Todo Description Patch');
    });

    test('TC051 - PATCH update multiple fields', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: 'Todo Multi Patch',
            description: 'Original',
            status: 'pending',
            priority: 'low'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const response = await todoApiPage.patchTodo({
            id: todoId,
            title: 'Updated Title',
            status: 'completed',
            priority: 'high'
        });
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, 200);
        await todoApiPage.verifyTodoTitle(responseBody, 'Updated Title');
        await todoApiPage.verifyTodoStatus(responseBody, 'completed');
        await todoApiPage.verifyTodoPriority(responseBody, 'high');
        await todoApiPage.verifyTodoDescription(responseBody, 'Original');
    });

    test('TC052 - PATCH update status from pending to completed', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: 'Complete Me',
            status: 'pending'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const response = await todoApiPage.patchTodo({
            id: todoId,
            status: 'completed'
        });
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, 200);
        await todoApiPage.verifyTodoStatus(responseBody, 'completed');
    });

    test('TC053 - PATCH update due_date', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: 'Todo with Due Date Update'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const response = await todoApiPage.patchTodo({
            id: todoId,
            due_date: '2025-12-31 23:59:59'
        });
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, 200);
        await todoApiPage.verifyHasProperty(responseBody.todo, 'due_date');
    });

    test('TC054 - PATCH update user_id', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: 'Todo User Update',
            user_id: 1
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const response = await todoApiPage.patchTodo({
            id: todoId,
            user_id: 2
        });
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, 200);
        await todoApiPage.verifyTodoUserId(responseBody, 2);
    });

    test('TC055 - PATCH non-existent todo returns 404', async ({ todoApiPage }) => {
        const response = await todoApiPage.patchTodo({
            id: 999999,
            title: 'Non-existent Todo'
        });
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, 404);
        await todoApiPage.verifySuccessField(responseBody, false);
    });

    test('TC056 - PATCH without ID returns 400', async ({ todoApiPage }) => {
        const response = await todoApiPage.patchTodo({
            id: null as any,
            title: 'Todo without ID'
        });
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, 400);
        await todoApiPage.verifySuccessField(responseBody, false);
    });

    test('TC057 - PATCH with no fields to update (only ID) returns 400', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: 'Todo No Update'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const response = await todoApiPage.patchTodo({
            id: todoId
        });
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, 400);
        await todoApiPage.verifySuccessField(responseBody, false);
    });

    test('TC058 - PATCH and verify changes persist', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: 'Todo Persistence Test',
            status: 'pending',
            priority: 'low'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        await todoApiPage.patchTodo({
            id: todoId,
            status: 'completed',
            priority: 'high'
        });

        const getResponse = await todoApiPage.getTodoById(todoId);
        const getBody = await todoApiPage.getResponseBody(getResponse);

        await todoApiPage.verifyTodoStatus(getBody, 'completed');
        await todoApiPage.verifyTodoPriority(getBody, 'high');
        await todoApiPage.verifyTodoTitle(getBody, 'Todo Persistence Test');
    });

    test('TC059 - PATCH difference vs PUT - partial update', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: 'PATCH vs PUT Test',
            description: 'Full description',
            status: 'pending',
            priority: 'medium'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const patchResponse = await todoApiPage.patchTodo({
            id: todoId,
            status: 'completed'
        });
        const patchBody = await todoApiPage.getResponseBody(patchResponse);

        await todoApiPage.verifyTodoStatus(patchBody, 'completed');
        await todoApiPage.verifyTodoTitle(patchBody, 'PATCH vs PUT Test');
        await todoApiPage.verifyTodoDescription(patchBody, 'Full description');
        await todoApiPage.verifyTodoPriority(patchBody, 'medium');
    });

    test('TC060 - PATCH multiple todos sequentially', async ({ todoApiPage }) => {
        const create1 = await todoApiPage.createTodo({ title: 'Patch Todo 1', status: 'pending' });
        const create2 = await todoApiPage.createTodo({ title: 'Patch Todo 2', status: 'pending' });

        const body1 = await todoApiPage.getResponseBody(create1);
        const body2 = await todoApiPage.getResponseBody(create2);

        const id1 = body1.todo.id;
        const id2 = body2.todo.id;

        const patch1 = await todoApiPage.patchTodo({ id: id1, status: 'completed' });
        const patch2 = await todoApiPage.patchTodo({ id: id2, priority: 'high' });

        const patchBody1 = await todoApiPage.getResponseBody(patch1);
        const patchBody2 = await todoApiPage.getResponseBody(patch2);

        await todoApiPage.verifyStatusCode(patch1, 200);
        await todoApiPage.verifyStatusCode(patch2, 200);
        await todoApiPage.verifyTodoStatus(patchBody1, 'completed');
        await todoApiPage.verifyTodoPriority(patchBody2, 'high');
    });

    test('TC061 - PATCH update and verify updated_at changes', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: 'Todo Timestamp Patch Test'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;
        const originalUpdatedAt = createBody.todo.updated_at;

        await new Promise(resolve => setTimeout(resolve, 1000));

        const patchResponse = await todoApiPage.patchTodo({
            id: todoId,
            status: 'in_progress'
        });
        const patchBody = await todoApiPage.getResponseBody(patchResponse);

        await todoApiPage.verifyFieldNotEquals(patchBody.todo.updated_at, originalUpdatedAt, 'updated_at');
    });
});
