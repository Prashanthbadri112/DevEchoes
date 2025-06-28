import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import {signinInput,signupInput} from '@prashanthbadri/medium-common';

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();


const getPrisma = (env: { DATABASE_URL: string }) =>
  new PrismaClient({ datasourceUrl: env.DATABASE_URL }).$extends(withAccelerate());

userRouter.post('/signup', async (c) => {
  const prisma = getPrisma(c.env);
  const body = await c.req.json();

  const {success} = signupInput.safeParse(body);
  if(!success){
    c.status(400);
    return c.json({ error: 'Invalid input' });
  }
  
  const { email, password, name } = body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      c.status(409);
      return c.json({ error: 'User already exists' });
    }

    const user = await prisma.user.create({
      data: {
        email,
        password,
        name,
      },
    });

    const token = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ jwt: token });
  } catch (e) {
    console.error(e);
    c.status(500);
    return c.json({ error: 'Internal Server Error' });
  }
});

userRouter.post('/signin', async (c) => {
  const prisma = getPrisma(c.env);
  const body = await c.req.json();
  const {success} = signinInput.safeParse(body);
  if(!success){
    c.status(400);
    return c.json({ error: 'Invalid input' });
  }
  const { email, password } = body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
        password,
      },
    });

    if (!user) {
      c.status(403);
      return c.json({ error: 'Invalid credentials' });
    }

    const token = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ jwt: token });
  } catch (e) {
    console.error(e);
    c.status(500);
    return c.json({ error: 'Internal Server Error' });
  }
});
