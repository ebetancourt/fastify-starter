import { FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import fjwt, { FastifyJWT } from '@fastify/jwt';
import fastifyBearerAuth from '@fastify/bearer-auth';
import { FastifyPluginCallback } from 'fastify/types/plugin';
import { and, eq } from 'drizzle-orm';

import { tokens } from '../db';
import config from '../config';

export type FastifyDoneCallback = (err?: Error) => void;

const tdsAuth: FastifyPluginCallback = (fastify, opts, done) => {
    fastify
        .register(fjwt, { secret: config.jwtSecret })
        .addHook('preHandler', (req, res, next) => {
            req.jwt = fastify.jwt;
            return next();
        })
        .register(fastifyBearerAuth, (fApp) => {
            return {
                keys: [],
                addHook: false,
                auth: async (key: string, req: FastifyRequest): Promise<boolean> => {
                    const decoded = req.jwt.verify<FastifyJWT['user']>(key);
                    console.log(decoded);
                    if (decoded) {
                        const tokenRecord = await fApp.db.query.tokens.findFirst({
                            where: and(
                                eq(tokens.token, key),
                                eq(tokens.userId, decoded.id),
                            ),
                        });
                        if (tokenRecord) {
                            if (req.routeOptions.config?.onlyAllowAnonymous) {
                                // logged in users should not access this route
                                return false;
                            }
                            const { id, email, name } = decoded;
                            req.user = { id, email, name };
                            req.token = key;
                            return true;
                        }
                    }
                    return false;
                },
            };
        })
        .decorate('allowAnonymous', function (req: FastifyRequest, reply: FastifyReply, done: FastifyDoneCallback) {
            // Handle swagger docs
            const { url } = req.raw;
            if ((url as string).split('/')[1] === 'docs') {
                return done();
            }

            // regular anonymous route processing
            if (req.headers.authorization) {
                return done(Error('not anonymous'));
            }
            if (!req.routeOptions.config?.onlyAllowAnonymous && !req.routeOptions.config?.allowAnonymous) {
                return done(Error('Anonymous not allowed'));
            }
            return done();
        })
        .after(() => {
            fastify.addHook('preHandler', fastify.auth([
                fastify.allowAnonymous,
                fastify.verifyBearerAuth || (() => false),
            ]));
        });
    done();
};

export default fp(tdsAuth);
