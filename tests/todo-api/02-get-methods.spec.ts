import { test } from '../base-test';

test.describe('Todo API - GET Methods', () => {
    test.beforeEach(async ({ todoApiPage }) => {
        // Reset database before each test to ensure clean state
        const resetResponse = await todoApiPage.resetDatabase();
        const resetBody = await todoApiPage.getResponseBody(resetResponse);
        await todoApiPage.verifySuccessField(resetBody, true);
    });

    test('TC009 - GET all todos successfully', async ({ todoApiPage }) => {
        // Get all todos
        const response = await todoApiPage.getAllTodos();
        const responseBody = await todoApiPage.getResponseBody(response);

        // Verify status code
        await todoApiPage.verifyStatusCode(response, 200);

        // Verify response
        await todoApiPage.verifySuccessField(responseBody, true);
        await todoApiPage.verifyIsArray(responseBody.todos);
        await todoApiPage.verifyArrayLengthGreaterThan(responseBody.todos, 0);

        // Verify todos are ordered by creation date (newest first)
        await todoApiPage.verifyTodosOrderedByDate(responseBody.todos);
    });

    test('TC010 - GET all todos returns correct structure', async ({ todoApiPage }) => {
        // Get all todos
        const response = await todoApiPage.getAllTodos();
        const responseBody = await todoApiPage.getResponseBody(response);

        // Verify todos exist
        await todoApiPage.verifyArrayLengthGreaterThan(responseBody.todos, 0);

        const firstTodo = responseBody.todos[0];

        // Verify each todo has required fields
        await todoApiPage.verifyTodoHasRequiredFields(firstTodo);

        // Verify data types
        await todoApiPage.verifyFieldType(firstTodo.id, 'number');
        await todoApiPage.verifyFieldType(firstTodo.title, 'string');
        await todoApiPage.verifyValidStatus(firstTodo.status);
        await todoApiPage.verifyValidPriority(firstTodo.priority);
    });

    test('TC011 - GET single todo by valid ID', async ({ todoApiPage }) => {
        // First, get all todos to get a valid ID
        const allTodosResponse = await todoApiPage.getAllTodos();
        const allTodosBody = await todoApiPage.getResponseBody(allTodosResponse);
        const validId = allTodosBody.todos[0].id;

        // Get single todo by ID
        const response = await todoApiPage.getTodoById(validId);
        const responseBody = await todoApiPage.getResponseBody(response);

        // Verify status code
        await todoApiPage.verifyStatusCode(response, 200);

        // Verify response
        await todoApiPage.verifySuccessField(responseBody, true);
        await todoApiPage.verifyHasProperty(responseBody, 'todo');
        await todoApiPage.verifyTodoId(responseBody, validId);
        await todoApiPage.verifyHasProperty(responseBody.todo, 'title');
        await todoApiPage.verifyHasProperty(responseBody.todo, 'status');
        await todoApiPage.verifyHasProperty(responseBody.todo, 'priority');
    });

    test('TC012 - GET single todo by invalid ID returns 404', async ({ todoApiPage }) => {
        // Try to get a non-existent todo
        const response = await todoApiPage.getTodoById(999999);
        const responseBody = await todoApiPage.getResponseBody(response);

        // Verify status code
        await todoApiPage.verifyStatusCode(response, 404);

        // Verify error response
        await todoApiPage.verifySuccessField(responseBody, false);
        await todoApiPage.verifyHasProperty(responseBody, 'message');
    });

    test('TC013 - GET single todo without ID parameter returns 404', async ({ todoApiPage }) => {
        // Get todo without providing ID
        const response = await todoApiPage.getTodoById(null as any);
        const responseBody = await todoApiPage.getResponseBody(response);

        // Verify status code
        await todoApiPage.verifyStatusCode(response, 404);

        // Verify error response
        await todoApiPage.verifySuccessField(responseBody, false);
    });

    test('TC014 - GET todos after creating new todo', async ({ todoApiPage }) => {
        // Get initial count
        const initialResponse = await todoApiPage.getAllTodos();
        const initialBody = await todoApiPage.getResponseBody(initialResponse);
        const initialCount = initialBody.todos.length;

        // Small delay to ensure timestamp difference
        await new Promise(resolve => setTimeout(resolve, 100));

        // Create a new todo
        const createResponse = await todoApiPage.createTodo({
            title: 'New Todo for GET Test',
            description: 'Testing GET after creation',
            status: 'pending',
            priority: 'high'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const newTodoId = createBody.todo.id;

        // Get all todos again
        const afterResponse = await todoApiPage.getAllTodos();
        const afterBody = await todoApiPage.getResponseBody(afterResponse);

        // Verify count increased
        await todoApiPage.verifyArrayLength(afterBody.todos, initialCount + 1);

        // Verify new todo exists in the list
        const foundTodo = afterBody.todos.find((todo: any) => todo.id === newTodoId);
        await todoApiPage.verifyFieldEquals(foundTodo.title, 'New Todo for GET Test', 'title');
    });

    test('TC015 - GET todos filters by different statuses', async ({ todoApiPage }) => {
        // Create todos with different statuses
        await todoApiPage.createTodo({
            title: 'Pending Todo',
            status: 'pending',
            priority: 'low'
        });

        await todoApiPage.createTodo({
            title: 'In Progress Todo',
            status: 'in_progress',
            priority: 'medium'
        });

        await todoApiPage.createTodo({
            title: 'Completed Todo',
            status: 'completed',
            priority: 'high'
        });

        // Get all todos
        const response = await todoApiPage.getAllTodos();
        const responseBody = await todoApiPage.getResponseBody(response);

        // Verify todos with different statuses exist
        const statuses = responseBody.todos.map((todo: any) => todo.status);
        await todoApiPage.verifyArrayContains(statuses, 'pending');
        await todoApiPage.verifyArrayContains(statuses, 'in_progress');
        await todoApiPage.verifyArrayContains(statuses, 'completed');
    });

    test('TC016 - GET todos shows all priority levels', async ({ todoApiPage }) => {
        // Create todos with different priorities
        await todoApiPage.createTodo({
            title: 'Low Priority Todo',
            status: 'pending',
            priority: 'low'
        });

        await todoApiPage.createTodo({
            title: 'Medium Priority Todo',
            status: 'pending',
            priority: 'medium'
        });

        await todoApiPage.createTodo({
            title: 'High Priority Todo',
            status: 'pending',
            priority: 'high'
        });

        // Get all todos
        const response = await todoApiPage.getAllTodos();
        const responseBody = await todoApiPage.getResponseBody(response);

        // Verify todos with different priorities exist
        const priorities = responseBody.todos.map((todo: any) => todo.priority);
        await todoApiPage.verifyArrayContains(priorities, 'low');
        await todoApiPage.verifyArrayContains(priorities, 'medium');
        await todoApiPage.verifyArrayContains(priorities, 'high');
    });

    test('TC017 - GET single todo returns complete data', async ({ todoApiPage }) => {
        // Create a todo with all fields
        const createResponse = await todoApiPage.createTodo({
            title: 'Complete Todo Data',
            description: 'Full description here',
            status: 'in_progress',
            priority: 'high',
            due_date: '2025-12-31 23:59:59',
            user_id: 1
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        // Get the todo
        const response = await todoApiPage.getTodoById(todoId);
        const responseBody = await todoApiPage.getResponseBody(response);

        // Verify all data is returned
        await todoApiPage.verifyTodoTitle(responseBody, 'Complete Todo Data');
        await todoApiPage.verifyTodoDescription(responseBody, 'Full description here');
        await todoApiPage.verifyTodoStatus(responseBody, 'in_progress');
        await todoApiPage.verifyTodoPriority(responseBody, 'high');
        await todoApiPage.verifyTodoUserId(responseBody, 1);
    });
});
