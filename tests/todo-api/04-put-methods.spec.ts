import { test, BaseTest } from '../base-test';
import { STATUS_CODES, TEST_IDS } from '../../constants/test-constants';
import { CreateTodoRequest, UpdateTodoRequest, Status } from '../../interfaces/todo.schema';

test.describe('Todo API - PUT Methods', () => {
    const baseTest = new BaseTest();
    let testData: any;
    let createdTodoIds: number[] = [];

    test.beforeAll(async () => {
        testData = baseTest.loadDataInfo('todo-test-data.json');
    });

    test.beforeEach(async ({ todoApiPage }) => {
        const resetResponse = await todoApiPage.resetDatabase();
        const resetBody = await todoApiPage.getResponseBody(resetResponse);
        await todoApiPage.verifySuccessField(resetBody, true);
        createdTodoIds = [];
    });

    test.afterEach(async ({ todoApiPage }) => {
        // Clean up only todos created during the test
        for (const id of createdTodoIds) {
            try {
                await todoApiPage.deleteTodo(id);
            } catch (error) {
                // Ignore errors if todo was already deleted during test
            }
        }
        createdTodoIds = [];
    });

    test.describe('Happy Path', () => {
        test('TC012 - PUT update todo with all fields', async ({ todoApiPage }) => {
        const originalTodo: CreateTodoRequest = testData.validTodoData.originalTodoForUpdate;

        const createResponse = await todoApiPage.createTodo(originalTodo);
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;
        createdTodoIds.push(todoId);

        const updatedTodoData = testData.validTodoData.updatedTodo;
        const updatedTodo: UpdateTodoRequest = {
            id: todoId,
            ...updatedTodoData
        };

        const response = await todoApiPage.updateTodo(updatedTodo);
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, STATUS_CODES.OK);
        await todoApiPage.verifySuccessField(responseBody, true);
        await todoApiPage.verifyTodoId(responseBody, todoId);
        await todoApiPage.verifyTodoTitle(responseBody, updatedTodoData.title);
        await todoApiPage.verifyTodoDescription(responseBody, updatedTodoData.description);
        await todoApiPage.verifyTodoStatus(responseBody, updatedTodoData.status);
        await todoApiPage.verifyTodoPriority(responseBody, updatedTodoData.priority);

        // Confirm state by GET - verify update was persisted
        const getResponse = await todoApiPage.getTodoById(todoId);
        const getTodo = await todoApiPage.getResponseBody(getResponse);
        await todoApiPage.verifyStatusCode(getResponse, STATUS_CODES.OK);
        await todoApiPage.verifyTodoTitle(getTodo, updatedTodoData.title);
        await todoApiPage.verifyTodoDescription(getTodo, updatedTodoData.description);
        await todoApiPage.verifyTodoStatus(getTodo, updatedTodoData.status);
    });

    test('TC013 - PUT update todo status from pending to in_progress', async ({ todoApiPage }) => {
        const originalTodo: CreateTodoRequest = testData.validTodoData.todoToUpdate;

        const createResponse = await todoApiPage.createTodo(originalTodo);
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;
        createdTodoIds.push(todoId);

        const statusUpdate = testData.validTodoData.statusUpdateToInProgress;
        const updatedTodo: UpdateTodoRequest = {
            id: todoId,
            title: originalTodo.title,
            status: Status.IN_PROGRESS,
            priority: originalTodo.priority
        };

        const response = await todoApiPage.updateTodo(updatedTodo);
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, STATUS_CODES.OK);
        await todoApiPage.verifyTodoStatus(responseBody, statusUpdate.status);

        // Confirm state by GET - verify status change persisted
        const getResponse = await todoApiPage.getTodoById(todoId);
        const getTodo = await todoApiPage.getResponseBody(getResponse);
        await todoApiPage.verifyStatusCode(getResponse, STATUS_CODES.OK);
        await todoApiPage.verifyTodoStatus(getTodo, statusUpdate.status);
        });
    });

    test.describe('Error Cases', () => {
        test('TC014 - PUT update non-existent todo returns 404', async ({ todoApiPage }) => {
        const todoToUpdate = testData.validTodoData.todoToUpdate;
        const updateData: UpdateTodoRequest = {
            id: TEST_IDS.NON_EXISTENT_ID,
            title: todoToUpdate.title,
            status: Status.PENDING,
            priority: todoToUpdate.priority
        };

        const response = await todoApiPage.updateTodo(updateData);
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, STATUS_CODES.NOT_FOUND);
        await todoApiPage.verifySuccessField(responseBody, false);
    });

    test('TC015 - PUT update todo without title returns 400', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: testData.validTodoData.todoToUpdate.title
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;
        createdTodoIds.push(todoId);

        const invalidUpdate: UpdateTodoRequest = {
            id: todoId,
            title: testData.invalidTodoData.emptyTitle.title as any
        };

        const response = await todoApiPage.updateTodo(invalidUpdate);
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, STATUS_CODES.BAD_REQUEST);
        await todoApiPage.verifySuccessField(responseBody, false);
        });
    });
});
