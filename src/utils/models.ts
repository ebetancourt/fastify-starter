import { buildJsonSchemas } from 'fastify-zod';
import { models as authModels } from '../routes/auth/auth.schema';

export const models = {
    ...authModels,
};

// to build our JSON schema, we use buildJsonSchemas from fastify-zod
// it returns all the schemas to register and a ref to refer these schemas
export const fullSchemas = buildJsonSchemas(models);
export const { schemas, $ref } = fullSchemas;
