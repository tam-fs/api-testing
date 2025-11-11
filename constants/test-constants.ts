/**
 * Test Constants
 * Common constants used across test files
 */

/**
 * HTTP Status Codes
 */
export const STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
} as const;

/**
 * Common Test IDs
 */
export const TEST_IDS = {
    NON_EXISTENT_ID: 999999,
} as const;

/**
 * Default Values for Todo creation
 */
export const DEFAULT_VALUES = {
    status: 'pending',
    priority: 'medium',
    user_id: 1,
} as const;
