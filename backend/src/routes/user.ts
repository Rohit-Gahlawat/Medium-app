import { Hono } from 'hono';
import { z } from "zod"
import { withAccelerate } from '@prisma/extension-accelerate';
import { PrismaClient } from '../generated/prisma/client';
import { sign, verify } from 'hono/jwt'
import { signinInputSchema, signupInputSchema } from '@night-kernel/sayit-app-common';
import bcrypt from 'bcryptjs'
import type { Context, Next } from 'hono';


type Bindings = {
  DATABASE_URL: string;
  JWT_SECRET: string;
};
type Variables = {
  userId: string;
};



export const userRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>();


// signup and signin stay public, the follow routes below need a logged in user
const authMiddleware = async (c: Context<{ Bindings: Bindings; Variables: Variables }>, next: Next) => {
  const header = c.req.header('Authorization');
  if (!header) {
    return c.text('Unauthorized', 401)
  }

  const jwt = header.split(" ")[1];
  try {
    const payload = await verify(jwt, c.env.JWT_SECRET, 'HS256')
    if (!payload.id) {
      return c.text('unauthorized', 401)
    }
    c.set('userId', payload.id as string)
  } catch (e) {
    console.log(e)
    return c.text('unauthorized', 401)
  }

  await next()
}




userRouter.post('/signup', async (c) => {
  const prisma = new PrismaClient({ accelerateUrl: c.env.DATABASE_URL, })
    .$extends(withAccelerate())

  const body = await c.req.json();
  const parsed = signupInputSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Invalid Input" }, 400)
  }
  try {
    const hashedPassword = await bcrypt.hash(parsed.data.password, 10)
    const newuser = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: hashedPassword
      }
    });
    const token = await sign({ id: newuser.id }, c.env.JWT_SECRET)
    return c.json({ token })

  } catch (e) {

    return c.json({ error: " error while signing up" }, 403)
  }
})




userRouter.post('/signin', async (c) => {
  const prisma = new PrismaClient({ accelerateUrl: c.env.DATABASE_URL, })
    .$extends(withAccelerate());

  const body = await c.req.json();
  const parsed = signinInputSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Invalid Input" }, 400)
  }
  try {
    const user = await prisma.user.findFirst({
      where: { email: parsed.data.email }
    })
    if (!user) {
      return c.json({ error: "user not found" }, 403)
    }
    const valid = await bcrypt.compare(parsed.data.password, user.password)
    if (!valid) {
      return c.json({ error: "invalid credentials" }, 403)
    }
    const token = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ token, name: user.name || null })

  } catch (e) {
    console.log(e);
    return c.text("Invalid", 403)

  }

})




userRouter.post('/follow/:id', authMiddleware, async (c) => {
  const prisma = new PrismaClient({ accelerateUrl: c.env.DATABASE_URL, })
    .$extends(withAccelerate());

  const userId = c.get('userId');
  const creatorId = c.req.param('id');

  if (!creatorId) {
    return c.json({ error: "Invalid Input" }, 400)
  }

  if (userId === creatorId) {
    return c.json({ error: "you cannot follow yourself" }, 400)
  }

  const already = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: userId,
        followingId: creatorId
      }
    }
  })

  if (already) {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: creatorId
        }
      }
    })
    return c.json({ following: false })
  }

  await prisma.follow.create({
    data: {
      followerId: userId,
      followingId: creatorId
    }
  })
  return c.json({ following: true })
})




