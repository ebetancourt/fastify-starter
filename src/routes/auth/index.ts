import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { $ref } from '../../utils/models';
import { createUser, login, logout } from './auth.controller';

async function routes(app: FastifyInstance, options: FastifyPluginOptions) {

    app.post('/register',
        {
            config: {
                onlyAllowAnonymous: true,
            },
            schema: {
                body: $ref('createUserSchema'),
                response: {
                    201: $ref('createUserResponseSchema'),
                },
            },
        },
        createUser,
    );

    app.post('/login',
        {
            config: {
                onlyAllowAnonymous: true,
            },
            schema: {
                consumes: ['application/x-www-form-urlencoded', 'application/json'],
                body: $ref('loginSchema'),
                response: {
                    201: $ref('loginResponseSchema'),
                },
            },
        },
        login,
    );

    app.delete('/logout', {}, logout);
    app.log.info('auth routes registered');
}

export default routes;
export * from './auth.schema';
