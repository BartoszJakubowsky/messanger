/* eslint-disable @typescript-eslint/no-floating-promises */

import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const conversationRouter = createTRPCRouter({
  infiniteFeed: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z
          .object({
            id: z.string(),
            updatedAt: z.date(),
          })
          .optional(),
      })
    )
    .query(async ({ input: { limit = 10, cursor }, ctx }) => {
      const currentUserId = ctx.session?.user.id;

      const data = await ctx.prisma.conversation.findMany({
        where:{
          participants: {
            some: {
              id: currentUserId
            }
          }
        },
        take: limit + 1,
        cursor: cursor ? cursor : undefined,
        orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
        select: {
          messages: true,
          participants: true
        },
      });

      let nextCursor: typeof cursor | undefined;
      if (data.length > limit) {
        const nextItem = data.pop();
        if (nextItem != null) {
          nextCursor = { id: nextItem.id, updatedAt: nextItem.updatedAt };
        }
      }

      return {
        conversations: data.map((conversation) => {
          return {
            id: conversation.id,
            messages: conversation.content,
            updatedAt: conversation.updatedAt,
            participants: conversation.participants,
          };
        }),
        nextCursor,
      };
    }),
    matchedUsers: protectedProcedure
    .input(z.object({ content: z.string() }))
    .query(async ({ input: { content }, ctx }) => {

      const matchedUsers = await ctx.prisma.user.findMany({
        where: {
          OR: [
            {
              name: {
                contains: content,
              },
            },
            {
              name: {
                equals: content,
              },
            },
          ],
        },
      });
      return matchedUsers;
    })

});
