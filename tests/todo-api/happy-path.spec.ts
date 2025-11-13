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

    test('TC001 - Complete CRUD flow with all HTTP methods', async ({ todoApiPage }) => {
        console.log('\n========================================');
        console.log('TC001: END-TO-END TODO LIFECYCLE TEST');
        console.log('========================================');

        let todoId: number;

        // ============================================================
        // STEP 1: GET all todos (initial state)
        // ============================================================
        console.log('\n📋 STEP 1: GET all todos (initial state)');
        const getAllResponse1 = await todoApiPage.getAllTodos();
        const getAllBody1 = await todoApiPage.getResponseBody(getAllResponse1);
        console.log('   Request: GET /todos');
        console.log('   Response:', JSON.stringify(getAllBody1, null, 2));

        await todoApiPage.verifyStatusCode(getAllResponse1, STATUS_CODES.OK);
        // Verify response schema
        await todoApiPage.verifyGetAllTodosSchema(getAllBody1);
        const initialCount = getAllBody1.todos.length;
        console.log(`   ✅ Status: ${getAllResponse1.status()} | Initial todos count: ${initialCount}`);

        // ============================================================
        // STEP 2: POST create a new todo
        // ============================================================
        console.log('\n📋 STEP 2: POST create a new todo');
        const newTodo: CreateTodoRequest = {
            title: "Learn Playwright API Testing",
            description: "Complete end-to-end testing tutorial",
            status: Status.PENDING,
            priority: Priority.HIGH,
            user_id: 1
        };
        console.log('   Request: POST /todos');
        console.log('   Body:', JSON.stringify(newTodo, null, 2));

        const postResponse = await todoApiPage.createTodo(newTodo);
        const postBody = await todoApiPage.getResponseBody(postResponse);
        console.log('   Response:', JSON.stringify(postBody, null, 2));

        await todoApiPage.verifyStatusCode(postResponse, STATUS_CODES.CREATED);
        // Verify response schema
        await todoApiPage.verifyCreateOrUpdateTodoSchema(postBody);
        await todoApiPage.verifyTodoTitle(postBody, newTodo.title);
        await todoApiPage.verifyTodoDescription(postBody, newTodo.description!);
        await todoApiPage.verifyTodoStatus(postBody, newTodo.status!);
        await todoApiPage.verifyTodoPriority(postBody, newTodo.priority!);

        todoId = postBody.todo.id;
        console.log(`   ✅ Status: ${postResponse.status()} | Created todo ID: ${todoId}`);

        // ============================================================
        // STEP 3: GET by ID to verify POST
        // ============================================================
        console.log('\n📋 STEP 3: GET by ID to verify todo was created');
        console.log(`   Request: GET /todos/${todoId}`);

        const getByIdResponse1 = await todoApiPage.getTodoById(todoId);
        const getByIdBody1 = await todoApiPage.getResponseBody(getByIdResponse1);
        console.log('   Response:', JSON.stringify(getByIdBody1, null, 2));

        await todoApiPage.verifyStatusCode(getByIdResponse1, STATUS_CODES.OK);
        // Verify response schema
        await todoApiPage.verifyGetTodoSchema(getByIdBody1);
        await todoApiPage.verifyTodoId(getByIdBody1, todoId);
        await todoApiPage.verifyTodoTitle(getByIdBody1, newTodo.title);
        await todoApiPage.verifyTodoDescription(getByIdBody1, newTodo.description!);
        await todoApiPage.verifyTodoStatus(getByIdBody1, newTodo.status!);
        await todoApiPage.verifyTodoPriority(getByIdBody1, newTodo.priority!);
        console.log(`   ✅ Status: ${getByIdResponse1.status()} | Todo created and persisted correctly`);

        // ============================================================
        // STEP 4: PUT update entire todo
        // ============================================================
        console.log('\n📋 STEP 4: PUT update entire todo (full replacement)');
        const updatedTodo: UpdateTodoRequest = {
            id: todoId,
            title: "Master Playwright API Testing",
            description: "Completed tutorial with advanced techniques",
            status: Status.IN_PROGRESS,
            priority: Priority.MEDIUM,
            user_id: 2
        };
        console.log(`   Request: PUT /todos/${todoId}`);
        console.log('   Body:', JSON.stringify(updatedTodo, null, 2));

        const putResponse = await todoApiPage.updateTodo(updatedTodo);
        const putBody = await todoApiPage.getResponseBody(putResponse);
        console.log('   Response:', JSON.stringify(putBody, null, 2));

        await todoApiPage.verifyStatusCode(putResponse, STATUS_CODES.OK);
        // Verify response schema
        await todoApiPage.verifyCreateOrUpdateTodoSchema(putBody);
        await todoApiPage.verifyTodoId(putBody, todoId);
        await todoApiPage.verifyTodoTitle(putBody, updatedTodo.title);
        await todoApiPage.verifyTodoDescription(putBody, updatedTodo.description!);
        await todoApiPage.verifyTodoStatus(putBody, updatedTodo.status!);
        await todoApiPage.verifyTodoPriority(putBody, updatedTodo.priority!);
        await todoApiPage.verifyTodoUserId(putBody, updatedTodo.user_id!);
        console.log(`   ✅ Status: ${putResponse.status()} | Todo fully updated`);

        // ============================================================
        // STEP 5: GET by ID to verify PUT
        // ============================================================
        console.log('\n📋 STEP 5: GET by ID to verify PUT changes persisted');
        console.log(`   Request: GET /todos/${todoId}`);

        const getByIdResponse2 = await todoApiPage.getTodoById(todoId);
        const getByIdBody2 = await todoApiPage.getResponseBody(getByIdResponse2);
        console.log('   Response:', JSON.stringify(getByIdBody2, null, 2));

        await todoApiPage.verifyStatusCode(getByIdResponse2, STATUS_CODES.OK);
        // Verify response schema
        await todoApiPage.verifyGetTodoSchema(getByIdBody2);
        await todoApiPage.verifyTodoTitle(getByIdBody2, updatedTodo.title);
        await todoApiPage.verifyTodoDescription(getByIdBody2, updatedTodo.description!);
        await todoApiPage.verifyTodoStatus(getByIdBody2, updatedTodo.status!);
        await todoApiPage.verifyTodoPriority(getByIdBody2, updatedTodo.priority!);
        await todoApiPage.verifyTodoUserId(getByIdBody2, updatedTodo.user_id!);
        console.log(`   ✅ Status: ${getByIdResponse2.status()} | PUT changes persisted correctly`);

        // ============================================================
        // STEP 6: PATCH update partial fields
        // ============================================================
        console.log('\n📋 STEP 6: PATCH update partial fields (status only)');
        const patchData: PatchTodoRequest = {
            id: todoId,
            status: Status.COMPLETED
        };
        console.log(`   Request: PATCH /todos/${todoId}`);
        console.log('   Body:', JSON.stringify(patchData, null, 2));

        const patchResponse = await todoApiPage.patchTodo(patchData);
        const patchBody = await todoApiPage.getResponseBody(patchResponse);
        console.log('   Response:', JSON.stringify(patchBody, null, 2));

        await todoApiPage.verifyStatusCode(patchResponse, STATUS_CODES.OK);
        // Verify response schema
        await todoApiPage.verifyCreateOrUpdateTodoSchema(patchBody);
        await todoApiPage.verifyTodoStatus(patchBody, Status.COMPLETED);
        // Verify other fields unchanged
        await todoApiPage.verifyTodoTitle(patchBody, updatedTodo.title);
        await todoApiPage.verifyTodoDescription(patchBody, updatedTodo.description!);
        await todoApiPage.verifyTodoPriority(patchBody, updatedTodo.priority!);
        console.log(`   ✅ Status: ${patchResponse.status()} | Status updated, other fields unchanged`);

        // ============================================================
        // STEP 7: GET by ID to verify PATCH
        // ============================================================
        console.log('\n📋 STEP 7: GET by ID to verify PATCH changes persisted');
        console.log(`   Request: GET /todos/${todoId}`);

        const getByIdResponse3 = await todoApiPage.getTodoById(todoId);
        const getByIdBody3 = await todoApiPage.getResponseBody(getByIdResponse3);
        console.log('   Response:', JSON.stringify(getByIdBody3, null, 2));

        await todoApiPage.verifyStatusCode(getByIdResponse3, STATUS_CODES.OK);
        // Verify response schema
        await todoApiPage.verifyGetTodoSchema(getByIdBody3);
        await todoApiPage.verifyTodoStatus(getByIdBody3, Status.COMPLETED);
        await todoApiPage.verifyTodoTitle(getByIdBody3, updatedTodo.title);
        await todoApiPage.verifyTodoDescription(getByIdBody3, updatedTodo.description!);
        console.log(`   ✅ Status: ${getByIdResponse3.status()} | PATCH changes persisted correctly`);

        // ============================================================
        // STEP 8: DELETE the todo
        // ============================================================
        console.log('\n📋 STEP 8: DELETE the todo');
        console.log(`   Request: DELETE /todos/${todoId}`);

        const deleteResponse = await todoApiPage.deleteTodo(todoId);
        const deleteBody = await todoApiPage.getResponseBody(deleteResponse);
        console.log('   Response:', JSON.stringify(deleteBody, null, 2));

        await todoApiPage.verifyStatusCode(deleteResponse, STATUS_CODES.OK);
        // Verify response schema
        await todoApiPage.verifyDeleteTodoSchema(deleteBody);
        await todoApiPage.verifyDeletedTodoId(deleteBody, todoId);
        console.log(`   ✅ Status: ${deleteResponse.status()} | Todo deleted successfully`);

        // ============================================================
        // STEP 9: GET by ID to verify DELETE (should return 404)
        // ============================================================
        console.log('\n📋 STEP 9: GET by ID to verify todo was deleted');
        console.log(`   Request: GET /todos/${todoId}`);

        const getByIdResponse4 = await todoApiPage.getTodoById(todoId);
        const getByIdBody4 = await todoApiPage.getResponseBody(getByIdResponse4);
        console.log('   Response:', JSON.stringify(getByIdBody4, null, 2));

        await todoApiPage.verifyStatusCode(getByIdResponse4, STATUS_CODES.NOT_FOUND);
        // Verify error response schema
        await todoApiPage.verifyErrorResponseSchema(getByIdBody4);
        console.log(`   ✅ Status: ${getByIdResponse4.status()} | Todo not found (deleted successfully)`);

        // ============================================================
        // FINAL VERIFICATION: GET all todos (should be same as initial)
        // ============================================================
        console.log('\n📋 FINAL VERIFICATION: GET all todos (should match initial state)');
        const getAllResponse2 = await todoApiPage.getAllTodos();
        const getAllBody2 = await todoApiPage.getResponseBody(getAllResponse2);
        console.log('   Request: GET /todos');
        console.log(`   Initial count: ${initialCount} | Final count: ${getAllBody2.todos.length}`);

        await todoApiPage.verifyStatusCode(getAllResponse2, STATUS_CODES.OK);
        // Verify response schema
        await todoApiPage.verifyGetAllTodosSchema(getAllBody2);
        await todoApiPage.verifyArrayLength(getAllBody2.todos, initialCount);
        console.log(`   ✅ Status: ${getAllResponse2.status()} | Todo lifecycle completed - back to initial state`);

        console.log('\n========================================');
        console.log('✅ TC001 PASSED - Complete CRUD flow executed successfully');
        console.log('========================================\n');
    });
});
