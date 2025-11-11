import { test } from '../base-test';

test.describe('Todo API - DELETE Methods', () => {
    test.beforeEach(async ({ todoApiPage }) => {
        const resetResponse = await todoApiPage.resetDatabase();
        const resetBody = await todoApiPage.getResponseBody(resetResponse);
        await todoApiPage.verifySuccessField(resetBody, true);
    });

    test('TC020 - DELETE todo successfully', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: 'Todo to Delete',
            description: 'This will be deleted',
            status: 'pending',
            priority: 'low'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const response = await todoApiPage.deleteTodo(todoId);
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, 200);
        await todoApiPage.verifySuccessField(responseBody, true);
        await todoApiPage.verifyHasProperty(responseBody, 'deleted');
        await todoApiPage.verifyHasProperty(responseBody.deleted, 'id');
        await todoApiPage.verifyHasProperty(responseBody.deleted, 'message');
        await todoApiPage.verifyDeletedTodoId(responseBody, todoId);
    });

    test('TC021 - DELETE todo and verify it is removed', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: 'Todo to Remove',
            status: 'pending'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        await todoApiPage.deleteTodo(todoId);

        const getResponse = await todoApiPage.getTodoById(todoId);
        const getBody = await todoApiPage.getResponseBody(getResponse);

        await todoApiPage.verifyStatusCode(getResponse, 404);
        await todoApiPage.verifySuccessField(getBody, false);
    });

    test('TC022 - DELETE non-existent todo returns 404', async ({ todoApiPage }) => {
        const response = await todoApiPage.deleteTodo(999999);
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, 404);
        await todoApiPage.verifySuccessField(responseBody, false);
    });

    test('TC023 - DELETE same todo twice returns 404 on second attempt', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: 'Todo Double Delete'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const firstDelete = await todoApiPage.deleteTodo(todoId);
        await todoApiPage.verifyStatusCode(firstDelete, 200);

        const secondDelete = await todoApiPage.deleteTodo(todoId);
        const secondDeleteBody = await todoApiPage.getResponseBody(secondDelete);

        await todoApiPage.verifyStatusCode(secondDelete, 404);
        await todoApiPage.verifySuccessField(secondDeleteBody, false);
    });
});
