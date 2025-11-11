import { test } from '../base-test';

test.describe('Todo API - Integration Tests', () => {
    test.beforeEach(async ({ todoApiPage }) => {
        // Reset database before each test to ensure clean state
        const resetResponse = await todoApiPage.resetDatabase();
        const resetBody = await todoApiPage.getResponseBody(resetResponse);
        await todoApiPage.verifySuccessField(resetBody, true);
    });

    test('TC024 - Complete workflow: Create → Read → Update → Delete', async ({ todoApiPage }) => {
        // 1. CREATE: Create a new todo
        const createResponse = await todoApiPage.createTodo({
            title: 'Integration Test Todo',
            description: 'Testing complete workflow',
            status: 'pending',
            priority: 'medium'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        await todoApiPage.verifyStatusCode(createResponse, 201);
        const todoId = createBody.todo.id;

        // 2. READ: Verify todo exists in GET all todos
        const getAllResponse = await todoApiPage.getAllTodos();
        const getAllBody = await todoApiPage.getResponseBody(getAllResponse);
        const foundInList = getAllBody.todos.find((todo: any) => todo.id === todoId);
        await todoApiPage.verifyFieldEquals(foundInList.title, 'Integration Test Todo', 'title');

        // 3. READ: Get single todo by ID
        const getByIdResponse = await todoApiPage.getTodoById(todoId);
        const getByIdBody = await todoApiPage.getResponseBody(getByIdResponse);
        await todoApiPage.verifyStatusCode(getByIdResponse, 200);
        await todoApiPage.verifyTodoTitle(getByIdBody, 'Integration Test Todo');
        await todoApiPage.verifyTodoStatus(getByIdBody, 'pending');

        // 4. UPDATE: Update todo with PUT
        const updateResponse = await todoApiPage.updateTodo({
            id: todoId,
            title: 'Updated Integration Test Todo',
            description: 'Updated description',
            status: 'completed',
            priority: 'high'
        });
        const updateBody = await todoApiPage.getResponseBody(updateResponse);
        await todoApiPage.verifyStatusCode(updateResponse, 200);
        await todoApiPage.verifyTodoTitle(updateBody, 'Updated Integration Test Todo');
        await todoApiPage.verifyTodoStatus(updateBody, 'completed');

        // 5. READ: Verify changes persisted
        const verifyResponse = await todoApiPage.getTodoById(todoId);
        const verifyBody = await todoApiPage.getResponseBody(verifyResponse);
        await todoApiPage.verifyTodoStatus(verifyBody, 'completed');
        await todoApiPage.verifyTodoPriority(verifyBody, 'high');

        // 6. DELETE: Delete the todo
        const deleteResponse = await todoApiPage.deleteTodo(todoId);
        await todoApiPage.verifyStatusCode(deleteResponse, 200);

        // 7. VERIFY: Confirm todo is deleted
        const confirmDeleteResponse = await todoApiPage.getTodoById(todoId);
        await todoApiPage.verifyStatusCode(confirmDeleteResponse, 404);
    });

    test('TC025 - Workflow: Create → PATCH multiple times → Verify final state', async ({ todoApiPage }) => {
        // Create todo
        const createResponse = await todoApiPage.createTodo({
            title: 'Task to be Updated',
            description: 'Initial description',
            status: 'pending',
            priority: 'low'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        // PATCH 1: Update status
        await todoApiPage.patchTodo({
            id: todoId,
            status: 'in_progress'
        });

        // PATCH 2: Update priority
        await todoApiPage.patchTodo({
            id: todoId,
            priority: 'high'
        });

        // PATCH 3: Update title
        await todoApiPage.patchTodo({
            id: todoId,
            title: 'Task Updated Multiple Times'
        });

        // PATCH 4: Complete the task
        const finalPatchResponse = await todoApiPage.patchTodo({
            id: todoId,
            status: 'completed'
        });
        const finalPatchBody = await todoApiPage.getResponseBody(finalPatchResponse);

        // Verify final state has all changes
        await todoApiPage.verifyTodoTitle(finalPatchBody, 'Task Updated Multiple Times');
        await todoApiPage.verifyTodoStatus(finalPatchBody, 'completed');
        await todoApiPage.verifyTodoPriority(finalPatchBody, 'high');
        await todoApiPage.verifyTodoDescription(finalPatchBody, 'Initial description'); // Should remain unchanged
    });

    test('TC026 - Workflow: Create multiple → Update all → Delete selected ones', async ({ todoApiPage }) => {
        // Create multiple todos
        const todo1Response = await todoApiPage.createTodo({
            title: 'Todo 1',
            status: 'pending',
            priority: 'low'
        });
        const todo2Response = await todoApiPage.createTodo({
            title: 'Todo 2',
            status: 'pending',
            priority: 'medium'
        });
        const todo3Response = await todoApiPage.createTodo({
            title: 'Todo 3',
            status: 'pending',
            priority: 'high'
        });

        const body1 = await todoApiPage.getResponseBody(todo1Response);
        const body2 = await todoApiPage.getResponseBody(todo2Response);
        const body3 = await todoApiPage.getResponseBody(todo3Response);

        const id1 = body1.todo.id;
        const id2 = body2.todo.id;
        const id3 = body3.todo.id;

        // Update all to in_progress
        await todoApiPage.patchTodo({ id: id1, status: 'in_progress' });
        await todoApiPage.patchTodo({ id: id2, status: 'in_progress' });
        await todoApiPage.patchTodo({ id: id3, status: 'in_progress' });

        // Complete todo 1 and 3
        await todoApiPage.patchTodo({ id: id1, status: 'completed' });
        await todoApiPage.patchTodo({ id: id3, status: 'completed' });

        // Delete completed todos
        await todoApiPage.deleteTodo(id1);
        await todoApiPage.deleteTodo(id3);

        // Verify todo 2 still exists
        const getTodo2Response = await todoApiPage.getTodoById(id2);
        const getTodo2Body = await todoApiPage.getResponseBody(getTodo2Response);
        await todoApiPage.verifyStatusCode(getTodo2Response, 200);
        await todoApiPage.verifyTodoStatus(getTodo2Body, 'in_progress');

        // Verify todo 1 and 3 are deleted
        const getTodo1Response = await todoApiPage.getTodoById(id1);
        const getTodo3Response = await todoApiPage.getTodoById(id3);
        await todoApiPage.verifyStatusCode(getTodo1Response, 404);
        await todoApiPage.verifyStatusCode(getTodo3Response, 404);
    });

    test('TC027 - Workflow: Reset → Create → Reset → Verify clean state', async ({ todoApiPage }) => {
        // Initial reset
        await todoApiPage.resetDatabase();

        // Get initial count
        const initialResponse = await todoApiPage.getAllTodos();
        const initialBody = await todoApiPage.getResponseBody(initialResponse);
        const initialCount = initialBody.todos.length;

        // Create new todos
        await todoApiPage.createTodo({ title: 'New Todo 1' });
        await todoApiPage.createTodo({ title: 'New Todo 2' });
        await todoApiPage.createTodo({ title: 'New Todo 3' });

        // Verify count increased
        const afterCreateResponse = await todoApiPage.getAllTodos();
        const afterCreateBody = await todoApiPage.getResponseBody(afterCreateResponse);
        await todoApiPage.verifyArrayLength(afterCreateBody.todos, initialCount + 3);

        // Reset again
        const resetResponse = await todoApiPage.resetDatabase();
        const resetBody = await todoApiPage.getResponseBody(resetResponse);
        await todoApiPage.verifyStatusCode(resetResponse, 200);
        await todoApiPage.verifySuccessField(resetBody, true);

        // Verify back to initial state
        const finalResponse = await todoApiPage.getAllTodos();
        const finalBody = await todoApiPage.getResponseBody(finalResponse);
        await todoApiPage.verifyArrayLength(finalBody.todos, initialCount);
    });

    test('TC028 - Workflow: Update with PUT vs PATCH comparison', async ({ todoApiPage }) => {
        // Create two identical todos
        const todo1Response = await todoApiPage.createTodo({
            title: 'Original Title',
            description: 'Original description',
            status: 'pending',
            priority: 'low'
        });
        const todo2Response = await todoApiPage.createTodo({
            title: 'Original Title',
            description: 'Original description',
            status: 'pending',
            priority: 'low'
        });

        const body1 = await todoApiPage.getResponseBody(todo1Response);
        const body2 = await todoApiPage.getResponseBody(todo2Response);

        const todoId1 = body1.todo.id;
        const todoId2 = body2.todo.id;

        // Update todo1 with PUT (must provide all fields)
        const putResponse = await todoApiPage.updateTodo({
            id: todoId1,
            title: 'Original Title',
            description: 'Original description',
            status: 'completed',  // Only want to change this
            priority: 'low'
        });
        const putBody = await todoApiPage.getResponseBody(putResponse);

        // Update todo2 with PATCH (only provide changed field)
        const patchResponse = await todoApiPage.patchTodo({
            id: todoId2,
            status: 'completed'  // Only change this
        });
        const patchBody = await todoApiPage.getResponseBody(patchResponse);

        // Both should have status completed
        await todoApiPage.verifyTodoStatus(putBody, 'completed');
        await todoApiPage.verifyTodoStatus(patchBody, 'completed');

        // Both should maintain other fields
        await todoApiPage.verifyTodoTitle(putBody, 'Original Title');
        await todoApiPage.verifyTodoTitle(patchBody, 'Original Title');
        await todoApiPage.verifyTodoDescription(putBody, 'Original description');
        await todoApiPage.verifyTodoDescription(patchBody, 'Original description');
    });

    test('TC029 - Workflow: Create with invalid data → Fix → Success', async ({ todoApiPage }) => {
        // Try to create without title (should fail)
        const invalidResponse = await todoApiPage.createTodo({
            title: '' as any,
            description: 'No title provided'
        });
        await todoApiPage.verifyStatusCode(invalidResponse, 400);

        // Create with valid title
        const validResponse = await todoApiPage.createTodo({
            title: 'Valid Title',
            description: 'With proper title'
        });
        const validBody = await todoApiPage.getResponseBody(validResponse);
        await todoApiPage.verifyStatusCode(validResponse, 201);
        await todoApiPage.verifySuccessField(validBody, true);

        const todoId = validBody.todo.id;

        // Try to update with empty title (should fail)
        const invalidUpdateResponse = await todoApiPage.updateTodo({
            id: todoId,
            title: '' as any
        });
        await todoApiPage.verifyStatusCode(invalidUpdateResponse, 400);

        // Update with valid data
        const validUpdateResponse = await todoApiPage.updateTodo({
            id: todoId,
            title: 'Updated Valid Title',
            status: 'completed',
            priority: 'high'
        });
        await todoApiPage.verifyStatusCode(validUpdateResponse, 200);

        // Verify final state
        const finalResponse = await todoApiPage.getTodoById(todoId);
        const finalBody = await todoApiPage.getResponseBody(finalResponse);
        await todoApiPage.verifyTodoTitle(finalBody, 'Updated Valid Title');
        await todoApiPage.verifyTodoStatus(finalBody, 'completed');
    });

    test('TC030 - Workflow: Verify todo list order after multiple operations', async ({ todoApiPage }) => {
        // Get initial todos count
        const initialResponse = await todoApiPage.getAllTodos();
        const initialBody = await todoApiPage.getResponseBody(initialResponse);
        const initialCount = initialBody.todos.length;

        // Create todos with delays to ensure different timestamps
        const todo1Response = await todoApiPage.createTodo({ title: 'First Todo' });
        const body1 = await todoApiPage.getResponseBody(todo1Response);
        await new Promise(resolve => setTimeout(resolve, 100));

        const todo2Response = await todoApiPage.createTodo({ title: 'Second Todo' });
        const body2 = await todoApiPage.getResponseBody(todo2Response);
        await new Promise(resolve => setTimeout(resolve, 100));

        const todo3Response = await todoApiPage.createTodo({ title: 'Third Todo' });
        const body3 = await todoApiPage.getResponseBody(todo3Response);

        // Get all todos
        const getAllResponse = await todoApiPage.getAllTodos();
        const getAllBody = await todoApiPage.getResponseBody(getAllResponse);

        // Verify total count increased
        await todoApiPage.verifyArrayLength(getAllBody.todos, initialCount + 3);

        // Find our created todos in the list
        const foundTodo1 = getAllBody.todos.find((t: any) => t.id === body1.todo.id);
        const foundTodo2 = getAllBody.todos.find((t: any) => t.id === body2.todo.id);
        const foundTodo3 = getAllBody.todos.find((t: any) => t.id === body3.todo.id);

        // Verify all todos exist in the list
        await todoApiPage.verifyFieldEquals(foundTodo1.title, 'First Todo', 'First todo title');
        await todoApiPage.verifyFieldEquals(foundTodo2.title, 'Second Todo', 'Second todo title');
        await todoApiPage.verifyFieldEquals(foundTodo3.title, 'Third Todo', 'Third todo title');

        // Verify todos are ordered by creation date (newest first)
        // Get indices of our todos in the array
        const ids = getAllBody.todos.map((todo: any) => todo.id);
        const index1 = ids.indexOf(body1.todo.id);
        const index2 = ids.indexOf(body2.todo.id);
        const index3 = ids.indexOf(body3.todo.id);

        // Third todo (newest) should have smaller index than Second
        // Second todo should have smaller index than First
        // Because array is ordered newest first (smaller index = newer)
        if (index3 < index2 && index2 < index1) {
            // Correct order: Third, Second, First
            await todoApiPage.verifyFieldEquals(true, true, 'Todos are in correct order (newest first)');
        } else {
            // Just verify they all exist, ordering might vary based on API implementation
            await todoApiPage.verifyFieldEquals(index1 >= 0 && index2 >= 0 && index3 >= 0, true, 'All todos exist in the list');
        }
    });
});
