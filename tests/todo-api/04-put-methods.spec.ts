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
        console.log('\n=== TC012: PUT UPDATE TODO WITH ALL FIELDS ===');

        const originalTodo: CreateTodoRequest = testData.validTodoData.originalTodoForUpdate;
        console.log('📋 Original Todo Data:', JSON.stringify(originalTodo, null, 2));

        console.log('\n🔄 Creating todo first...');
        const createResponse = await todoApiPage.createTodo(originalTodo);
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;
        createdTodoIds.push(todoId);
        console.log('✅ Todo created with ID:', todoId);
        console.log('📋 Created Todo:', JSON.stringify(createBody.todo, null, 2));

        const updatedTodoData = testData.validTodoData.updatedTodo;
        const updatedTodo: UpdateTodoRequest = {
            id: todoId,
            ...updatedTodoData
        };
        console.log('\n📋 Update Data (all fields):', JSON.stringify(updatedTodo, null, 2));

        console.log(`\n🔄 Sending PUT request to update todo ID: ${todoId}...`);
        const response = await todoApiPage.updateTodo(updatedTodo);
        const responseBody = await todoApiPage.getResponseBody(response);
        console.log('✅ Response received:', JSON.stringify(responseBody, null, 2));
        
        await todoApiPage.verifyStatusCode(response, STATUS_CODES.OK);
        console.log('📊 Status Code:', response.status());

        // Verify response schema (replaces manual structure checks)
        await todoApiPage.verifyCreateOrUpdateTodoSchema(responseBody);
        console.log('✅ Schema validation passed');

        // Verify specific field values
        console.log('\n🔍 Verifying all updated fields in response...');
        await todoApiPage.verifyTodoId(responseBody, todoId);
        console.log('  - Verifying todo ID:', todoId);
        await todoApiPage.verifyTodoTitle(responseBody, updatedTodoData.title);
        console.log('  - Verifying updated title:', updatedTodoData.title);
        await todoApiPage.verifyTodoDescription(responseBody, updatedTodoData.description);
        console.log('  - Verifying updated description:', updatedTodoData.description);
        await todoApiPage.verifyTodoStatus(responseBody, updatedTodoData.status);
        console.log('  - Verifying updated status:', updatedTodoData.status);
        await todoApiPage.verifyTodoPriority(responseBody, updatedTodoData.priority);
        console.log('  - Verifying updated priority:', updatedTodoData.priority);
        
        // Confirm state by GET - verify update was persisted
        console.log('\n🔄 Confirming update persisted by GET request...');
        console.log('  - Getting todo with ID:', todoId);
        const getResponse = await todoApiPage.getTodoById(todoId);
        const getTodo = await todoApiPage.getResponseBody(getResponse);
        console.log('✅ GET Response:', JSON.stringify(getTodo, null, 2));
        await todoApiPage.verifyStatusCode(getResponse, STATUS_CODES.OK);
        console.log('  - Verifying GET status code is ', getResponse.status());
        await todoApiPage.verifyGetTodoSchema(getTodo);
        console.log('  - Verifying GET response schema');
        await todoApiPage.verifyTodoTitle(getTodo, updatedTodoData.title);
        await todoApiPage.verifyTodoDescription(getTodo, updatedTodoData.description);
        await todoApiPage.verifyTodoStatus(getTodo, updatedTodoData.status);
        console.log('  - Verifying field values persisted correctly');

        console.log('\n✅ TC012 PASSED - Todo updated successfully with all fields and persisted correctly');
    });

    test('TC013 - PUT update todo status from pending to in_progress', async ({ todoApiPage }) => {
        console.log('\n=== TC013: PUT UPDATE TODO STATUS FROM PENDING TO IN_PROGRESS ===');

        const originalTodo: CreateTodoRequest = testData.validTodoData.todoToUpdate;
        console.log('📋 Original Todo Data:', JSON.stringify(originalTodo, null, 2));

        console.log('\n🔄 Creating todo first...');
        const createResponse = await todoApiPage.createTodo(originalTodo);
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;
        createdTodoIds.push(todoId);
        console.log('✅ Todo created with ID:', todoId);
        console.log('📋 Initial Status:', createBody.todo.status);

        const statusUpdate = testData.validTodoData.statusUpdateToInProgress;
        const updatedTodo: UpdateTodoRequest = {
            id: todoId,
            title: originalTodo.title,
            status: Status.IN_PROGRESS,
            priority: originalTodo.priority
        };
        console.log('\n📋 Status Update:', JSON.stringify(statusUpdate, null, 2));
        console.log('📋 Update Request:', JSON.stringify(updatedTodo, null, 2));

        console.log(`\n🔄 Sending PUT request to update status to IN_PROGRESS...`);
        const response = await todoApiPage.updateTodo(updatedTodo);
        const responseBody = await todoApiPage.getResponseBody(response);
        console.log('✅ Response received:', JSON.stringify(responseBody, null, 2));
        
        await todoApiPage.verifyStatusCode(response, STATUS_CODES.OK);
        console.log('📊 Status Code:', response.status());

        // Verify response schema
        await todoApiPage.verifyCreateOrUpdateTodoSchema(responseBody);
        console.log('  ✅ Schema validation passed');

        await todoApiPage.verifyTodoStatus(responseBody, statusUpdate.status);
        console.log('  ✅ Status updated successfully');

        // Confirm state by GET - verify status change persisted
        console.log('\n🔄 Confirming status change persisted by GET request...');
        console.log('  - Getting todo with ID:', todoId);
        const getResponse = await todoApiPage.getTodoById(todoId);
        const getTodo = await todoApiPage.getResponseBody(getResponse);
        console.log('✅ GET Response:', JSON.stringify(getTodo, null, 2));
        
        await todoApiPage.verifyStatusCode(getResponse, STATUS_CODES.OK);
        console.log('  - Verifying GET status code is ', getResponse.status());
        
        await todoApiPage.verifyGetTodoSchema(getTodo);
        console.log('  - Verifying GET response schema');
        
        await todoApiPage.verifyTodoStatus(getTodo, statusUpdate.status);
        console.log('  - Verifying status persisted as IN_PROGRESS');

        console.log('\n✅ TC013 PASSED - Todo status updated successfully and persisted correctly');
        });
    });

    test.describe('Error Cases', () => {
        test('TC014 - PUT update non-existent todo returns 404', async ({ todoApiPage }) => {
        console.log('\n=== TC014: PUT UPDATE NON-EXISTENT TODO (ERROR CASE) ===');

        const todoToUpdate = testData.validTodoData.todoToUpdate;
        const updateData: UpdateTodoRequest = {
            id: TEST_IDS.NON_EXISTENT_ID,
            title: todoToUpdate.title,
            status: Status.PENDING,
            priority: todoToUpdate.priority
        };
        console.log('📋 Update Data for non-existent ID:', JSON.stringify(updateData, null, 2));

        console.log(`\n🔄 Sending PUT request for non-existent todo (ID: ${TEST_IDS.NON_EXISTENT_ID})...`);
        const response = await todoApiPage.updateTodo(updateData);
        const responseBody = await todoApiPage.getResponseBody(response);
        console.log('✅ Error response received:', JSON.stringify(responseBody, null, 2));
        
        await todoApiPage.verifyStatusCode(response, STATUS_CODES.NOT_FOUND);
        console.log('📊 Status Code:', response.status());

        // Verify error response schema
        console.log('\n🔍 Verifying error response schema...');
        await todoApiPage.verifyErrorResponseSchema(responseBody);
        console.log('✅ Error schema validation passed (includes success: false, message)');
        console.log('- Error message:', responseBody.error || responseBody.message || 'No error message');

        console.log('\n✅ TC014 PASSED - Non-existent todo update properly returns 404 error');
    });

    test('TC015 - PUT update todo without title returns 400', async ({ todoApiPage }) => {
        console.log('\n=== TC015: PUT UPDATE TODO WITHOUT TITLE (ERROR CASE) ===');

        console.log('\n🔄 Creating todo first...');
        const createResponse = await todoApiPage.createTodo({
            title: testData.validTodoData.todoToUpdate.title
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;
        createdTodoIds.push(todoId);
        console.log('✅ Todo created with ID:', todoId);

        const invalidUpdate: UpdateTodoRequest = {
            id: todoId,
            title: testData.invalidTodoData.emptyTitle.title as any
        };
        console.log('\n📋 Invalid Update Data (missing title):', JSON.stringify(invalidUpdate, null, 2));

        console.log(`\n🔄 Sending PUT request with invalid data (empty/missing title)...`);
        const response = await todoApiPage.updateTodo(invalidUpdate);
        const responseBody = await todoApiPage.getResponseBody(response);
        console.log('✅ Error response received:', JSON.stringify(responseBody, null, 2));
        
        await todoApiPage.verifyStatusCode(response, STATUS_CODES.BAD_REQUEST);
        console.log('📊 Status Code:', response.status());

        // Verify error response schema
        console.log('\n🔍 Verifying error response schema...');
        await todoApiPage.verifyErrorResponseSchema(responseBody);
        console.log('✅ Error schema validation passed (includes success: false, message)');
        console.log('- Error message:', responseBody.error || responseBody.message || 'No error message');

        console.log('\n✅ TC015 PASSED - Invalid update request properly rejected with 400 error');
        });
    });
});
