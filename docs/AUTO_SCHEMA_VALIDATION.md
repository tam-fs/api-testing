# Automatic Schema Validation

## Overview

All API methods in `TodoApiPage` now automatically validate response schemas by default. This ensures data integrity across all tests without requiring explicit schema validation calls in each test case.

## How It Works

### Automatic Validation

When you call any API method (GET, POST, PUT, PATCH, DELETE), the response schema is automatically validated:

```typescript
// Schema validation happens automatically!
const response = await todoApiPage.getAllTodos();
const body = await todoApiPage.getResponseBody(response);
// ✅ Schema has already been validated at this point
```

### Response Caching

The page object uses an intelligent response body caching mechanism to prevent multiple JSON parsing attempts:

- First call to `getResponseBody()` parses and caches the response
- Subsequent calls return the cached version
- This allows schema validation to happen transparently without breaking existing tests

### Success vs Error Schema

The auto-validation logic automatically selects the appropriate schema based on response status:

- **Success responses (2xx)**: Validates against success schemas (GetTodoResponse, CreateTodoResponse, etc.)
- **Error responses (4xx, 5xx)**: Validates against the error response schema

## Configuration

### Enabling/Disabling Auto-Validation

Auto-validation is **enabled by default** but can be controlled:

```typescript
// Disable for specific test suite
test.beforeEach(async ({ todoApiPage }) => {
    todoApiPage.setAutoSchemaValidation(false);
});

// Or disable for specific operations
todoApiPage.setAutoSchemaValidation(false);
const response = await todoApiPage.getAllTodos();
todoApiPage.setAutoSchemaValidation(true);
```

### Constructor Configuration

```typescript
// Create page object with auto-validation disabled
const todoApiPage = new TodoApiPage(request, false);
```

## Schema Validation Coverage

All API methods include automatic schema validation:

| Method | Success Schema | Error Schema |
|--------|---------------|--------------|
| `getAllTodos()` | GetAllTodosResponse | ErrorResponse |
| `getTodoById(id)` | GetTodoResponse | ErrorResponse |
| `createTodo(data)` | CreateTodoResponse | ErrorResponse |
| `updateTodo(data)` | CreateTodoResponse | ErrorResponse |
| `patchTodo(data)` | CreateTodoResponse | ErrorResponse |
| `deleteTodo(id)` | DeleteTodoResponse | ErrorResponse |
| `resetDatabase()` | ResetResponse | - |

## Benefits

### 1. Consistency
Every API call is validated, ensuring consistent schema enforcement across all tests.

### 2. Less Boilerplate
No need to add explicit schema validation in every test:

**Before (Manual):**
```typescript
test('Get todo', async ({ todoApiPage }) => {
    const response = await todoApiPage.getTodoById(1);
    const body = await todoApiPage.getResponseBody(response);

    // Manual schema validation required
    await todoApiPage.verifyGetTodoSchema(body);
    await todoApiPage.verifyStatusCode(response, 200);
});
```

**After (Automatic):**
```typescript
test('Get todo', async ({ todoApiPage }) => {
    const response = await todoApiPage.getTodoById(1);
    const body = await todoApiPage.getResponseBody(response);

    // Schema already validated! Just verify business logic
    await todoApiPage.verifyStatusCode(response, 200);
    await todoApiPage.verifyTodoId(body, 1);
});
```

### 3. Early Detection
Schema violations are caught immediately when the API call is made, making debugging easier.

### 4. No Performance Impact
Response caching ensures JSON parsing happens only once, maintaining test performance.

## Best Practices

### 1. Keep Auto-Validation Enabled
Unless you have a specific reason to disable it, keep auto-validation enabled for maximum coverage.

### 2. Explicit Validation for Schema Tests
In dedicated schema validation test files, you can still call validation methods explicitly for documentation purposes:

```typescript
test('Verify GET response schema', async ({ todoApiPage }) => {
    const response = await todoApiPage.getAllTodos();
    const body = await todoApiPage.getResponseBody(response);

    // Explicit call for test readability (already validated automatically)
    await todoApiPage.verifyGetAllTodosSchema(body);
});
```

### 3. Disable for Performance Tests
When running load/performance tests, consider disabling auto-validation to reduce overhead:

```typescript
test('Load test', async ({ todoApiPage }) => {
    todoApiPage.setAutoSchemaValidation(false);
    // Run performance-critical operations
});
```

## Implementation Details

### Cache Mechanism

```typescript
private responseBodyCache: Map<APIResponse, any> = new Map();

private async getCachedResponseBody(response: APIResponse): Promise<any> {
    if (!this.responseBodyCache.has(response)) {
        const body = await response.json();
        this.responseBodyCache.set(response, body);
    }
    return this.responseBodyCache.get(response);
}
```

### Validation in API Methods

```typescript
async getTodoById(id: number): Promise<APIResponse> {
    const response = await this.request.get(this.endpoints.todo, {
        params: { id }
    });

    // Auto validate schema if enabled
    if (this.autoValidateSchema) {
        const body = await this.getCachedResponseBody(response);
        if (response.ok()) {
            await this.verifyGetTodoSchema(body);
        } else {
            await this.verifyErrorResponseSchema(body);
        }
    }

    return response;
}
```

## Troubleshooting

### Schema Validation Fails
If auto-validation fails, the error message will clearly indicate which field caused the issue:

```
Schema validation failed: Field 'todo.id' is required but missing
```

### Disabling for Debugging
Temporarily disable auto-validation to isolate issues:

```typescript
todoApiPage.setAutoSchemaValidation(false);
```

## Migration Guide

Existing tests continue to work without any changes! The auto-validation happens transparently and doesn't interfere with explicit validation calls.

### Optional: Clean Up Redundant Validation

You can optionally remove explicit schema validation calls from non-schema-specific tests:

```typescript
// Before
const response = await todoApiPage.getAllTodos();
const body = await todoApiPage.getResponseBody(response);
await todoApiPage.verifyGetAllTodosSchema(body); // Can be removed
await todoApiPage.verifyStatusCode(response, 200);

// After
const response = await todoApiPage.getAllTodos();
const body = await todoApiPage.getResponseBody(response);
await todoApiPage.verifyStatusCode(response, 200);
```

## Summary

Automatic schema validation ensures that every API response is structurally correct, catching schema regressions early and reducing test maintenance burden. The feature works transparently with existing tests while providing comprehensive coverage across all API operations.
