import { Hono } from 'hono';
import { userRouter } from './routes/user';
import { blogRouter } from './routes/blog';
import { cors } from 'hono/cors';

export const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

app.use(
  '/*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowHeaders: ['Authorization', 'Content-Type'],
  }),
);

app.get('/', (c) => c.text('API is live 🚀'));

app.route('/api/v1/user', userRouter);
app.route('/api/v1/blog', blogRouter);

app.notFound((c) => c.json({ error: 'Route not found' }, 404));

export default app;
