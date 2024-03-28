import fp from 'fastify-plugin';
import { getConnection } from '../db';
import { FastifyPluginCallback } from 'fastify/types/plugin';

const dbConnector: FastifyPluginCallback = (fastify, opts, done) => {
    getConnection().then((db) => {
        fastify.decorate('db', db);
        done();
    }).catch((err) => {
        done(err);
    });
};

export default fp(dbConnector);
