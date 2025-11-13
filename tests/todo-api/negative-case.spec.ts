import { test, BaseTest } from '../base-test';
import { STATUS_CODES } from '../../constants/test-constants';
import { CreateTodoRequest, UpdateTodoRequest, PatchTodoRequest, Status, Priority } from '../../interfaces/todo.schema';

test.describe('Todo API - End-to-End Flow', () => {
    const baseTest = new BaseTest();
    let testData: any;

    test.beforeAll(async () => {
        testData = baseTest.loadDataInfo('todo-test-data.json');
    });

    test.beforeEach(async ({ todoApiPage }) => {
        // Reset database before each test to ensure clean state
        const resetResponse = await todoApiPage.resetDatabase();
        const resetBody = await todoApiPage.getResponseBody(resetResponse);
        await todoApiPage.verifySuccessField(resetBody, true);
    });

    test('TC001 - Error handling across all methods', async ({ todoApiPage }) => {
        console.log('\n========================================');
        console.log('TC001: ERROR HANDLING TEST');
        console.log('========================================');

        const nonExistentId = 999999;

        // Test GET with invalid ID
        console.log('\n📋 Test 1: GET non-existent todo');
        const getError = await todoApiPage.getTodoById(nonExistentId);
        const getErrorBody = await todoApiPage.getResponseBody(getError);
        console.log(`   Request: GET /todos/${nonExistentId}`);
        console.log('   Response:', JSON.stringify(getErrorBody, null, 2));
        await todoApiPage.verifyStatusCode(getError, STATUS_CODES.NOT_FOUND);
        await todoApiPage.verifySuccessField(getErrorBody, false);
        console.log(`   ✅ Status: ${getError.status()} | GET properly returns 404 for invalid ID`);

        // Test POST with missing required field
        console.log('\n📋 Test 2: POST todo without required title');
        const invalidTodo: CreateTodoRequest = testData.invalidTodoData.todoWithoutTitle;
        console.log('   Request: POST /todos');
        console.log('   Body:', JSON.stringify(invalidTodo, null, 2));
        const postError = await todoApiPage.createTodo(invalidTodo);
        const postErrorBody = await todoApiPage.getResponseBody(postError);
        console.log('   Response:', JSON.stringify(postErrorBody, null, 2));
        await todoApiPage.verifyStatusCode(postError, STATUS_CODES.BAD_REQUEST);
        await todoApiPage.verifySuccessField(postErrorBody, false);
        console.log(`   ✅ Status: ${postError.status()} | POST properly validates required fields`);

        // Test PUT with invalid ID
        console.log('\n📋 Test 3: PUT update non-existent todo');
        const updateData: UpdateTodoRequest = {
            id: nonExistentId,
            title: "Test",
            status: Status.PENDING,
            priority: Priority.LOW
        };
        console.log(`   Request: PUT /todos/${nonExistentId}`);
        console.log('   Body:', JSON.stringify(updateData, null, 2));
        const putError = await todoApiPage.updateTodo(updateData);
        const putErrorBody = await todoApiPage.getResponseBody(putError);
        console.log('   Response:', JSON.stringify(putErrorBody, null, 2));
        await todoApiPage.verifyStatusCode(putError, STATUS_CODES.NOT_FOUND);
        await todoApiPage.verifySuccessField(putErrorBody, false);
        console.log(`   ✅ Status: ${putError.status()} | PUT properly returns 404 for invalid ID`);

        // Test PATCH with invalid ID
        console.log('\n📋 Test 4: PATCH non-existent todo');
        const patchData: PatchTodoRequest = {
            id: nonExistentId,
            title: "Test"
        };
        console.log(`   Request: PATCH /todos/${nonExistentId}`);
        console.log('   Body:', JSON.stringify(patchData, null, 2));
        const patchError = await todoApiPage.patchTodo(patchData);
        const patchErrorBody = await todoApiPage.getResponseBody(patchError);
        console.log('   Response:', JSON.stringify(patchErrorBody, null, 2));
        await todoApiPage.verifyStatusCode(patchError, STATUS_CODES.NOT_FOUND);
        await todoApiPage.verifySuccessField(patchErrorBody, false);
        console.log(`   ✅ Status: ${patchError.status()} | PATCH properly returns 404 for invalid ID`);

        // Test DELETE with invalid ID
        console.log('\n📋 Test 5: DELETE non-existent todo');
        console.log(`   Request: DELETE /todos/${nonExistentId}`);
        const deleteError = await todoApiPage.deleteTodo(nonExistentId);
        const deleteErrorBody = await todoApiPage.getResponseBody(deleteError);
        console.log('   Response:', JSON.stringify(deleteErrorBody, null, 2));
        await todoApiPage.verifyStatusCode(deleteError, STATUS_CODES.NOT_FOUND);
        await todoApiPage.verifySuccessField(deleteErrorBody, false);
        console.log(`   ✅ Status: ${deleteError.status()} | DELETE properly returns 404 for invalid ID`);

        // Test double DELETE
        console.log('\n📋 Test 6: DELETE same todo twice');
        const todoToDelete = testData.validTodoData.todoDoubleDelete;
        const createResponse = await todoApiPage.createTodo(todoToDelete);
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        console.log(`   First DELETE: /todos/${todoId}`);
        const firstDelete = await todoApiPage.deleteTodo(todoId);
        await todoApiPage.verifyStatusCode(firstDelete, STATUS_CODES.OK);
        console.log(`   ✅ First delete: ${firstDelete.status()}`);

        console.log(`   Second DELETE: /todos/${todoId}`);
        const secondDelete = await todoApiPage.deleteTodo(todoId);
        const secondDeleteBody = await todoApiPage.getResponseBody(secondDelete);
        console.log('   Response:', JSON.stringify(secondDeleteBody, null, 2));
        await todoApiPage.verifyStatusCode(secondDelete, STATUS_CODES.NOT_FOUND);
        await todoApiPage.verifySuccessField(secondDeleteBody, false);
        console.log(`   ✅ Second delete: ${secondDelete.status()} | Cannot delete already deleted todo`);

        console.log('\n========================================');
        console.log('✅ TC001 PASSED - All error cases handled correctly');
        console.log('========================================\n');
    });
});
