import { z } from 'zod';

// data that we need from user to register
const createUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string(),
});
//exporting the type to provide to the request Body
export type CreateUserInput = z.infer<typeof createUserSchema>;
// response schema for registering user
const createUserResponseSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
});
// same for login route
const loginSchema = z.object({
    username: z
        .string({
            required_error: 'Username is required',
            invalid_type_error: 'Username must be a string',
        })
        .email(),
    password: z.string().min(6),
});
export type LoginUserInput = z.infer<typeof loginSchema>;
const loginResponseSchema = z.object({
    access_token: z.string(),
    token_type: z.string(),
});

export const models = {
    createUserSchema,
    createUserResponseSchema,
    loginSchema,
    loginResponseSchema,
};
