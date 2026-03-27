import { ZodSchema } from "zod";

/**
 * Creates a synchronous validator for TanStack Form using Zod schemas
 * @param schema - The Zod schema to validate against
 * @returns A validator function compatible with TanStack Form
 */
export function createZodValidator<T>(schema: ZodSchema) {
  return async (value: T) => {
    try {
      await schema.parseAsync(value);
      return undefined; // No errors
    } catch (error: any) {
      // Extract error messages from Zod validation
      if (error.errors && Array.isArray(error.errors)) {
        return error.errors.map((err: any) => ({
          path: err.path.join("."),
          message: err.message,
        }));
      }
      return [{ message: error.message }];
    }
  };
}

/**
 * Validates a single field using a Zod schema
 * @param fieldName - The name of the field
 * @param value - The value to validate
 * @param schema - The Zod schema to validate against
 * @returns Error message string or undefined if valid
 */
export function validateFieldWithZod(
  fieldName: string,
  value: unknown,
  schema: ZodSchema,
): string | undefined {
  try {
    schema.parse({ [fieldName]: value });
    return undefined;
  } catch (error: any) {
    if (error.errors && Array.isArray(error.errors)) {
      const fieldError = error.errors.find(
        (err: any) => err.path[0] === fieldName,
      );
      return fieldError ? fieldError.message : undefined;
    }
    return error.message;
  }
}
