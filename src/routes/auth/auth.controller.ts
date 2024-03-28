import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateUserInput, LoginUserInput } from './auth.schema';
import bcrypt from 'bcrypt';
import { NewUser, getConnection, tokens, users } from '../../db';
import { and, eq } from 'drizzle-orm';

const SALT_ROUNDS = 10;
export async function createUser(
    req: FastifyRequest<{
        Body: CreateUserInput;
    }>,
    reply: FastifyReply,
) {
    const db = await getConnection();
    const { password, email, name } = req.body;
    const user = await db.query.users.findFirst({
        where: eq(users.email, email),
    });
    if (user) {
        return reply.code(401).send({
            message: 'User already exists with this email',
        });
    }
    try {
        const hash = await bcrypt.hash(password, SALT_ROUNDS);
        const newUser = await db.insert(users).values({
            password: hash,
            email,
            name,
            role: "customer",
        } as NewUser).returning({ insertedId: users.id });
        const insertedUser = newUser[0];
        const user = await db.query.users.findFirst({
            where: eq(users.id, insertedUser.insertedId),
        });
        return reply.code(201).send({
            id: user?.id,
            email: user?.email,
            name: user?.name,
        });
    } catch (e) {
        return reply.code(500).send(e);
    }
}

export async function login(
    req: FastifyRequest<{
        Body: LoginUserInput;
    }>,
    reply: FastifyReply,
) {
    const db = await getConnection();
    const { username, password } = req.body;
    /*
     MAKE SURE TO VALIDATE (according to you needs) user data
     before performing the db query
    */
    const user = await db.query.users.findFirst({
        where: eq(users.email, username),
    });
    const isMatch = user && (await bcrypt.compare(password, user.password || ''));
    if (!user || !isMatch) {
        return reply.code(401).send({
            message: 'Invalid email or password',
        });
    }
    const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
    };
    const token = req.jwt.sign(payload);
    const newToken = await db.insert(tokens).values({
        token,
        userId: user.id,
    }).returning({ insertedId: tokens.id });
    return { access_token: token, token_type: "bearer" };
}

export async function logout(req: FastifyRequest, reply: FastifyReply) {
    const { user } = req;
    const query = await req.db.delete(tokens).where(and(
        eq(tokens.token, req.token),
        eq(tokens.userId, user.id)
    )).returning({ deletedId: tokens.id });
    return reply.send({ message: 'Logout successful', tokenId: query[0].deletedId });
}
