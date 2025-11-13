import { test } from '../base-test';
import { STATUS_CODES, TEST_IDS } from '../../constants/test-constants';

test.describe('Todo API - GET Methods', () => {
    test.beforeEach(async ({ todoApiPage }) => {
        // Reset database before each test to ensure clean state
        const resetResponse = await todoApiPage.resetDatabase();
        const resetBody = await todoApiPage.getResponseBody(resetResponse);
        await todoApiPage.verifySuccessField(resetBody, true);
    });

    test.describe('Happy Path', () => {
        test('TC004 - GET all todos successfully', async ({ todoApiPage }) => {
            console.log('\n=== TC004: GET ALL TODOS SUCCESSFULLY ===');

            // Get all todos
            console.log('\n🔄 Sending GET request to retrieve all todos...');
            const response = await todoApiPage.getAllTodos();
            const responseBody = await todoApiPage.getResponseBody(response);
            console.log('✅ Response received:', JSON.stringify(responseBody, null, 2));
            console.log('📊 Number of todos:', responseBody.todos?.length || 0);

            // Verify status code
            await todoApiPage.verifyStatusCode(response, STATUS_CODES.OK);
            console.log('📊 Status Code:', response.status());

            // Verify response schema (replaces manual structure checks)
            await todoApiPage.verifyGetAllTodosSchema(responseBody);
            console.log('✅ Schema validation passed (includes success, todos array structure)');

            // Verify todos array has items
            console.log('\n🔍 Verifying todos array has items...');
            await todoApiPage.verifyArrayLengthGreaterThan(responseBody.todos, 0);

            // Verify todos are ordered by creation date (newest first)
            await todoApiPage.verifyTodosOrderedByDate(responseBody.todos);
            console.log('✅ Todos are correctly ordered');

            console.log('\n✅ TC004 PASSED - Successfully retrieved all todos with correct structure and ordering');
        });

        test('TC005 - GET single todo by valid ID', async ({ todoApiPage }) => {
            console.log('\n=== TC005: GET SINGLE TODO BY VALID ID ===');

            // First, get all todos to get a valid ID
            console.log('\n🔄 First, getting all todos to obtain a valid ID...');
            const allTodosResponse = await todoApiPage.getAllTodos();
            const allTodosBody = await todoApiPage.getResponseBody(allTodosResponse);
            const validId = allTodosBody.todos[0].id;
            console.log('📋 Valid ID obtained:', validId);
            console.log('📋 First todo:', JSON.stringify(allTodosBody.todos[0], null, 2));

            // Get single todo by ID
            console.log(`\n🔄 Sending GET request for todo with ID: ${validId}...`);
            const response = await todoApiPage.getTodoById(validId);
            const responseBody = await todoApiPage.getResponseBody(response);
            console.log('✅ Response received:', JSON.stringify(responseBody, null, 2));
            

            // Verify status code
            await todoApiPage.verifyStatusCode(response, STATUS_CODES.OK);
            console.log('📊 Status Code:', response.status());

            // Verify response schema (replaces manual structure checks)
            await todoApiPage.verifyGetTodoSchema(responseBody);
            console.log('✅ Schema validation passed (includes success, todo with all fields)');

            // Verify specific field value
            await todoApiPage.verifyTodoId(responseBody, validId);

            console.log('\n✅ TC005 PASSED - Successfully retrieved single todo with all required fields');
        });
    });

    test.describe('Error Cases', () => {
        test('TC006 - GET single todo by invalid ID returns 404', async ({ todoApiPage }) => {
            console.log('\n=== TC006: GET SINGLE TODO BY INVALID ID (ERROR CASE) ===');

            // Try to get a non-existent todo
            console.log(`\n🔄 Sending GET request for non-existent todo (ID: ${TEST_IDS.NON_EXISTENT_ID})...`);
            const response = await todoApiPage.getTodoById(TEST_IDS.NON_EXISTENT_ID);
            const responseBody = await todoApiPage.getResponseBody(response);
            console.log('✅ Error response received:', JSON.stringify(responseBody, null, 2));
            

            // Verify status code
            await todoApiPage.verifyStatusCode(response, STATUS_CODES.NOT_FOUND);
            console.log('📊 Status Code:', response.status());

            // Verify error response schema (replaces manual checks)
            await todoApiPage.verifyErrorResponseSchema(responseBody);
            console.log('✅ Error schema validation passed (includes success: false, message)');
            console.log('- Error message:', responseBody.message || 'No message');

            console.log('\n✅ TC006 PASSED - Invalid ID properly returns 404 error');
        });
    });
});
