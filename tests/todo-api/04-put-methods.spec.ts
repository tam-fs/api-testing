import { test } from '../base-test';

test.describe('Todo API - PUT Methods', () => {
    test.beforeEach(async ({ todoApiPage }) => {
        const resetResponse = await todoApiPage.resetDatabase();
        const resetBody = await todoApiPage.getResponseBody(resetResponse);
        await todoApiPage.verifySuccessField(resetBody, true);
    });

    test('TC012 - PUT update todo with all fields', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: 'Original Title',
            description: 'Original description',
            status: 'pending',
            priority: 'low',
            user_id: 1
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const response = await todoApiPage.updateTodo({
            id: todoId,
            title: 'Updated Title',
            description: 'Updated description',
            status: 'completed',
            priority: 'high',
            due_date: '2025-12-31 23:59:59',
            user_id: 1
        });
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, 200);
        await todoApiPage.verifySuccessField(responseBody, true);
        await todoApiPage.verifyTodoId(responseBody, todoId);
        await todoApiPage.verifyTodoTitle(responseBody, 'Updated Title');
        await todoApiPage.verifyTodoDescription(responseBody, 'Updated description');
        await todoApiPage.verifyTodoStatus(responseBody, 'completed');
        await todoApiPage.verifyTodoPriority(responseBody, 'high');
    });

    test('TC013 - PUT update todo status from pending to in_progress', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: 'Todo to Update',
            status: 'pending',
            priority: 'medium'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const response = await todoApiPage.updateTodo({
            id: todoId,
            title: 'Todo to Update',
            status: 'in_progress',
            priority: 'medium'
        });
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, 200);
        await todoApiPage.verifyTodoStatus(responseBody, 'in_progress');
    });

    test('TC014 - PUT update non-existent todo returns 404', async ({ todoApiPage }) => {
        const response = await todoApiPage.updateTodo({
            id: 999999,
            title: 'Non-existent Todo',
            status: 'pending',
            priority: 'medium'
        });
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, 404);
        await todoApiPage.verifySuccessField(responseBody, false);
    });

    test('TC015 - PUT update todo without title returns 400', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: 'Todo to Update'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const response = await todoApiPage.updateTodo({
            id: todoId,
            title: '' as any
        });
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, 400);
        await todoApiPage.verifySuccessField(responseBody, false);
    });
});
