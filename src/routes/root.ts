import { FastifyInstance, FastifyPluginOptions } from 'fastify';

async function routes(app: FastifyInstance, options: FastifyPluginOptions) {
    app.get(
        '/',
        {
            schema: {
                security: [
                    {
                        "OAuth2PasswordBearer": []
                    },
                ],
            },
        },
        async (request, reply) => {
            return {
                user: request.user,
            };
        },
    );
}

export default routes;
