import { test, BaseTest } from '../base-test';
import { STATUS_CODES, TEST_IDS } from '../../constants/test-constants';
import { CreateTodoRequest, PatchTodoRequest, Status } from '../../interfaces/todo.schema';

test.describe('Todo API - PATCH Methods', () => {
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
        test('TC016 - PATCH update only todo title', async ({ todoApiPage }) => {
        console.log('\n=== TC016: PATCH UPDATE ONLY TODO TITLE ===');

        const originalTodo: CreateTodoRequest = testData.validTodoData.todoForPatch;
        console.log('📋 Original Todo Data:', JSON.stringify(originalTodo, null, 2));

        console.log('\n🔄 Creating todo first...');
        const createResponse = await todoApiPage.createTodo(originalTodo);
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;
        console.log('✅ Todo created with ID:', todoId);
        console.log('📋 Original Title:', createBody.todo.title);
        console.log('📋 Original Description:', createBody.todo.description);
        console.log('📋 Original Status:', createBody.todo.status);
        console.log('📋 Original Priority:', createBody.todo.priority);

        const patchTitleData = testData.validTodoData.patchedTitle;
        const patchData: PatchTodoRequest = {
            id: todoId,
            title: patchTitleData.title
        };
        console.log('\n📋 PATCH Data (only title):', JSON.stringify(patchData, null, 2));

        console.log(`\n🔄 Sending PATCH request to update only title for todo ID: ${todoId}...`);
        const response = await todoApiPage.patchTodo(patchData);
        const responseBody = await todoApiPage.getResponseBody(response);
        console.log('✅ Response received:', JSON.stringify(responseBody, null, 2));
        console.log('📊 Status Code:', response.status());

        console.log('\n🔍 Verifying status code is 200 (OK)...');
        await todoApiPage.verifyStatusCode(response, STATUS_CODES.OK);

        console.log('\n🔍 Verifying only title changed, other fields remain the same...');
        console.log('  - Checking success field is true');
        await todoApiPage.verifySuccessField(responseBody, true);
        console.log('  - Verifying NEW title:', patchTitleData.title);
        await todoApiPage.verifyTodoTitle(responseBody, patchTitleData.title);
        console.log('  - Verifying description UNCHANGED:', originalTodo.description);
        await todoApiPage.verifyTodoDescription(responseBody, originalTodo.description!);
        console.log('  - Verifying status UNCHANGED:', originalTodo.status);
        await todoApiPage.verifyTodoStatus(responseBody, originalTodo.status!);
        console.log('  - Verifying priority UNCHANGED:', originalTodo.priority);
        await todoApiPage.verifyTodoPriority(responseBody, originalTodo.priority!);

        // Confirm state by GET - verify only title changed
        console.log('\n🔄 Confirming partial update persisted by GET request...');
        console.log('  - Getting todo with ID:', todoId);
        const getResponse = await todoApiPage.getTodoById(todoId);
        const getTodo = await todoApiPage.getResponseBody(getResponse);
        console.log('✅ GET Response:', JSON.stringify(getTodo, null, 2));
        console.log('  - Verifying GET status code is 200');
        await todoApiPage.verifyStatusCode(getResponse, STATUS_CODES.OK);
        console.log('  - Verifying new title persisted');
        await todoApiPage.verifyTodoTitle(getTodo, patchTitleData.title);
        console.log('  - Verifying description remained unchanged');
        await todoApiPage.verifyTodoDescription(getTodo, originalTodo.description!);

        console.log('\n✅ TC016 PASSED - Only title updated successfully, other fields preserved');
    });

    test('TC017 - PATCH update only todo status', async ({ todoApiPage }) => {
        console.log('\n=== TC017: PATCH UPDATE ONLY TODO STATUS ===');

        const originalTodo: CreateTodoRequest = testData.validTodoData.todoStatusPatch;
        console.log('📋 Original Todo Data:', JSON.stringify(originalTodo, null, 2));

        console.log('\n🔄 Creating todo first...');
        const createResponse = await todoApiPage.createTodo(originalTodo);
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;
        console.log('✅ Todo created with ID:', todoId);
        console.log('📋 Original Status:', createBody.todo.status);
        console.log('📋 Original Title:', createBody.todo.title);
        console.log('📋 Original Description:', createBody.todo.description);
        console.log('📋 Original Priority:', createBody.todo.priority);

        const statusUpdate = testData.validTodoData.statusUpdateToInProgress;
        const patchData: PatchTodoRequest = {
            id: todoId,
            status: Status.IN_PROGRESS
        };
        console.log('\n📋 PATCH Data (only status):', JSON.stringify(patchData, null, 2));

        console.log(`\n🔄 Sending PATCH request to update only status for todo ID: ${todoId}...`);
        const response = await todoApiPage.patchTodo(patchData);
        const responseBody = await todoApiPage.getResponseBody(response);
        console.log('✅ Response received:', JSON.stringify(responseBody, null, 2));
        console.log('📊 Status Code:', response.status());

        console.log('\n🔍 Verifying status code is 200 (OK)...');
        await todoApiPage.verifyStatusCode(response, STATUS_CODES.OK);

        console.log('\n🔍 Verifying only status changed, other fields remain the same...');
        console.log('  - Verifying NEW status:', statusUpdate.status);
        await todoApiPage.verifyTodoStatus(responseBody, statusUpdate.status);
        console.log('  - Verifying title UNCHANGED:', originalTodo.title);
        await todoApiPage.verifyTodoTitle(responseBody, originalTodo.title);
        console.log('  - Verifying description UNCHANGED:', originalTodo.description);
        await todoApiPage.verifyTodoDescription(responseBody, originalTodo.description!);
        console.log('  - Verifying priority UNCHANGED:', originalTodo.priority);
        await todoApiPage.verifyTodoPriority(responseBody, originalTodo.priority!);

        // Confirm state by GET - verify only status changed
        console.log('\n🔄 Confirming partial update persisted by GET request...');
        console.log('  - Getting todo with ID:', todoId);
        const getResponse = await todoApiPage.getTodoById(todoId);
        const getTodo = await todoApiPage.getResponseBody(getResponse);
        console.log('✅ GET Response:', JSON.stringify(getTodo, null, 2));
        console.log('  - Verifying GET status code is 200');
        await todoApiPage.verifyStatusCode(getResponse, STATUS_CODES.OK);
        console.log('  - Verifying new status persisted');
        await todoApiPage.verifyTodoStatus(getTodo, statusUpdate.status);
        console.log('  - Verifying title remained unchanged');
        await todoApiPage.verifyTodoTitle(getTodo, originalTodo.title);

        console.log('\n✅ TC017 PASSED - Only status updated successfully, other fields preserved');
        });
    });

    test.describe('Error Cases', () => {
        test('TC018 - PATCH non-existent todo returns 404', async ({ todoApiPage }) => {
        console.log('\n=== TC018: PATCH NON-EXISTENT TODO (ERROR CASE) ===');

        const patchTitleData = testData.validTodoData.patchedTitle;
        const patchData: PatchTodoRequest = {
            id: TEST_IDS.NON_EXISTENT_ID,
            title: patchTitleData.title
        };
        console.log('📋 PATCH Data for non-existent ID:', JSON.stringify(patchData, null, 2));

        console.log(`\n🔄 Sending PATCH request for non-existent todo (ID: ${TEST_IDS.NON_EXISTENT_ID})...`);
        const response = await todoApiPage.patchTodo(patchData);
        const responseBody = await todoApiPage.getResponseBody(response);
        console.log('✅ Error response received:', JSON.stringify(responseBody, null, 2));
        console.log('📊 Status Code:', response.status());

        console.log('\n🔍 Verifying status code is 404 (NOT FOUND)...');
        await todoApiPage.verifyStatusCode(response, STATUS_CODES.NOT_FOUND);
        console.log('\n🔍 Verifying error response...');
        console.log('  - Checking success field is false');
        await todoApiPage.verifySuccessField(responseBody, false);
        console.log('  - Error message:', responseBody.error || responseBody.message || 'No error message');

        console.log('\n✅ TC018 PASSED - Non-existent todo patch properly returns 404 error');
    });

    test('TC019 - PATCH with no fields to update (only ID) returns 400', async ({ todoApiPage }) => {
        console.log('\n=== TC019: PATCH WITH NO FIELDS TO UPDATE (ERROR CASE) ===');

        const todoToCreate = testData.validTodoData.todoToUpdate;
        console.log('\n🔄 Creating todo first...');
        const createResponse = await todoApiPage.createTodo({
            title: todoToCreate.title
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;
        console.log('✅ Todo created with ID:', todoId);

        const patchData: PatchTodoRequest = {
            id: todoId
        };
        console.log('\n📋 PATCH Data (only ID, no fields to update):', JSON.stringify(patchData, null, 2));

        console.log(`\n🔄 Sending PATCH request with no fields to update...`);
        const response = await todoApiPage.patchTodo(patchData);
        const responseBody = await todoApiPage.getResponseBody(response);
        console.log('✅ Error response received:', JSON.stringify(responseBody, null, 2));
        console.log('📊 Status Code:', response.status());

        console.log('\n🔍 Verifying status code is 400 (BAD REQUEST)...');
        await todoApiPage.verifyStatusCode(response, STATUS_CODES.BAD_REQUEST);
        console.log('\n🔍 Verifying error response...');
        console.log('  - Checking success field is false');
        await todoApiPage.verifySuccessField(responseBody, false);
        console.log('  - Error message:', responseBody.error || responseBody.message || 'No error message');

        console.log('\n✅ TC019 PASSED - PATCH with no fields properly rejected with 400 error');
        });
    });
});
