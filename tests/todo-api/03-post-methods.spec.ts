import { test, BaseTest } from '../base-test';
import { CreateTodoRequest, CreateTodoResponse } from '../../types/todo.types';

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

    test('TC018 - POST create todo with all required fields', async ({ todoApiPage }) => {
        // Get test data
        const todoData: CreateTodoRequest = testData.validTodoData.minimalTodo;

        // Create a new todo with only required fields
        const response = await todoApiPage.createTodo(todoData);
        const responseBody: CreateTodoResponse = await todoApiPage.getResponseBody(response);

        // Verify status code
        await todoApiPage.verifyStatusCode(response, testData.expectedResponses.statusCodes.created);

        // Verify response
        await todoApiPage.verifySuccessField(responseBody, true);
        await todoApiPage.verifyHasProperty(responseBody, 'todo');
        await todoApiPage.verifyHasProperty(responseBody.todo, 'id');
        await todoApiPage.verifyTodoTitle(responseBody, todoData.title);
        await todoApiPage.verifyHasProperty(responseBody.todo, 'created_at');
        await todoApiPage.verifyHasProperty(responseBody.todo, 'updated_at');
    });

    test('TC019 - POST create todo with all fields', async ({ todoApiPage }) => {
        // Get test data
        const todoData: CreateTodoRequest = testData.validTodoData.completeTodo;

        // Create a new todo with all fields
        const response = await todoApiPage.createTodo(todoData);
        const responseBody: CreateTodoResponse = await todoApiPage.getResponseBody(response);

        // Verify status code
        await todoApiPage.verifyStatusCode(response, testData.expectedResponses.statusCodes.created);

        // Verify all fields
        await todoApiPage.verifySuccessField(responseBody, true);
        await todoApiPage.verifyTodoTitle(responseBody, todoData.title);
        await todoApiPage.verifyTodoDescription(responseBody, todoData.description!);
        await todoApiPage.verifyTodoStatus(responseBody, todoData.status!);
        await todoApiPage.verifyTodoPriority(responseBody, todoData.priority!);
        await todoApiPage.verifyTodoUserId(responseBody, todoData.user_id!);
    });

    test('TC020 - POST create todo with default values', async ({ todoApiPage }) => {
        // Get test data
        const todoData: CreateTodoRequest = testData.validTodoData.todoWithDefaults;

        // Create todo with only title (should use defaults)
        const response = await todoApiPage.createTodo(todoData);
        const responseBody: CreateTodoResponse = await todoApiPage.getResponseBody(response);

        // Verify status code
        await todoApiPage.verifyStatusCode(response, testData.expectedResponses.statusCodes.created);

        // Verify default values
        await todoApiPage.verifyTodoStatus(responseBody, testData.expectedResponses.defaultValues.status);
        await todoApiPage.verifyTodoPriority(responseBody, testData.expectedResponses.defaultValues.priority);
        await todoApiPage.verifyTodoUserId(responseBody, testData.expectedResponses.defaultValues.user_id);
    });

    test('TC021 - POST create todo with status: pending', async ({ todoApiPage }) => {
        const todoData: CreateTodoRequest = testData.validTodoData.pendingTodo;

        const response = await todoApiPage.createTodo(todoData);
        const responseBody: CreateTodoResponse = await todoApiPage.getResponseBody(response);

        // Verify
        await todoApiPage.verifyStatusCode(response, testData.expectedResponses.statusCodes.created);
        await todoApiPage.verifyTodoStatus(responseBody, todoData.status!);
    });

    test('TC022 - POST create todo with status: in_progress', async ({ todoApiPage }) => {
        const todoData: CreateTodoRequest = testData.validTodoData.inProgressTodo;

        const response = await todoApiPage.createTodo(todoData);
        const responseBody: CreateTodoResponse = await todoApiPage.getResponseBody(response);

        // Verify
        await todoApiPage.verifyStatusCode(response, testData.expectedResponses.statusCodes.created);
        await todoApiPage.verifyTodoStatus(responseBody, todoData.status!);
    });

    test('TC023 - POST create todo with status: completed', async ({ todoApiPage }) => {
        const todoData: CreateTodoRequest = testData.validTodoData.completedTodo;

        const response = await todoApiPage.createTodo(todoData);
        const responseBody: CreateTodoResponse = await todoApiPage.getResponseBody(response);

        // Verify
        await todoApiPage.verifyStatusCode(response, testData.expectedResponses.statusCodes.created);
        await todoApiPage.verifyTodoStatus(responseBody, todoData.status!);
    });

    test('TC024 - POST create todo with priority: low', async ({ todoApiPage }) => {
        const todoData: CreateTodoRequest = testData.validTodoData.lowPriorityTodo;

        const response = await todoApiPage.createTodo(todoData);
        const responseBody: CreateTodoResponse = await todoApiPage.getResponseBody(response);

        // Verify
        await todoApiPage.verifyStatusCode(response, testData.expectedResponses.statusCodes.created);
        await todoApiPage.verifyTodoPriority(responseBody, todoData.priority!);
    });

    test('TC025 - POST create todo with priority: medium', async ({ todoApiPage }) => {
        const todoData: CreateTodoRequest = testData.validTodoData.mediumPriorityTodo;

        const response = await todoApiPage.createTodo(todoData);
        const responseBody: CreateTodoResponse = await todoApiPage.getResponseBody(response);

        // Verify
        await todoApiPage.verifyStatusCode(response, testData.expectedResponses.statusCodes.created);
        await todoApiPage.verifyTodoPriority(responseBody, todoData.priority!);
    });

    test('TC026 - POST create todo with priority: high', async ({ todoApiPage }) => {
        const todoData: CreateTodoRequest = testData.validTodoData.highPriorityTodo;

        const response = await todoApiPage.createTodo(todoData);
        const responseBody: CreateTodoResponse = await todoApiPage.getResponseBody(response);

        // Verify
        await todoApiPage.verifyStatusCode(response, testData.expectedResponses.statusCodes.created);
        await todoApiPage.verifyTodoPriority(responseBody, todoData.priority!);
    });

    test('TC027 - POST create todo with due_date', async ({ todoApiPage }) => {
        const todoData: CreateTodoRequest = testData.validTodoData.todoWithDueDate;

        const response = await todoApiPage.createTodo(todoData);
        const responseBody: CreateTodoResponse = await todoApiPage.getResponseBody(response);

        // Verify
        await todoApiPage.verifyStatusCode(response, testData.expectedResponses.statusCodes.created);
        await todoApiPage.verifyHasProperty(responseBody.todo, 'due_date');
    });

    test('TC028 - POST create todo with description', async ({ todoApiPage }) => {
        const todoData: CreateTodoRequest = testData.validTodoData.todoWithDescription;

        const response = await todoApiPage.createTodo(todoData);
        const responseBody: CreateTodoResponse = await todoApiPage.getResponseBody(response);

        // Verify
        await todoApiPage.verifyStatusCode(response, testData.expectedResponses.statusCodes.created);
        await todoApiPage.verifyTodoDescription(responseBody, todoData.description!);
    });

    test('TC029 - POST create todo without title returns 400', async ({ todoApiPage }) => {
        const todoData: CreateTodoRequest = testData.invalidTodoData.todoWithoutTitle;

        const response = await todoApiPage.createTodo(todoData);
        const responseBody = await todoApiPage.getResponseBody(response);

        // Verify error response
        await todoApiPage.verifyStatusCode(response, testData.expectedResponses.statusCodes.badRequest);
        await todoApiPage.verifySuccessField(responseBody, false);
    });

    test('TC030 - POST create multiple todos', async ({ todoApiPage }) => {
        const todoData1: CreateTodoRequest = testData.validTodoData.firstMultipleTodo;
        const todoData2: CreateTodoRequest = testData.validTodoData.secondMultipleTodo;

        // Create first todo
        const response1 = await todoApiPage.createTodo(todoData1);
        const body1: CreateTodoResponse = await todoApiPage.getResponseBody(response1);

        // Create second todo
        const response2 = await todoApiPage.createTodo(todoData2);
        const body2: CreateTodoResponse = await todoApiPage.getResponseBody(response2);

        // Verify both created successfully
        await todoApiPage.verifyStatusCode(response1, testData.expectedResponses.statusCodes.created);
        await todoApiPage.verifyStatusCode(response2, testData.expectedResponses.statusCodes.created);
        await todoApiPage.verifyFieldNotEquals(body1.todo.id, body2.todo.id, 'id');
        await todoApiPage.verifyFieldEquals(body1.todo.title, todoData1.title, 'title');
        await todoApiPage.verifyFieldEquals(body2.todo.title, todoData2.title, 'title');
    });

    test('TC031 - POST reset database successfully', async ({ todoApiPage }) => {
        // Create some todos
        await todoApiPage.createTodo(testData.sampleTodos.todo1);
        await todoApiPage.createTodo(testData.sampleTodos.todo2);

        // Reset database
        const response = await todoApiPage.resetDatabase();
        const responseBody = await todoApiPage.getResponseBody(response);

        // Verify status code
        await todoApiPage.verifyStatusCode(response, testData.expectedResponses.statusCodes.success);

        // Verify response
        await todoApiPage.verifySuccessField(responseBody, true);
        await todoApiPage.verifyHasProperty(responseBody, 'reset');
        await todoApiPage.verifyHasProperty(responseBody.reset, 'message');
        await todoApiPage.verifyHasProperty(responseBody.reset, 'sample_data');

        // Verify sample data counts
        await todoApiPage.verifyResetSampleData(responseBody);
    });

    test('TC032 - POST reset database restores sample data', async ({ todoApiPage }) => {
        // Reset database
        await todoApiPage.resetDatabase();

        // Get all todos
        const response = await todoApiPage.getAllTodos();
        const responseBody = await todoApiPage.getResponseBody(response);

        // Verify sample data exists
        await todoApiPage.verifySuccessField(responseBody, true);
        await todoApiPage.verifyArrayLengthGreaterThan(responseBody.todos, testData.expectedResponses.resetDatabase.minTodos);
    });

    test('TC033 - POST create todo and verify it appears in GET all todos', async ({ todoApiPage }) => {
        const todoData: CreateTodoRequest = {
            ...testData.validTodoData.todoForGetVerification,
            title: `${testData.validTodoData.todoForGetVerification.title} ${Date.now()}`
        };

        // Create todo
        const createResponse = await todoApiPage.createTodo(todoData);
        const createBody: CreateTodoResponse = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        // Get all todos
        const getResponse = await todoApiPage.getAllTodos();
        const getBody = await todoApiPage.getResponseBody(getResponse);

        // Verify new todo exists in list
        const foundTodo = getBody.todos.find((todo: any) => todo.id === todoId);
        await todoApiPage.verifyFoundTodoDetails(foundTodo, todoData.title, todoData.status, todoData.priority);
    });
});
