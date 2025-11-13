import { test, BaseTest } from '../base-test';
import { STATUS_CODES } from '../../constants/test-constants';
import { CreateTodoRequest } from '../../interfaces/todo.schema';

test.describe('Todo API - POST Methods', () => {
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

    test.describe('Happy Path', () => {
        test('TC007 - POST create todo with all required fields', async ({ todoApiPage }) => {
        // Get test data
        const todoData: CreateTodoRequest = testData.validTodoData.minimalTodo;

        // Create a new todo with only required fields
        const response = await todoApiPage.createTodo(todoData);
        const responseBody = await todoApiPage.getResponseBody(response);

        // Verify status code
        await todoApiPage.verifyStatusCode(response, STATUS_CODES.CREATED);

        // Verify response
        await todoApiPage.verifySuccessField(responseBody, true);
        await todoApiPage.verifyHasProperty(responseBody, 'todo');
        await todoApiPage.verifyHasProperty(responseBody.todo, 'id');
        await todoApiPage.verifyTodoTitle(responseBody, todoData.title);
        await todoApiPage.verifyHasProperty(responseBody.todo, 'created_at');
        await todoApiPage.verifyHasProperty(responseBody.todo, 'updated_at');

        // Confirm state by GET - verify todo was actually created
        const getResponse = await todoApiPage.getTodoById(responseBody.todo.id);
        const getTodo = await todoApiPage.getResponseBody(getResponse);
        await todoApiPage.verifyStatusCode(getResponse, STATUS_CODES.OK);
        await todoApiPage.verifyTodoTitle(getTodo, todoData.title);
    });

    test('TC008 - POST create todo with all fields', async ({ todoApiPage }) => {
        // Get test data
        const todoData: CreateTodoRequest = testData.validTodoData.completeTodo;

        // Create a new todo with all fields
        const response = await todoApiPage.createTodo(todoData);
        const responseBody = await todoApiPage.getResponseBody(response);

        // Verify status code
        await todoApiPage.verifyStatusCode(response, STATUS_CODES.CREATED);

        // Verify all fields
        await todoApiPage.verifySuccessField(responseBody, true);
        await todoApiPage.verifyTodoTitle(responseBody, todoData.title);
        await todoApiPage.verifyTodoDescription(responseBody, todoData.description!);
        await todoApiPage.verifyTodoStatus(responseBody, todoData.status!);
        await todoApiPage.verifyTodoPriority(responseBody, todoData.priority!);
        await todoApiPage.verifyTodoUserId(responseBody, todoData.user_id!);

        // Confirm state by GET - verify all fields persisted correctly
        const getResponse = await todoApiPage.getTodoById(responseBody.todo.id);
        const getTodo = await todoApiPage.getResponseBody(getResponse);
        await todoApiPage.verifyStatusCode(getResponse, STATUS_CODES.OK);
        await todoApiPage.verifyTodoDescription(getTodo, todoData.description!);
        await todoApiPage.verifyTodoStatus(getTodo, todoData.status!);
        await todoApiPage.verifyTodoPriority(getTodo, todoData.priority!);
    });

    test('TC009 - POST create todo with default values', async ({ todoApiPage }) => {
        // Get test data
        const todoData: CreateTodoRequest = testData.validTodoData.todoWithDefaults;

        // Create todo with only title (should use defaults)
        const response = await todoApiPage.createTodo(todoData);
        const responseBody = await todoApiPage.getResponseBody(response);

        // Verify status code
        await todoApiPage.verifyStatusCode(response, STATUS_CODES.CREATED);

        // Verify default values
        await todoApiPage.verifyTodoStatus(responseBody, testData.expectedResponses.defaultValues.status);
        await todoApiPage.verifyTodoPriority(responseBody, testData.expectedResponses.defaultValues.priority);
        await todoApiPage.verifyTodoUserId(responseBody, testData.expectedResponses.defaultValues.user_id);
    });

        test('TC011 - POST reset database successfully', async ({ todoApiPage }) => {
            // Create some todos
            await todoApiPage.createTodo(testData.sampleTodos.todo1);
            await todoApiPage.createTodo(testData.sampleTodos.todo2);

            // Reset database
            const response = await todoApiPage.resetDatabase();
            const responseBody = await todoApiPage.getResponseBody(response);

            // Verify status code
            await todoApiPage.verifyStatusCode(response, STATUS_CODES.OK);

            // Verify response
            await todoApiPage.verifySuccessField(responseBody, true);
            await todoApiPage.verifyHasProperty(responseBody, 'reset');
            await todoApiPage.verifyHasProperty(responseBody.reset, 'message');
            await todoApiPage.verifyHasProperty(responseBody.reset, 'sample_data');

            // Verify sample data counts
            await todoApiPage.verifyResetSampleData(responseBody);
        });
    });

    test.describe('Error Cases', () => {
        test('TC010 - POST create todo without title returns 400', async ({ todoApiPage }) => {
        const todoData: CreateTodoRequest = testData.invalidTodoData.todoWithoutTitle;

        const response = await todoApiPage.createTodo(todoData);
        const responseBody = await todoApiPage.getResponseBody(response);

        // Verify error response
        await todoApiPage.verifyStatusCode(response, STATUS_CODES.BAD_REQUEST);
        await todoApiPage.verifySuccessField(responseBody, false);
        });
    });
});
