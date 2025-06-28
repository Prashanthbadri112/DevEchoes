import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { verify } from 'hono/jwt';

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.use('/*', async (c, next) => {
  const jwt = c.req.header('Authorization');
  if (!jwt) return c.json({ error: 'unauthorized' }, 401);

  const token = jwt.split(' ')[1];
  try {
    const payload = await verify(token, c.env.JWT_SECRET);
    c.set('userId', payload.id as string);
    await next();
  } catch {
    return c.json({ error: 'unauthorized' }, 401);
  }
});

const getPrisma = (env: { DATABASE_URL: string }) =>
  new PrismaClient({ datasourceUrl: env.DATABASE_URL }).$extends(withAccelerate());

blogRouter.post('/', async (c) => {
  const prisma = getPrisma(c.env);
  const userId = c.get('userId');
  const body = await c.req.json();

  const post = await prisma.post.create({
    data: { title: body.title, content: body.content, authorId: userId },
  });

  return c.json({ id: post.id });
});

blogRouter.put('/', async (c) => {
  const prisma = getPrisma(c.env);
  const userId = c.get('userId');
  const body = await c.req.json();

  await prisma.post.update({
    where: { id: body.id, authorId: userId },
    data: { title: body.title, content: body.content },
  });

  return c.json({ title: body.title, content: body.content, id: body.id });
});

blogRouter.get('/bulk', async (c) => {
  const prisma = getPrisma(c.env);
  const posts = await prisma.post.findMany();
  return c.json(posts);
});

blogRouter.get('/:id', async (c) => {
  const prisma = getPrisma(c.env);
  const id = c.req.param('id');

  const post = await prisma.post.findUnique({ where: { id } });
  return c.json(post);
});
