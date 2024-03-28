import { JWT } from '@fastify/jwt';
import type { FastifyZod } from "fastify-zod";

import { models } from './models';
import { DBConnection } from '../db';
import { FastifyAuthFunction } from '@fastify/auth';

declare module 'fastify' {
    interface FastifyRequest {
        jwt: JWT;
        token: string;
        db: DBConnection;
    }
    export interface FastifyInstance {
        allowAnonymous: FastifyAuthFunction;
        readonly zod: FastifyZod<typeof models>;
        db: DBConnection;
    }

    interface FastifyContextConfig {
        allowAnonymous?: boolean;
        onlyAllowAnonymous?: boolean;
    }
}

type UserPayload = {
    id: number;
    email: string;
    name: string;
};

declare module '@fastify/jwt' {
    interface FastifyJWT {
        user: UserPayload;
    }
}
