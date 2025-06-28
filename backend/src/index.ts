import { Hono } from 'hono';
import { userRouter } from './routes/user';
import { blogRouter } from './routes/blog';

export const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();


app.get('/', (c) => c.text('API is live 🚀'));


app.route('/api/v1/user', userRouter);
app.route('/api/v1/blog', blogRouter);


app.notFound((c) => c.json({ error: 'Route not found' }, 404));

export default app;




// import { Hono } from 'hono';
// import { PrismaClient } from '@prisma/client/edge';
// import { withAccelerate } from '@prisma/extension-accelerate';
// import { sign, verify } from 'hono/jwt';

// // Create the main Hono app
// const app = new Hono<{
//   Bindings: {
//     DATABASE_URL: string;
//     JWT_SECRET: string;
//     header: string;
//   };
//   Variables: {
//     userId: string;
//   };
// }>();

// //Get the header
// //verify the header
// //if the header is correct , we can proceed
// // if not return 403 status code

// app.use('/api/v1/blog/*', async (c, next) => {
//   const jwt = c.req.header('Authorization');
//   if (!jwt) {
//     c.status(401);
//     return c.json({ error: 'unauthorized' });
//   }
//   const token = jwt.split(' ')[1];
//   const payload = await verify(token, c.env.JWT_SECRET);
//   if (!payload) {
//     c.status(401);
//     return c.json({ error: 'unauthorized' });
//   }
//   c.set('userId', payload.id as string);
//   await next();
// });

// app.post('/api/v1/user/signup', async (c) => {
//   const prisma = new PrismaClient({
//     datasourceUrl: c.env?.DATABASE_URL,
//   }).$extends(withAccelerate());

//   const body = await c.req.json();
//   try {
//     const user = await prisma.user.create({
//       data: {
//         email: body.email,
//         password: body.password,
//       },
//     });
//     const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
//     console.log('Generated JWT:', jwt);
//     return c.json({ jwt });
//   } catch (e) {
//     console.error('JWT Sign Error:', e);
//     return c.json({ error: 'Failed to sign JWT' });
//   }
// });

// app.post('/api/v1/user/signin', async (c) => {
//   const prisma = new PrismaClient({
//     datasourceUrl: c.env?.DATABASE_URL,
//   }).$extends(withAccelerate());
//   const body = await c.req.json();
//   const user = await prisma.user.findUnique({
//     where: {
//       email: body.email,
//       password: body.password,
//     },
//   });
//   if (!user) {
//     c.status(403);
//     return c.json({ error: 'user not found' });
//   }

//   const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
//   return c.json({ jwt });
// });

// app.post('/api/v1/blog', (c) => {
//   console.log(c.get('userId'));
//   return c.text('signin route');
// });

// app.put('/api/v1/blog', (c) => {
//   return c.text('');
// });

// app.get('/api/v1/blog/:id', (c) => {
//   return c.text('Hello Hono!');
// });

// app.get('/api/v1/blog/bulk', (c) => {
//   return c.text('Hello Hono!');
// });

// export default app;
