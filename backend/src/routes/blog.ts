import { PrismaClient } from '../generated/prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Hono } from "hono";
import { verify } from 'hono/jwt';

import { createblogInputSchema, updateblogInputSchema } from '@night-kernel/sayit-app-common';

type Variables = {
    userId: string

}

type Bindings = {
    JWT_SECRET: string
    DATABASE_URL: string
}


export const blogRouter = new Hono<{ Variables: Variables; Bindings: Bindings }>()

blogRouter.use('/*', async (c, next) => {
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
})
blogRouter.onError((err, c) => {
    console.error(err)

    return c.json(
        {
            success: false,
            error: err.message
        },
        500
    )
})

blogRouter.post('/', async (c) => {
    const prisma = new PrismaClient({ accelerateUrl: c.env.DATABASE_URL, })
        .$extends(withAccelerate())

    const body = await c.req.json();
    const userId = c.get('userId');
    const parsed = createblogInputSchema.safeParse(body);
    if (!parsed.success) {
        return c.json({ error: "Invalid Input" }, 400)
    }

    const blog = await prisma.blog.create({
        data: {
            title: parsed.data.title,
            content: parsed.data.content,
            authorId: userId
        }
    })
    return c.json({ id: blog.id })
})





blogRouter.put('/', async (c) => {
    const prisma = new PrismaClient({ accelerateUrl: c.env.DATABASE_URL, })
        .$extends(withAccelerate())

    const body = await c.req.json();
    const userId = c.get('userId')
    const parsed = updateblogInputSchema.safeParse(body);
    if (!parsed.success) {
        return c.json({
            error: "Invalid Inputs"
        })
    }
    const update = await prisma.blog.update({
        where: {
            id: body.id,
            authorId: userId
        },
        data: {
            title: parsed.data.title,
            content: parsed.data.content
        }
    })
    return c.text('Changes Added')
})





blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({ accelerateUrl: c.env.DATABASE_URL, })
        .$extends(withAccelerate());
    const userId = c.get('userId');

    const allBlogs = await prisma.blog.findMany({
        select: {
            title: true,
            content: true,
            id: true,
            author: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });

    // sent along with the feed so the save and follow buttons already
    // know what this user has saved / followed on first paint
    const saved = await prisma.saved.findMany({
        where: {
            userId: userId
        },
        select: {
            blogId: true
        }
    })

    const following = await prisma.follow.findMany({
        where: {
            followerId: userId
        },
        select: {
            followingId: true
        }
    })

    return c.json({
        blogs: allBlogs,
        savedIds: saved.map((s) => s.blogId),
        followingIds: following.map((f) => f.followingId)
    });
})


blogRouter.post('/save/:id', async (c) => {
    const prisma = new PrismaClient({ accelerateUrl: c.env.DATABASE_URL, })
        .$extends(withAccelerate());
    const userId = c.get('userId');
    const blogId = c.req.param('id');

    const already = await prisma.saved.findUnique({
        where: {
            userId_blogId: {
                userId: userId,
                blogId: blogId
            }
        }
    })

    if (already) {
        await prisma.saved.delete({
            where: {
                userId_blogId: {
                    userId: userId,
                    blogId: blogId
                }
            }
        })
        return c.json({ saved: false })
    }

    await prisma.saved.create({
        data: {
            userId: userId,
            blogId: blogId
        }
    })
    return c.json({ saved: true })
})


blogRouter.get('/:id', async (c) => {
    const prisma = new PrismaClient({ accelerateUrl: c.env.DATABASE_URL, })
        .$extends(withAccelerate());
    const id = c.req.param('id');
    const blog = await prisma.blog.findUnique({
        where: {
            id: id
        },
        select: {

            title: true,
            content: true,
            id: true,
            published: true,
            author: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })
    return c.json({ blog: blog })
})