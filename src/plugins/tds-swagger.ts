import fp from 'fastify-plugin';
import { FastifyPluginCallback } from 'fastify/types/plugin';
import { register } from "fastify-zod";

import { fullSchemas } from '../utils/models';

const tdsSwagger: FastifyPluginCallback = (fastify, opts, done) => {
    register(fastify, {
        jsonSchemas: fullSchemas,
        swaggerOptions: {
            openapi: {
                openapi: "3.0.2",
                info: {
                    title: "My Title",
                    description: "My Description.",
                    version: "1.0.0",
                },
                components: {
                    "securitySchemes": {
                        "OAuth2PasswordBearer": {
                            "type": "oauth2",
                            "flows": {
                                "password": {
                                    "scopes": {},
                                    "tokenUrl": "/api/auth/login"
                                }
                            }
                        }
                    }
                }
            }

        },
        swaggerUiOptions: {
            baseDir: undefined,
            routePrefix: '/docs',
            uiConfig: {
                docExpansion: 'full',
                deepLinking: false,
            },
            initOAuth: {
                appName: "My App",
                scopeSeparator: ":",
                additionalQueryStringParams: {},
                usePkceWithAuthorizationCodeGrant: false,
                clientId: "your-client-id",
                clientSecret: "your-client-secret-if-required",
            },
            uiHooks: {
                onRequest: function (request, reply, next) { next(); },
                preHandler: fastify.auth([
                    fastify.allowAnonymous,
                    fastify.verifyBearerAuth || (() => false),
                ]),
            },
            staticCSP: false,
            transformStaticCSP: (header) => header,
            transformSpecification: (swaggerObject, request, reply) => { return swaggerObject; },
            transformSpecificationClone: true
        },
    });
    done();
};

export default fp(tdsSwagger);
