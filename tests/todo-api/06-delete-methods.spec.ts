import { test, BaseTest } from '../base-test';
import { STATUS_CODES, TEST_IDS } from '../../constants/test-constants';

test.describe('Todo API - DELETE Methods', () => {
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

    test.describe('Happy Path', () => {
        test('TC020 - DELETE todo successfully', async ({ todoApiPage }) => {
        const todoToDelete = testData.validTodoData.todoToDelete;

        const createResponse = await todoApiPage.createTodo(todoToDelete);
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const response = await todoApiPage.deleteTodo(todoId);
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, STATUS_CODES.OK);
        await todoApiPage.verifySuccessField(responseBody, true);
        await todoApiPage.verifyHasProperty(responseBody, 'deleted');
        await todoApiPage.verifyHasProperty(responseBody.deleted, 'id');
        await todoApiPage.verifyHasProperty(responseBody.deleted, 'message');
        await todoApiPage.verifyDeletedTodoId(responseBody, todoId);

        // Confirm state by GET - verify todo was actually deleted
        const getResponse = await todoApiPage.getTodoById(todoId);
        const getBody = await todoApiPage.getResponseBody(getResponse);
        await todoApiPage.verifyStatusCode(getResponse, STATUS_CODES.NOT_FOUND);
        await todoApiPage.verifySuccessField(getBody, false);
    });

    test('TC021 - DELETE todo and verify it is removed', async ({ todoApiPage }) => {
        const todoToRemove = testData.validTodoData.todoToRemove;

        const createResponse = await todoApiPage.createTodo(todoToRemove);
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        await todoApiPage.deleteTodo(todoId);

        const getResponse = await todoApiPage.getTodoById(todoId);
        const getBody = await todoApiPage.getResponseBody(getResponse);

        await todoApiPage.verifyStatusCode(getResponse, STATUS_CODES.NOT_FOUND);
        await todoApiPage.verifySuccessField(getBody, false);
        });
    });

    test.describe('Error Cases', () => {
        test('TC022 - DELETE non-existent todo returns 404', async ({ todoApiPage }) => {
        const response = await todoApiPage.deleteTodo(TEST_IDS.NON_EXISTENT_ID);
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, STATUS_CODES.NOT_FOUND);
        await todoApiPage.verifySuccessField(responseBody, false);
    });

    test('TC023 - DELETE same todo twice returns 404 on second attempt', async ({ todoApiPage }) => {
        const todoDoubleDelete = testData.validTodoData.todoDoubleDelete;

        const createResponse = await todoApiPage.createTodo(todoDoubleDelete);
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const firstDelete = await todoApiPage.deleteTodo(todoId);
        await todoApiPage.verifyStatusCode(firstDelete, STATUS_CODES.OK);

        const secondDelete = await todoApiPage.deleteTodo(todoId);
        const secondDeleteBody = await todoApiPage.getResponseBody(secondDelete);

        await todoApiPage.verifyStatusCode(secondDelete, STATUS_CODES.NOT_FOUND);
        await todoApiPage.verifySuccessField(secondDeleteBody, false);
        });
    });
});
