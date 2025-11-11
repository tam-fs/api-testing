import { test, BaseTest } from '../base-test';
import { STATUS_CODES, TEST_IDS } from '../../constants/test-constants';
import { TodoInput, TodoPatch, Status, Priority } from '../../interfaces/todo.interface';

test.describe('Todo API - PATCH Methods', () => {
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

    test('TC016 - PATCH update only todo title', async ({ todoApiPage }) => {
        const originalTodo: TodoInput = {
            title: 'Original Title',
            description: 'Original description',
            status: Status.PENDING,
            priority: Priority.LOW
        };

        const createResponse = await todoApiPage.createTodo(originalTodo);
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const patchData: TodoPatch = {
            id: todoId,
            title: 'Patched Title'
        };

        const response = await todoApiPage.patchTodo(patchData);
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, STATUS_CODES.OK);
        await todoApiPage.verifySuccessField(responseBody, true);
        await todoApiPage.verifyTodoTitle(responseBody, 'Patched Title');
        await todoApiPage.verifyTodoDescription(responseBody, 'Original description');
        await todoApiPage.verifyTodoStatus(responseBody, 'pending');
        await todoApiPage.verifyTodoPriority(responseBody, 'low');
    });

    test('TC017 - PATCH update only todo status', async ({ todoApiPage }) => {
        const originalTodo: TodoInput = {
            title: 'Todo Status Patch',
            description: 'Testing patch',
            status: Status.PENDING,
            priority: Priority.MEDIUM
        };

        const createResponse = await todoApiPage.createTodo(originalTodo);
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const patchData: TodoPatch = {
            id: todoId,
            status: Status.IN_PROGRESS
        };

        const response = await todoApiPage.patchTodo(patchData);
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, STATUS_CODES.OK);
        await todoApiPage.verifyTodoStatus(responseBody, 'in_progress');
        await todoApiPage.verifyTodoTitle(responseBody, 'Todo Status Patch');
        await todoApiPage.verifyTodoDescription(responseBody, 'Testing patch');
        await todoApiPage.verifyTodoPriority(responseBody, 'medium');
    });

    test('TC018 - PATCH non-existent todo returns 404', async ({ todoApiPage }) => {
        const patchData: TodoPatch = {
            id: TEST_IDS.NON_EXISTENT_ID,
            title: 'Non-existent Todo'
        };

        const response = await todoApiPage.patchTodo(patchData);
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, STATUS_CODES.NOT_FOUND);
        await todoApiPage.verifySuccessField(responseBody, false);
    });

    test('TC019 - PATCH with no fields to update (only ID) returns 400', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: 'Todo No Update'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const patchData: TodoPatch = {
            id: todoId
        };

        const response = await todoApiPage.patchTodo(patchData);
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, STATUS_CODES.BAD_REQUEST);
        await todoApiPage.verifySuccessField(responseBody, false);
    });
});
