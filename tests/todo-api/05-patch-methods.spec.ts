import { test, BaseTest } from '../base-test';
import { STATUS_CODES, TEST_IDS } from '../../constants/test-constants';
import { CreateTodoRequest, PatchTodoRequest, Status } from '../../interfaces/todo.schema';

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

    test.describe('Happy Path', () => {
        test('TC016 - PATCH update only todo title', async ({ todoApiPage }) => {
        const originalTodo: CreateTodoRequest = testData.validTodoData.todoForPatch;

        const createResponse = await todoApiPage.createTodo(originalTodo);
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const patchTitleData = testData.validTodoData.patchedTitle;
        const patchData: PatchTodoRequest = {
            id: todoId,
            title: patchTitleData.title
        };

        const response = await todoApiPage.patchTodo(patchData);
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, STATUS_CODES.OK);
        await todoApiPage.verifySuccessField(responseBody, true);
        await todoApiPage.verifyTodoTitle(responseBody, patchTitleData.title);
        await todoApiPage.verifyTodoDescription(responseBody, originalTodo.description!);
        await todoApiPage.verifyTodoStatus(responseBody, originalTodo.status!);
        await todoApiPage.verifyTodoPriority(responseBody, originalTodo.priority!);

        // Confirm state by GET - verify only title changed
        const getResponse = await todoApiPage.getTodoById(todoId);
        const getTodo = await todoApiPage.getResponseBody(getResponse);
        await todoApiPage.verifyStatusCode(getResponse, STATUS_CODES.OK);
        await todoApiPage.verifyTodoTitle(getTodo, patchTitleData.title);
        await todoApiPage.verifyTodoDescription(getTodo, originalTodo.description!);
    });

    test('TC017 - PATCH update only todo status', async ({ todoApiPage }) => {
        const originalTodo: CreateTodoRequest = testData.validTodoData.todoStatusPatch;

        const createResponse = await todoApiPage.createTodo(originalTodo);
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const statusUpdate = testData.validTodoData.statusUpdateToInProgress;
        const patchData: PatchTodoRequest = {
            id: todoId,
            status: Status.IN_PROGRESS
        };

        const response = await todoApiPage.patchTodo(patchData);
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, STATUS_CODES.OK);
        await todoApiPage.verifyTodoStatus(responseBody, statusUpdate.status);
        await todoApiPage.verifyTodoTitle(responseBody, originalTodo.title);
        await todoApiPage.verifyTodoDescription(responseBody, originalTodo.description!);
        await todoApiPage.verifyTodoPriority(responseBody, originalTodo.priority!);

        // Confirm state by GET - verify only status changed
        const getResponse = await todoApiPage.getTodoById(todoId);
        const getTodo = await todoApiPage.getResponseBody(getResponse);
        await todoApiPage.verifyStatusCode(getResponse, STATUS_CODES.OK);
        await todoApiPage.verifyTodoStatus(getTodo, statusUpdate.status);
        await todoApiPage.verifyTodoTitle(getTodo, originalTodo.title);
        });
    });

    test.describe('Error Cases', () => {
        test('TC018 - PATCH non-existent todo returns 404', async ({ todoApiPage }) => {
        const patchTitleData = testData.validTodoData.patchedTitle;
        const patchData: PatchTodoRequest = {
            id: TEST_IDS.NON_EXISTENT_ID,
            title: patchTitleData.title
        };

        const response = await todoApiPage.patchTodo(patchData);
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, STATUS_CODES.NOT_FOUND);
        await todoApiPage.verifySuccessField(responseBody, false);
    });

    test('TC019 - PATCH with no fields to update (only ID) returns 400', async ({ todoApiPage }) => {
        const todoToCreate = testData.validTodoData.todoToUpdate;
        const createResponse = await todoApiPage.createTodo({
            title: todoToCreate.title
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const patchData: PatchTodoRequest = {
            id: todoId
        };

        const response = await todoApiPage.patchTodo(patchData);
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, STATUS_CODES.BAD_REQUEST);
        await todoApiPage.verifySuccessField(responseBody, false);
        });
    });
});
