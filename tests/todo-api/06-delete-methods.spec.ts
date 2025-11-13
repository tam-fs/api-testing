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
        console.log('\n=== TC020: DELETE TODO SUCCESSFULLY ===');

        const todoToDelete = testData.validTodoData.todoToDelete;
        console.log('📋 Todo to Delete:', JSON.stringify(todoToDelete, null, 2));

        console.log('\n🔄 Creating todo first...');
        const createResponse = await todoApiPage.createTodo(todoToDelete);
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;
        console.log('✅ Todo created with ID:', todoId);
        console.log('📋 Created Todo:', JSON.stringify(createBody.todo, null, 2));

        console.log(`\n🔄 Sending DELETE request for todo ID: ${todoId}...`);
        const response = await todoApiPage.deleteTodo(todoId);
        const responseBody = await todoApiPage.getResponseBody(response);
        console.log('✅ Response received:', JSON.stringify(responseBody, null, 2));
        console.log('📊 Status Code:', response.status());

        console.log('\n🔍 Verifying status code is 200 (OK)...');
        await todoApiPage.verifyStatusCode(response, STATUS_CODES.OK);

        // Verify DELETE response schema (replaces manual structure checks)
        console.log('\n🔍 Verifying DELETE response schema...');
        await todoApiPage.verifyDeleteTodoSchema(responseBody);
        console.log('  ✅ Schema validation passed (includes success, deleted.id, deleted.message)');

        // Verify specific field value
        console.log('\n🔍 Verifying deleted ID matches:', todoId);
        await todoApiPage.verifyDeletedTodoId(responseBody, todoId);
        console.log('  - Delete message:', responseBody.deleted.message);

        // Confirm state by GET - verify todo was actually deleted
        console.log('\n🔄 Confirming deletion by GET request (should return 404)...');
        console.log('  - Attempting to get deleted todo with ID:', todoId);
        const getResponse = await todoApiPage.getTodoById(todoId);
        const getBody = await todoApiPage.getResponseBody(getResponse);
        console.log('✅ GET Response:', JSON.stringify(getBody, null, 2));
        console.log('  - Verifying GET status code is 404 (NOT FOUND)');
        await todoApiPage.verifyStatusCode(getResponse, STATUS_CODES.NOT_FOUND);
        console.log('  - Verifying GET error response schema');
        await todoApiPage.verifyErrorResponseSchema(getBody);

        console.log('\n✅ TC020 PASSED - Todo deleted successfully and confirmed by GET');
    });

    test('TC021 - DELETE todo and verify it is removed', async ({ todoApiPage }) => {
        console.log('\n=== TC021: DELETE TODO AND VERIFY IT IS REMOVED ===');

        const todoToRemove = testData.validTodoData.todoToRemove;
        console.log('📋 Todo to Remove:', JSON.stringify(todoToRemove, null, 2));

        console.log('\n🔄 Creating todo first...');
        const createResponse = await todoApiPage.createTodo(todoToRemove);
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;
        console.log('✅ Todo created with ID:', todoId);

        console.log(`\n🔄 Deleting todo ID: ${todoId}...`);
        const deleteResponse = await todoApiPage.deleteTodo(todoId);
        console.log('✅ Delete request sent');
        console.log('📊 Delete Status Code:', deleteResponse.status());

        // Verify DELETE response schema
        const deleteBody = await todoApiPage.getResponseBody(deleteResponse);
        console.log('\n🔍 Verifying DELETE response schema...');
        await todoApiPage.verifyDeleteTodoSchema(deleteBody);
        console.log('  ✅ Schema validation passed');

        console.log('\n🔄 Verifying todo is removed by GET request...');
        console.log('  - Attempting to get deleted todo with ID:', todoId);
        const getResponse = await todoApiPage.getTodoById(todoId);
        const getBody = await todoApiPage.getResponseBody(getResponse);
        console.log('✅ GET Response:', JSON.stringify(getBody, null, 2));
        console.log('📊 GET Status Code:', getResponse.status());

        console.log('\n🔍 Verifying todo is no longer accessible...');
        console.log('  - Verifying GET status code is 404 (NOT FOUND)');
        await todoApiPage.verifyStatusCode(getResponse, STATUS_CODES.NOT_FOUND);
        console.log('  - Verifying error response schema');
        await todoApiPage.verifyErrorResponseSchema(getBody);

        console.log('\n✅ TC021 PASSED - Todo successfully removed and no longer accessible');
        });
    });

    test.describe('Error Cases', () => {
        test('TC022 - DELETE non-existent todo returns 404', async ({ todoApiPage }) => {
        console.log('\n=== TC022: DELETE NON-EXISTENT TODO (ERROR CASE) ===');

        console.log(`\n🔄 Sending DELETE request for non-existent todo (ID: ${TEST_IDS.NON_EXISTENT_ID})...`);
        const response = await todoApiPage.deleteTodo(TEST_IDS.NON_EXISTENT_ID);
        const responseBody = await todoApiPage.getResponseBody(response);
        console.log('✅ Error response received:', JSON.stringify(responseBody, null, 2));
        console.log('📊 Status Code:', response.status());

        console.log('\n🔍 Verifying status code is 404 (NOT FOUND)...');
        await todoApiPage.verifyStatusCode(response, STATUS_CODES.NOT_FOUND);

        // Verify error response schema
        console.log('\n🔍 Verifying error response schema...');
        await todoApiPage.verifyErrorResponseSchema(responseBody);
        console.log('  ✅ Error schema validation passed (includes success: false, message)');
        console.log('  - Error message:', responseBody.error || responseBody.message || 'No error message');

        console.log('\n✅ TC022 PASSED - Non-existent todo delete properly returns 404 error');
    });

    test('TC023 - DELETE same todo twice returns 404 on second attempt', async ({ todoApiPage }) => {
        console.log('\n=== TC023: DELETE SAME TODO TWICE (ERROR CASE) ===');

        const todoDoubleDelete = testData.validTodoData.todoDoubleDelete;
        console.log('📋 Todo for Double Delete Test:', JSON.stringify(todoDoubleDelete, null, 2));

        console.log('\n🔄 Creating todo first...');
        const createResponse = await todoApiPage.createTodo(todoDoubleDelete);
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;
        console.log('✅ Todo created with ID:', todoId);

        console.log(`\n🔄 First DELETE request for todo ID: ${todoId}...`);
        const firstDelete = await todoApiPage.deleteTodo(todoId);
        console.log('✅ First delete response received');
        console.log('📊 First Delete Status Code:', firstDelete.status());
        console.log('  - Verifying first delete succeeded (status 200)');
        await todoApiPage.verifyStatusCode(firstDelete, STATUS_CODES.OK);

        // Verify first DELETE response schema
        const firstDeleteBody = await todoApiPage.getResponseBody(firstDelete);
        console.log('  - Verifying first DELETE response schema');
        await todoApiPage.verifyDeleteTodoSchema(firstDeleteBody);
        console.log('    ✅ Schema validation passed');

        console.log(`\n🔄 Second DELETE request for same todo ID: ${todoId}...`);
        const secondDelete = await todoApiPage.deleteTodo(todoId);
        const secondDeleteBody = await todoApiPage.getResponseBody(secondDelete);
        console.log('✅ Second delete error response received:', JSON.stringify(secondDeleteBody, null, 2));
        console.log('📊 Second Delete Status Code:', secondDelete.status());

        console.log('\n🔍 Verifying second delete returns 404 (NOT FOUND)...');
        await todoApiPage.verifyStatusCode(secondDelete, STATUS_CODES.NOT_FOUND);

        // Verify second DELETE error response schema
        console.log('\n🔍 Verifying error response schema...');
        await todoApiPage.verifyErrorResponseSchema(secondDeleteBody);
        console.log('  ✅ Error schema validation passed (includes success: false, message)');
        console.log('  - Error message:', secondDeleteBody.error || secondDeleteBody.message || 'No error message');

        console.log('\n✅ TC023 PASSED - Second delete attempt properly returns 404 error');
        });
    });
});
