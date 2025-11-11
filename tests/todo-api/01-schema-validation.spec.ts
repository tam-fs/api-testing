import { test, BaseTest } from '../base-test';
import { STATUS_CODES, TEST_IDS } from '../../constants/test-constants';
import { TodoInput } from '../../interfaces/todo.interface';

test.describe('Todo API - Schema Validation', () => {
    const baseTest = new BaseTest();
    let testData: any;

    test.beforeAll(async () => {
        // Load test data from JSON file
        testData = baseTest.loadDataInfo('todo-test-data.json');
    });

    test.beforeEach(async ({ todoApiPage }) => {
        // Reset database before each test to ensure clean state
        const resetResponse = await todoApiPage.resetDatabase();
        const resetBody = await todoApiPage.getResponseBody(resetResponse);
        await todoApiPage.verifySuccessField(resetBody, true);
    });

    test('TC001 - Verify schema of GET all todos response', async ({ todoApiPage }) => {
        // Get all todos
        const response = await todoApiPage.getAllTodos();
        const responseBody = await todoApiPage.getResponseBody(response);

        // Verify status code
        await todoApiPage.verifyStatusCode(response, STATUS_CODES.OK);

        // Verify schema
        await todoApiPage.verifyGetAllTodosSchema(responseBody);

        // Verify success field and structure
        await todoApiPage.verifySuccessField(responseBody, true);
        await todoApiPage.verifyHasProperty(responseBody, 'todos');
        await todoApiPage.verifyIsArray(responseBody.todos);
    });

    test('TC002 - Verify schema of POST create todo response', async ({ todoApiPage }) => {
        // Create a new todo using test data from JSON
        const todoData: TodoInput = testData.validTodoData.todoForGetVerification;
        const response = await todoApiPage.createTodo(todoData);
        const responseBody = await todoApiPage.getResponseBody(response);

        // Verify status code
        await todoApiPage.verifyStatusCode(response, STATUS_CODES.CREATED);

        // Verify schema
        await todoApiPage.verifyCreateOrUpdateTodoSchema(responseBody);

        // Verify response structure
        await todoApiPage.verifySuccessField(responseBody, true);
        await todoApiPage.verifyHasProperty(responseBody, 'todo');
        await todoApiPage.verifyHasProperty(responseBody.todo, 'id');
        await todoApiPage.verifyHasProperty(responseBody.todo, 'title');
    });

    test('TC003 - Verify schema of error response (404 Not Found)', async ({ todoApiPage }) => {
        // Try to get a non-existent todo
        const response = await todoApiPage.getTodoById(TEST_IDS.NON_EXISTENT_ID);
        const responseBody = await todoApiPage.getResponseBody(response);

        // Verify status code
        await todoApiPage.verifyStatusCode(response, STATUS_CODES.NOT_FOUND);

        // Verify error schema
        await todoApiPage.verifyErrorResponseSchema(responseBody);

        // Verify error response structure
        await todoApiPage.verifySuccessField(responseBody, false);
    });
});
