import { test } from '../base-test';

test.describe('Todo API - PUT Methods', () => {
    test.beforeEach(async ({ todoApiPage }) => {
        const resetResponse = await todoApiPage.resetDatabase();
        const resetBody = await todoApiPage.getResponseBody(resetResponse);
        await todoApiPage.verifySuccessField(resetBody, true);
    });

    test('TC034 - PUT update todo with all fields', async ({ todoApiPage }) => {
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

    test('TC035 - PUT update todo title', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: 'Old Title',
            description: 'Some description',
            status: 'pending',
            priority: 'medium'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const response = await todoApiPage.updateTodo({
            id: todoId,
            title: 'New Title',
            description: 'Some description',
            status: 'pending',
            priority: 'medium'
        });
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, 200);
        await todoApiPage.verifyTodoTitle(responseBody, 'New Title');
    });

    test('TC036 - PUT update todo status from pending to in_progress', async ({ todoApiPage }) => {
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

    test('TC037 - PUT update todo status from in_progress to completed', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: 'Todo to Complete',
            status: 'in_progress',
            priority: 'high'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const response = await todoApiPage.updateTodo({
            id: todoId,
            title: 'Todo to Complete',
            status: 'completed',
            priority: 'high'
        });
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, 200);
        await todoApiPage.verifyTodoStatus(responseBody, 'completed');
    });

    test('TC038 - PUT update todo priority from low to high', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: 'Todo Priority Update',
            priority: 'low'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const response = await todoApiPage.updateTodo({
            id: todoId,
            title: 'Todo Priority Update',
            priority: 'high'
        });
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, 200);
        await todoApiPage.verifyTodoPriority(responseBody, 'high');
    });

    test('TC039 - PUT update todo description', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: 'Todo with Description',
            description: 'Original description'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const response = await todoApiPage.updateTodo({
            id: todoId,
            title: 'Todo with Description',
            description: 'Updated description content'
        });
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, 200);
        await todoApiPage.verifyTodoDescription(responseBody, 'Updated description content');
    });

    test('TC040 - PUT update todo with due_date', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: 'Todo with Due Date'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const response = await todoApiPage.updateTodo({
            id: todoId,
            title: 'Todo with Due Date',
            due_date: '2025-12-31 23:59:59'
        });
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, 200);
        await todoApiPage.verifyHasProperty(responseBody.todo, 'due_date');
    });

    test('TC041 - PUT update non-existent todo returns 404', async ({ todoApiPage }) => {
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

    test('TC042 - PUT update todo without ID returns 400', async ({ todoApiPage }) => {
        const response = await todoApiPage.updateTodo({
            id: null as any,
            title: 'Todo without ID'
        });
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, 400);
        await todoApiPage.verifySuccessField(responseBody, false);
    });

    test('TC043 - PUT update todo without title returns 400', async ({ todoApiPage }) => {
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

    test('TC044 - PUT update and verify changes persist', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: 'Todo to Verify',
            status: 'pending',
            priority: 'low'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        await todoApiPage.updateTodo({
            id: todoId,
            title: 'Verified Todo',
            status: 'completed',
            priority: 'high'
        });

        const getResponse = await todoApiPage.getTodoById(todoId);
        const getBody = await todoApiPage.getResponseBody(getResponse);

        await todoApiPage.verifyTodoTitle(getBody, 'Verified Todo');
        await todoApiPage.verifyTodoStatus(getBody, 'completed');
        await todoApiPage.verifyTodoPriority(getBody, 'high');
    });

    test('TC045 - PUT update multiple todos sequentially', async ({ todoApiPage }) => {
        const create1 = await todoApiPage.createTodo({ title: 'Todo 1' });
        const create2 = await todoApiPage.createTodo({ title: 'Todo 2' });

        const body1 = await todoApiPage.getResponseBody(create1);
        const body2 = await todoApiPage.getResponseBody(create2);

        const id1 = body1.todo.id;
        const id2 = body2.todo.id;

        const update1 = await todoApiPage.updateTodo({
            id: id1,
            title: 'Updated Todo 1',
            status: 'completed',
            priority: 'high'
        });
        const update2 = await todoApiPage.updateTodo({
            id: id2,
            title: 'Updated Todo 2',
            status: 'in_progress',
            priority: 'low'
        });

        const updateBody1 = await todoApiPage.getResponseBody(update1);
        const updateBody2 = await todoApiPage.getResponseBody(update2);

        await todoApiPage.verifyStatusCode(update1, 200);
        await todoApiPage.verifyStatusCode(update2, 200);
        await todoApiPage.verifyTodoTitle(updateBody1, 'Updated Todo 1');
        await todoApiPage.verifyTodoTitle(updateBody2, 'Updated Todo 2');
    });

    test('TC046 - PUT update todo and verify updated_at changes', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: 'Todo Timestamp Test'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;
        const originalUpdatedAt = createBody.todo.updated_at;

        await new Promise(resolve => setTimeout(resolve, 1000));

        const updateResponse = await todoApiPage.updateTodo({
            id: todoId,
            title: 'Todo Timestamp Test Updated'
        });
        const updateBody = await todoApiPage.getResponseBody(updateResponse);

        await todoApiPage.verifyFieldNotEquals(updateBody.todo.updated_at, originalUpdatedAt, 'updated_at');
    });
});
