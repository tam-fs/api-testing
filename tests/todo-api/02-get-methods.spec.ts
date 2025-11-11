import { test } from '../base-test';
import { STATUS_CODES, TEST_IDS } from '../../constants/test-constants';

test.describe('Todo API - GET Methods', () => {
    test.beforeEach(async ({ todoApiPage }) => {
        // Reset database before each test to ensure clean state
        const resetResponse = await todoApiPage.resetDatabase();
        const resetBody = await todoApiPage.getResponseBody(resetResponse);
        await todoApiPage.verifySuccessField(resetBody, true);
    });

    test('TC004 - GET all todos successfully', async ({ todoApiPage }) => {
        // Get all todos
        const response = await todoApiPage.getAllTodos();
        const responseBody = await todoApiPage.getResponseBody(response);

        // Verify status code
        await todoApiPage.verifyStatusCode(response, STATUS_CODES.OK);

        // Verify response
        await todoApiPage.verifySuccessField(responseBody, true);
        await todoApiPage.verifyIsArray(responseBody.todos);
        await todoApiPage.verifyArrayLengthGreaterThan(responseBody.todos, 0);

        // Verify todos are ordered by creation date (newest first)
        await todoApiPage.verifyTodosOrderedByDate(responseBody.todos);
    });

    test('TC005 - GET single todo by valid ID', async ({ todoApiPage }) => {
        // First, get all todos to get a valid ID
        const allTodosResponse = await todoApiPage.getAllTodos();
        const allTodosBody = await todoApiPage.getResponseBody(allTodosResponse);
        const validId = allTodosBody.todos[0].id;

        // Get single todo by ID
        const response = await todoApiPage.getTodoById(validId);
        const responseBody = await todoApiPage.getResponseBody(response);

        // Verify status code
        await todoApiPage.verifyStatusCode(response, STATUS_CODES.OK);

        // Verify response
        await todoApiPage.verifySuccessField(responseBody, true);
        await todoApiPage.verifyHasProperty(responseBody, 'todo');
        await todoApiPage.verifyTodoId(responseBody, validId);
        await todoApiPage.verifyHasProperty(responseBody.todo, 'title');
        await todoApiPage.verifyHasProperty(responseBody.todo, 'status');
        await todoApiPage.verifyHasProperty(responseBody.todo, 'priority');
    });

    test('TC006 - GET single todo by invalid ID returns 404', async ({ todoApiPage }) => {
        // Try to get a non-existent todo
        const response = await todoApiPage.getTodoById(TEST_IDS.NON_EXISTENT_ID);
        const responseBody = await todoApiPage.getResponseBody(response);

        // Verify status code
        await todoApiPage.verifyStatusCode(response, STATUS_CODES.NOT_FOUND);

        // Verify error response
        await todoApiPage.verifySuccessField(responseBody, false);
        await todoApiPage.verifyHasProperty(responseBody, 'message');
    });
});
