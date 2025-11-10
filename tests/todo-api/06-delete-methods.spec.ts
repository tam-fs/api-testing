import { test } from '../base-test';

test.describe('Todo API - DELETE Methods', () => {
    test.beforeEach(async ({ todoApiPage }) => {
        const resetResponse = await todoApiPage.resetDatabase();
        const resetBody = await todoApiPage.getResponseBody(resetResponse);
        await todoApiPage.verifySuccessField(resetBody, true);
    });

    test('TC062 - DELETE todo successfully', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: 'Todo to Delete',
            description: 'This will be deleted',
            status: 'pending',
            priority: 'low'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const response = await todoApiPage.deleteTodo(todoId);
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, 200);
        await todoApiPage.verifySuccessField(responseBody, true);
        await todoApiPage.verifyHasProperty(responseBody, 'deleted');
        await todoApiPage.verifyHasProperty(responseBody.deleted, 'id');
        await todoApiPage.verifyHasProperty(responseBody.deleted, 'message');
        await todoApiPage.verifyDeletedTodoId(responseBody, todoId);
    });

    test('TC063 - DELETE todo and verify it is removed', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: 'Todo to Remove',
            status: 'pending'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        await todoApiPage.deleteTodo(todoId);

        const getResponse = await todoApiPage.getTodoById(todoId);
        const getBody = await todoApiPage.getResponseBody(getResponse);

        await todoApiPage.verifyStatusCode(getResponse, 404);
        await todoApiPage.verifySuccessField(getBody, false);
    });

    test('TC064 - DELETE todo with pending status', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: 'Pending Todo to Delete',
            status: 'pending'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const response = await todoApiPage.deleteTodo(todoId);
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, 200);
        await todoApiPage.verifySuccessField(responseBody, true);
        await todoApiPage.verifyDeletedTodoId(responseBody, todoId);
    });

    test('TC065 - DELETE todo with in_progress status', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: 'In Progress Todo to Delete',
            status: 'in_progress'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const response = await todoApiPage.deleteTodo(todoId);
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, 200);
        await todoApiPage.verifySuccessField(responseBody, true);
        await todoApiPage.verifyDeletedTodoId(responseBody, todoId);
    });

    test('TC066 - DELETE todo with completed status', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: 'Completed Todo to Delete',
            status: 'completed'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const response = await todoApiPage.deleteTodo(todoId);
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, 200);
        await todoApiPage.verifySuccessField(responseBody, true);
        await todoApiPage.verifyDeletedTodoId(responseBody, todoId);
    });

    test('TC067 - DELETE non-existent todo returns 404', async ({ todoApiPage }) => {
        const response = await todoApiPage.deleteTodo(999999);
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, 404);
        await todoApiPage.verifySuccessField(responseBody, false);
    });

    test('TC068 - DELETE without ID returns 400', async ({ todoApiPage }) => {
        const response = await todoApiPage.deleteTodo(null as any);
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, 400);
        await todoApiPage.verifySuccessField(responseBody, false);
    });

    test('TC069 - DELETE todo and verify count decreases', async ({ todoApiPage }) => {
        const initialResponse = await todoApiPage.getAllTodos();
        const initialBody = await todoApiPage.getResponseBody(initialResponse);
        const initialCount = initialBody.todos.length;

        const createResponse = await todoApiPage.createTodo({
            title: 'Todo for Count Test'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        await todoApiPage.deleteTodo(todoId);

        const afterResponse = await todoApiPage.getAllTodos();
        const afterBody = await todoApiPage.getResponseBody(afterResponse);

        await todoApiPage.verifyArrayLength(afterBody.todos, initialCount);
    });

    test('TC070 - DELETE multiple todos sequentially', async ({ todoApiPage }) => {
        const create1 = await todoApiPage.createTodo({ title: 'Delete Todo 1' });
        const create2 = await todoApiPage.createTodo({ title: 'Delete Todo 2' });
        const create3 = await todoApiPage.createTodo({ title: 'Delete Todo 3' });

        const body1 = await todoApiPage.getResponseBody(create1);
        const body2 = await todoApiPage.getResponseBody(create2);
        const body3 = await todoApiPage.getResponseBody(create3);

        const id1 = body1.todo.id;
        const id2 = body2.todo.id;
        const id3 = body3.todo.id;

        const delete1 = await todoApiPage.deleteTodo(id1);
        const delete2 = await todoApiPage.deleteTodo(id2);
        const delete3 = await todoApiPage.deleteTodo(id3);

        await todoApiPage.verifyStatusCode(delete1, 200);
        await todoApiPage.verifyStatusCode(delete2, 200);
        await todoApiPage.verifyStatusCode(delete3, 200);

        const get1 = await todoApiPage.getTodoById(id1);
        const get2 = await todoApiPage.getTodoById(id2);
        const get3 = await todoApiPage.getTodoById(id3);

        await todoApiPage.verifyStatusCode(get1, 404);
        await todoApiPage.verifyStatusCode(get2, 404);
        await todoApiPage.verifyStatusCode(get3, 404);
    });

    test('TC071 - DELETE same todo twice returns 404 on second attempt', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: 'Todo Double Delete'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const firstDelete = await todoApiPage.deleteTodo(todoId);
        await todoApiPage.verifyStatusCode(firstDelete, 200);

        const secondDelete = await todoApiPage.deleteTodo(todoId);
        const secondDeleteBody = await todoApiPage.getResponseBody(secondDelete);

        await todoApiPage.verifyStatusCode(secondDelete, 404);
        await todoApiPage.verifySuccessField(secondDeleteBody, false);
    });

    test('TC072 - DELETE todo with all priorities', async ({ todoApiPage }) => {
        const lowPriority = await todoApiPage.createTodo({ title: 'Low Priority', priority: 'low' });
        const mediumPriority = await todoApiPage.createTodo({ title: 'Medium Priority', priority: 'medium' });
        const highPriority = await todoApiPage.createTodo({ title: 'High Priority', priority: 'high' });

        const lowBody = await todoApiPage.getResponseBody(lowPriority);
        const mediumBody = await todoApiPage.getResponseBody(mediumPriority);
        const highBody = await todoApiPage.getResponseBody(highPriority);

        const deleteLow = await todoApiPage.deleteTodo(lowBody.todo.id);
        const deleteMedium = await todoApiPage.deleteTodo(mediumBody.todo.id);
        const deleteHigh = await todoApiPage.deleteTodo(highBody.todo.id);

        await todoApiPage.verifyStatusCode(deleteLow, 200);
        await todoApiPage.verifyStatusCode(deleteMedium, 200);
        await todoApiPage.verifyStatusCode(deleteHigh, 200);
    });

    test('TC073 - DELETE todo with due_date', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: 'Todo with Due Date to Delete',
            due_date: '2025-12-31 23:59:59'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const response = await todoApiPage.deleteTodo(todoId);
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, 200);
        await todoApiPage.verifySuccessField(responseBody, true);
    });

    test('TC074 - DELETE recently created todo', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: 'Recently Created Todo'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const response = await todoApiPage.deleteTodo(todoId);
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, 200);
        await todoApiPage.verifySuccessField(responseBody, true);
    });

    test('TC075 - DELETE todo that was previously updated', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: 'Todo to Update then Delete',
            status: 'pending'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        await todoApiPage.updateTodo({
            id: todoId,
            title: 'Updated Todo',
            status: 'completed',
            priority: 'high'
        });

        const response = await todoApiPage.deleteTodo(todoId);
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyStatusCode(response, 200);
        await todoApiPage.verifySuccessField(responseBody, true);
        await todoApiPage.verifyDeletedTodoId(responseBody, todoId);
    });

    test('TC076 - DELETE and verify response message', async ({ todoApiPage }) => {
        const createResponse = await todoApiPage.createTodo({
            title: 'Todo Message Test'
        });
        const createBody = await todoApiPage.getResponseBody(createResponse);
        const todoId = createBody.todo.id;

        const response = await todoApiPage.deleteTodo(todoId);
        const responseBody = await todoApiPage.getResponseBody(response);

        await todoApiPage.verifyDeletedMessage(responseBody);
    });
});
