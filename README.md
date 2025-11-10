# Test Data Structure

Thư mục này chứa các file dữ liệu test dưới dạng JSON.

## Cấu trúc thư mục

```
data/
├── README.md
└── todo-test-data.json       # Test data cho Todo API POST methods
```

## Sử dụng test data

### 1. Load data trong test file

```typescript
import { test, BaseTest } from '../base-test';

test.describe('Your Test Suite', () => {
    const baseTest = new BaseTest();
    let testData: any;

    test.beforeAll(async () => {
        // Load test data từ JSON file
        testData = baseTest.loadDataInfo('todo-test-data.json');
    });

    test('Your test case', async ({ todoApiPage }) => {
        // Sử dụng data
        const todoData = testData.validTodoData.minimalTodo;
        const response = await todoApiPage.createTodo(todoData);
        // ...
    });
});
```

### 2. Sử dụng với TypeScript interfaces

```typescript
import { CreateTodoRequest, CreateTodoResponse } from '../../types/todo.types';

// Type-safe data access
const todoData: CreateTodoRequest = testData.validTodoData.minimalTodo;
const responseBody: CreateTodoResponse = await todoApiPage.getResponseBody(response);
```

## Cấu trúc file todo-test-data.json

### validTodoData
Chứa các test data hợp lệ cho các test case:
- `minimalTodo` - Todo với chỉ có title (required field)
- `completeTodo` - Todo đầy đủ với tất cả các fields
- `todoWithDefaults` - Todo sử dụng giá trị mặc định
- `pendingTodo`, `inProgressTodo`, `completedTodo` - Todos với các status khác nhau
- `lowPriorityTodo`, `mediumPriorityTodo`, `highPriorityTodo` - Todos với các priority khác nhau
- `todoWithDueDate` - Todo có due_date
- `todoWithDescription` - Todo có description
- `firstMultipleTodo`, `secondMultipleTodo` - Dữ liệu cho test tạo nhiều todos
- `todoForGetVerification` - Dữ liệu cho test verify trong GET request

### invalidTodoData
Chứa các test data không hợp lệ cho negative testing:
- `todoWithoutTitle` - Todo không có title (expected to fail)

### sampleTodos
Dữ liệu mẫu cho các bulk operations:
- `todo1`, `todo2` - Todos đơn giản

### expectedResponses
Chứa các giá trị expected cho validation:
- `defaultValues` - Giá trị mặc định (status, priority, user_id)
- `statusCodes` - HTTP status codes (created: 201, success: 200, badRequest: 400, notFound: 404)
- `resetDatabase` - Expected values khi reset database

### testCases
Cấu hình cho từng test case (optional - có thể dùng để tham khảo):
- `id` - Test case ID
- `description` - Mô tả test case
- `dataKey` - Key để lấy data từ validTodoData hoặc invalidTodoData
- `expectedStatus` - HTTP status code expected
- `expectedResponse` - Response data expected (optional)

## Lợi ích của cấu trúc này

1. **Separation of Concerns**: Tách riêng test data ra khỏi test logic
2. **Maintainability**: Dễ dàng cập nhật test data mà không cần sửa test code
3. **Reusability**: Có thể tái sử dụng test data cho nhiều test suites
4. **Type Safety**: Sử dụng TypeScript interfaces để đảm bảo type safety
5. **Readability**: Code test ngắn gọn và dễ đọc hơn
6. **Environment Support**: Có thể tạo data khác nhau cho dev/staging/prod
