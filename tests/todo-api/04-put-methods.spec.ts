import { test, BaseTest } from '../base-test';
import { STATUS_CODES, TEST_IDS } from '../../constants/test-constants';
import { TodoInput, TodoUpdate, Status, Priority } from '../../interfaces/todo.interface';

test.describe('Todo API - PUT Methods', () => {
    const baseTest = new BaseTest();
    let testData: any;

    test.beforeAll(async () => {
        testData = baseTest.loadDataInfo('todo-test-data.json');
    });

    test.beforeEach(async ({ todoApiPage }) => {
        const resetResponse = await todoApiPage.resetDatabase();
        const resetBody = await todoApiPage.getResponseBody(resetResponse);
        await todoApiPage.verifySuccessField(resetBody, true);
    });

    test('TC012 - PUT update todo with all fields', async ({ todoApiPage }) => {
        const originalTodo: TodoInput = {
            title: 'Original Title',
            description: 'Original description',
            status: Status.PENDING,
            priority: Priority.LOW,
            user_id: 1
        };

        const createResponse = await todoApiPage.createTodo(originalTodo);
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const updatedTodo: TodoUpdate = {
            id: todoId,
            title: 'Updated Title',
            description: 'Updated description',
            status: Status.COMPLETED,
            priority: Priority.HIGH,
            due_date: '2025-12-31 23:59:59',
            user_id: 1
        };

        const response = await todoApiPage.updateTodo(updatedTodo);
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, STATUS_CODES.OK);
        await todoApiPage.verifySuccessField(responseBody, true);
        await todoApiPage.verifyTodoId(responseBody, todoId);
        await todoApiPage.verifyTodoTitle(responseBody, 'Updated Title');
        await todoApiPage.verifyTodoDescription(responseBody, 'Updated description');
        await todoApiPage.verifyTodoStatus(responseBody, 'completed');
        await todoApiPage.verifyTodoPriority(responseBody, 'high');
    });

    test('TC013 - PUT update todo status from pending to in_progress', async ({ todoApiPage }) => {
        const originalTodo: TodoInput = {
            title: 'Todo to Update',
            status: Status.PENDING,
            priority: Priority.MEDIUM
        };

        const createResponse = await todoApiPage.createTodo(originalTodo);
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const updatedTodo: TodoUpdate = {
            id: todoId,
            title: 'Todo to Update',
            status: Status.IN_PROGRESS,
            priority: Priority.MEDIUM
        };

        const response = await todoApiPage.updateTodo(updatedTodo);
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, STATUS_CODES.OK);
        await todoApiPage.verifyTodoStatus(responseBody, 'in_progress');
    });

    test('TC014 - PUT update non-existent todo returns 404', async ({ todoApiPage }) => {
        const updateData: TodoUpdate = {
            id: TEST_IDS.NON_EXISTENT_ID,
            title: 'Non-existent Todo',
            status: Status.PENDING,
            priority: Priority.MEDIUM
        };

        const response = await todoApiPage.updateTodo(updateData);
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, STATUS_CODES.NOT_FOUND);
        await todoApiPage.verifySuccessField(responseBody, false);
    });

    test('TC015 - PUT update todo without title returns 400', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: 'Todo to Update'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const invalidUpdate: TodoUpdate = {
            id: todoId,
            title: '' as any
        };

        const response = await todoApiPage.updateTodo(invalidUpdate);
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, STATUS_CODES.BAD_REQUEST);
        await todoApiPage.verifySuccessField(responseBody, false);
    });
});
