import { test, BaseTest } from '../base-test';
import { STATUS_CODES, TEST_IDS } from '../../constants/test-constants';
import { CreateTodoRequest } from '../../interfaces/todo.schema';

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

    test.describe('Happy Path', () => {
        test('TC001 - Verify schema of GET all todos response', async ({ todoApiPage }) => {
        console.log('\n=== TC001: VERIFY SCHEMA OF GET ALL TODOS RESPONSE ===');

        // Get all todos
        console.log('\n🔄 Sending GET request to retrieve all todos...');
        const response = await todoApiPage.getAllTodos();
        const responseBody = await todoApiPage.getResponseBody(response);
        console.log('✅ Response received:', JSON.stringify(responseBody, null, 2));
        console.log('📊 Status Code:', response.status());

        // Verify status code
        console.log('\n🔍 Verifying status code is 200 (OK)...');
        await todoApiPage.verifyStatusCode(response, STATUS_CODES.OK);

        // Verify schema
        console.log('\n🔍 Verifying GET all todos response schema...');
        await todoApiPage.verifyGetAllTodosSchema(responseBody);
        console.log('  ✅ Schema validation passed');

        // Verify success field and structure
        console.log('\n🔍 Verifying response structure...');
        console.log('  - Checking success field is true');
        await todoApiPage.verifySuccessField(responseBody, true);
        console.log('  - Checking response has "todos" property');
        await todoApiPage.verifyHasProperty(responseBody, 'todos');
        console.log('  - Checking "todos" is an array');
        await todoApiPage.verifyIsArray(responseBody.todos);

        console.log('\n✅ TC001 PASSED - GET all todos schema validation successful');
    });

    test('TC002 - Verify schema of POST create todo response', async ({ todoApiPage }) => {
        console.log('\n=== TC002: VERIFY SCHEMA OF POST CREATE TODO RESPONSE ===');

        // Create a new todo using test data from JSON
        const todoData: CreateTodoRequest = testData.validTodoData.todoForGetVerification;
        console.log('📋 Test Data:', JSON.stringify(todoData, null, 2));

        console.log('\n🔄 Sending POST request to create todo...');
        const response = await todoApiPage.createTodo(todoData);
        const responseBody = await todoApiPage.getResponseBody(response);
        console.log('✅ Response received:', JSON.stringify(responseBody, null, 2));
        console.log('📊 Status Code:', response.status());

        // Verify status code
        console.log('\n🔍 Verifying status code is 201 (CREATED)...');
        await todoApiPage.verifyStatusCode(response, STATUS_CODES.CREATED);

        // Verify schema
        console.log('\n🔍 Verifying POST create todo response schema...');
        await todoApiPage.verifyCreateOrUpdateTodoSchema(responseBody);
        console.log('  ✅ Schema validation passed');

        // Verify response structure
        console.log('\n🔍 Verifying response structure...');
        console.log('  - Checking success field is true');
        await todoApiPage.verifySuccessField(responseBody, true);
        console.log('  - Checking response has "todo" property');
        await todoApiPage.verifyHasProperty(responseBody, 'todo');
        console.log('  - Checking todo has "id" property');
        await todoApiPage.verifyHasProperty(responseBody.todo, 'id');
        console.log('  - Checking todo has "title" property');
        await todoApiPage.verifyHasProperty(responseBody.todo, 'title');

        console.log('\n✅ TC002 PASSED - POST create todo schema validation successful');
        });
    });

    test.describe('Error Cases', () => {
        test('TC003 - Verify schema of error response (404 Not Found)', async ({ todoApiPage }) => {
        console.log('\n=== TC003: VERIFY SCHEMA OF ERROR RESPONSE (404 NOT FOUND) ===');

        // Try to get a non-existent todo
        console.log(`\n🔄 Sending GET request for non-existent todo (ID: ${TEST_IDS.NON_EXISTENT_ID})...`);
        const response = await todoApiPage.getTodoById(TEST_IDS.NON_EXISTENT_ID);
        const responseBody = await todoApiPage.getResponseBody(response);
        console.log('✅ Error response received:', JSON.stringify(responseBody, null, 2));
        console.log('📊 Status Code:', response.status());

        // Verify status code
        console.log('\n🔍 Verifying status code is 404 (NOT FOUND)...');
        await todoApiPage.verifyStatusCode(response, STATUS_CODES.NOT_FOUND);

        // Verify error schema
        console.log('\n🔍 Verifying error response schema...');
        await todoApiPage.verifyErrorResponseSchema(responseBody);
        console.log('  ✅ Error schema validation passed');

        // Verify error response structure
        console.log('\n🔍 Verifying error response structure...');
        console.log('  - Checking success field is false');
        await todoApiPage.verifySuccessField(responseBody, false);
        console.log('  - Error message:', responseBody.error || responseBody.message || 'No error message');

        console.log('\n✅ TC003 PASSED - Error response schema validation successful');
        });
    });
});
