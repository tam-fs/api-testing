import { test } from '../base-test';

test.describe('Todo API - PATCH Methods', () => {
    test.beforeEach(async ({ todoApiPage }) => {
        const resetResponse = await todoApiPage.resetDatabase();
        const resetBody = await todoApiPage.getResponseBody(resetResponse);
        await todoApiPage.verifySuccessField(resetBody, true);
    });

    test('TC016 - PATCH update only todo title', async ({ todoApiPage }) => {
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

    test('TC017 - PATCH update only todo status', async ({ todoApiPage }) => {
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

    test('TC018 - PATCH non-existent todo returns 404', async ({ todoApiPage }) => {
        const response = await todoApiPage.patchTodo({
            id: 999999,
            title: 'Non-existent Todo'
        });
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, 404);
        await todoApiPage.verifySuccessField(responseBody, false);
    });

    test('TC019 - PATCH with no fields to update (only ID) returns 400', async ({ todoApiPage }) => {
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
});
