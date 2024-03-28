import Fastify from 'fastify';
import auth from '@fastify/auth';
import formbody from '@fastify/formbody'

import rootRoutes from './routes/root';
import authRoutes from './routes/auth';
import dbPlugin from './plugins/db';
import tdsSwagger from './plugins/tds-swagger';
import tdsAuthPlugin from './plugins/tds-auth';

const app = Fastify({
    logger: true
});

app
    .register(auth)
    .register(formbody)
    .register(dbPlugin)
    .addHook('preHandler', (req, res, next) => {
        req.db = app.db;
        next();
    })
    .after(() => {
        app.register(tdsAuthPlugin);
    })
    .after(() => {
        app.register(tdsSwagger);
    });

app.register(rootRoutes);
app.register(authRoutes, { prefix: 'api/auth' });

const start = async () => {
    try {
        await app.listen({ port: 3000, host: '0.0.0.0' });
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();
