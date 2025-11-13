import { test, BaseTest } from '../base-test';
import { STATUS_CODES } from '../../constants/test-constants';
import { CreateTodoRequest } from '../../interfaces/todo.schema';

test.describe('Todo API - POST Methods', () => {
    const baseTest = new BaseTest();
    let testData: any;
    let commonData: any;

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
        console.log('\n=== TC007: CREATE TODO WITH REQUIRED FIELDS ===');

        // Get test data
        const todoData: CreateTodoRequest = testData.validTodoData.minimalTodo;
        console.log('📋 Test Data (minimal todo):', JSON.stringify(todoData, null, 2));

        // Create a new todo with only required fields
        console.log('\n🔄 Sending POST request to create todo...');
        const response = await todoApiPage.createTodo(todoData);
        const responseBody = await todoApiPage.getResponseBody(response);
        console.log('✅ Response received:', JSON.stringify(responseBody, null, 2));
        console.log('📊 Status Code:', response.status());

        // Verify status code
        console.log('\n🔍 Verifying status code is 201 (CREATED)...');
        await todoApiPage.verifyStatusCode(response, STATUS_CODES.CREATED);

        // Verify response schema (replaces manual field checks)
        console.log('\n🔍 Verifying response schema...');
        await todoApiPage.verifyCreateOrUpdateTodoSchema(responseBody);
        console.log('  ✅ Schema validation passed (includes success, todo, id, created_at, updated_at)');

        // Verify specific field values
        console.log('\n🔍 Verifying specific field values...');
        console.log('  - Verifying title matches:', todoData.title);
        await todoApiPage.verifyTodoTitle(responseBody, todoData.title);

        // Confirm state by GET - verify todo was actually created
        console.log('\n🔄 Confirming todo creation by GET request...');
        console.log('  - Getting todo with ID:', responseBody.todo.id);
        const getResponse = await todoApiPage.getTodoById(responseBody.todo.id);
        const getTodo = await todoApiPage.getResponseBody(getResponse);
        console.log('✅ GET Response:', JSON.stringify(getTodo, null, 2));
        console.log('  - Verifying GET status code is 200');
        await todoApiPage.verifyStatusCode(getResponse, STATUS_CODES.OK);
        console.log('  - Verifying GET response schema');
        await todoApiPage.verifyGetTodoSchema(getTodo);
        console.log('  - Verifying title persisted correctly');
        await todoApiPage.verifyTodoTitle(getTodo, todoData.title);

        console.log('\n✅ TC007 PASSED - Todo created successfully with all required fields');
        });

        test('TC008 - POST create todo with all fields', async ({ todoApiPage }) => {
            console.log('\n=== TC008: CREATE TODO WITH ALL FIELDS ===');

            // Get test data
            const todoData: CreateTodoRequest = testData.validTodoData.completeTodo;
            console.log('📋 Test Data (complete todo):', JSON.stringify(todoData, null, 2));

            // Create a new todo with all fields
            console.log('\n🔄 Sending POST request to create todo with all fields...');
            const response = await todoApiPage.createTodo(todoData);
            const responseBody = await todoApiPage.getResponseBody(response);
            console.log('✅ Response received:', JSON.stringify(responseBody, null, 2));
            console.log('📊 Status Code:', response.status());

            // Verify status code
            console.log('\n🔍 Verifying status code is 201 (CREATED)...');
            await todoApiPage.verifyStatusCode(response, STATUS_CODES.CREATED);

            // Verify response schema (replaces manual structure checks)
            console.log('\n🔍 Verifying response schema...');
            await todoApiPage.verifyCreateOrUpdateTodoSchema(responseBody);
            console.log('  ✅ Schema validation passed');

            // Verify specific field values
            console.log('\n🔍 Verifying specific field values...');
            console.log('  - Verifying title:', todoData.title);
            await todoApiPage.verifyTodoTitle(responseBody, todoData.title);
            console.log('  - Verifying description:', todoData.description);
            await todoApiPage.verifyTodoDescription(responseBody, todoData.description!);
            console.log('  - Verifying status:', todoData.status);
            await todoApiPage.verifyTodoStatus(responseBody, todoData.status!);
            console.log('  - Verifying priority:', todoData.priority);
            await todoApiPage.verifyTodoPriority(responseBody, todoData.priority!);
            console.log('  - Verifying user_id:', todoData.user_id);
            await todoApiPage.verifyTodoUserId(responseBody, todoData.user_id!);

            // Confirm state by GET - verify all fields persisted correctly
            console.log('\n🔄 Confirming all fields persisted by GET request...');
            console.log('  - Getting todo with ID:', responseBody.todo.id);
            const getResponse = await todoApiPage.getTodoById(responseBody.todo.id);
            const getTodo = await todoApiPage.getResponseBody(getResponse);
            console.log('✅ GET Response:', JSON.stringify(getTodo, null, 2));
            console.log('  - Verifying GET status code is 200');
            await todoApiPage.verifyStatusCode(getResponse, STATUS_CODES.OK);
            console.log('  - Verifying GET response schema');
            await todoApiPage.verifyGetTodoSchema(getTodo);
            console.log('  - Verifying field values persisted correctly');
            await todoApiPage.verifyTodoDescription(getTodo, todoData.description!);
            await todoApiPage.verifyTodoStatus(getTodo, todoData.status!);
            await todoApiPage.verifyTodoPriority(getTodo, todoData.priority!);

            console.log('\n✅ TC008 PASSED - Todo created with all fields and persisted correctly');
        });

        test('TC009 - POST create todo with default values', async ({ todoApiPage }) => {
            console.log('\n=== TC009: CREATE TODO WITH DEFAULT VALUES ===');

            // Get test data
            const todoData: CreateTodoRequest = testData.validTodoData.todoWithDefaults;
            console.log('📋 Test Data (only title, expecting defaults):', JSON.stringify(todoData, null, 2));
            console.log('📋 Expected Default Values:', JSON.stringify(testData.expectedResponses.defaultValues, null, 2));

            // Create todo with only title (should use defaults)
            console.log('\n🔄 Sending POST request with minimal data...');
            const response = await todoApiPage.createTodo(todoData);
            const responseBody = await todoApiPage.getResponseBody(response);
            console.log('✅ Response received:', JSON.stringify(responseBody, null, 2));
            console.log('📊 Status Code:', response.status());

            // Verify status code
            console.log('\n🔍 Verifying status code is 201 (CREATED)...');
            await todoApiPage.verifyStatusCode(response, STATUS_CODES.CREATED);

            // Verify response schema
            console.log('\n🔍 Verifying response schema...');
            await todoApiPage.verifyCreateOrUpdateTodoSchema(responseBody);
            console.log('  ✅ Schema validation passed');   

            // Verify default values were applied
            console.log('\n🔍 Verifying API applied default values correctly...');
            console.log('  - Expected default status:', testData.expectedResponses.defaultValues.status);
            console.log('  - Actual status:', responseBody.todo.status);
            await todoApiPage.verifyTodoStatus(responseBody, testData.expectedResponses.defaultValues.status);
            console.log('  - Expected default priority:', testData.expectedResponses.defaultValues.priority);
            console.log('  - Actual priority:', responseBody.todo.priority);
            await todoApiPage.verifyTodoPriority(responseBody, testData.expectedResponses.defaultValues.priority);
            console.log('  - Expected default user_id:', testData.expectedResponses.defaultValues.user_id);
            console.log('  - Actual user_id:', responseBody.todo.user_id);
            await todoApiPage.verifyTodoUserId(responseBody, testData.expectedResponses.defaultValues.user_id);

            console.log('\n✅ TC009 PASSED - Default values applied correctly');
        });

        test('TC011 - POST reset database successfully', async ({ todoApiPage }) => {
            console.log('\n=== TC011: RESET DATABASE ===');

            // Create some todos
            console.log('\n📝 Creating sample todos first...');
            console.log('  - Creating todo 1:', JSON.stringify(testData.sampleTodos.todo1, null, 2));
            await todoApiPage.createTodo(testData.sampleTodos.todo1);
            console.log('  - Creating todo 2:', JSON.stringify(testData.sampleTodos.todo2, null, 2));
            await todoApiPage.createTodo(testData.sampleTodos.todo2);

            // Reset database
            console.log('\n🔄 Sending POST request to reset database...');
            const response = await todoApiPage.resetDatabase();
            const responseBody = await todoApiPage.getResponseBody(response);
            console.log('✅ Reset Response received:', JSON.stringify(responseBody, null, 2));
            console.log('📊 Status Code:', response.status());

            // Verify status code
            console.log('\n🔍 Verifying status code is 200 (OK)...');
            await todoApiPage.verifyStatusCode(response, STATUS_CODES.OK);

            // Verify response schema (replaces manual structure checks)
            console.log('\n🔍 Verifying reset response schema...');
            await todoApiPage.verifyResetDatabaseSchema(responseBody);
            console.log('  ✅ Schema validation passed (includes success, reset.message, reset.sample_data)');

            // Verify sample data counts
            console.log('\n🔍 Verifying sample data was created...');
            console.log('  - Sample data:', JSON.stringify(responseBody.reset.sample_data, null, 2));
            await todoApiPage.verifyResetSampleData(responseBody);

            console.log('\n✅ TC011 PASSED - Database reset successfully with sample data');
        });
    });

    test.describe('Error Cases', () => {
        test('TC010 - POST create todo without title returns 400', async ({ todoApiPage }) => {
        console.log('\n=== TC010: CREATE TODO WITHOUT TITLE (ERROR CASE) ===');

        const todoData: CreateTodoRequest = testData.invalidTodoData.todoWithoutTitle;
        console.log('📋 Test Data (invalid - no title):', JSON.stringify(todoData, null, 2));

        console.log('\n🔄 Sending POST request with invalid data (missing required field)...');
        const response = await todoApiPage.createTodo(todoData);
        const responseBody = await todoApiPage.getResponseBody(response);
        console.log('✅ Response received:', JSON.stringify(responseBody, null, 2));
        console.log('📊 Status Code:', response.status());

        // Verify error response
        console.log('\n🔍 Verifying error response...');
        console.log('  - Expecting status code 400 (BAD REQUEST)');
        await todoApiPage.verifyStatusCode(response, STATUS_CODES.BAD_REQUEST);
        console.log('  - Verifying error response schema');
        await todoApiPage.verifyErrorResponseSchema(responseBody);
        console.log('  ✅ Error schema validation passed (includes success: false, message)');
        console.log('  - Error message:', responseBody.error || responseBody.message || 'No error message');

        console.log('\n✅ TC010 PASSED - Invalid request properly rejected with 400 error');
        });
    });
});
