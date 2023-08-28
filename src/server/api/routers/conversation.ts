/* eslint-disable @typescript-eslint/no-floating-promises */

import { calcLength } from "framer-motion";
import { object, z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const conversationRouter = createTRPCRouter({
    matchedUsers: protectedProcedure
    .input(z.object({ content: z.string() }))
    .query(async ({ input: { content }, ctx }) => {

      if (content === '')
      return await ctx.prisma.user.findMany();

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
    }),
    getConversation: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input: { userId }, ctx }) => {
       
        // const conversation = await ctx.prisma.conversation.findUnique({
        //   where : {
        //     id: conversationId
        //   },
        //   select: {
        //     participants: true,
        //     messages: true
        //   }
        // })
        // console.log(conversation);
        // return conversation;
        const currentUserId = ctx.session?.user.id;
        const user1Id = currentUserId;
        const user2Id = user1Id;
        // Check if a conversation between the two users already exists
        const existingConversation = await ctx.prisma.conversation.findFirst({
            where: {
                AND: [
                    { participants: { some: { id: user1Id } } },
                    { participants: { some: { id: user2Id } } },
                ],
            },
        });

        if (existingConversation)
          return existingConversation;

        // Create a new conversation with empty messages array
        const newConversation = await prisma.conversation.create({
            data: {
                participants: {
                    connect: [{ id: user1Id }, { id: user2Id }],
                },
            },
            include: {
                messages: true,
            },
        });

        return newConversation;
    }),
    infiniteMessage: protectedProcedure
    .input(z.object({
      conversationId: z.string(),
      limit: z.number().optional(),
      cursor: z.object({
        id: z.string(),
        createdAt: z.date(),
      }).optional(),
    }))
    .query(async ({input: {limit = 10 , cursor, conversationId }, ctx }) => {

      const recentMessages = await ctx.prisma.conversation.findUnique({
        where: { id: conversationId },
      }).messages({
        take: limit + 1,
        cursor: cursor ? { id: cursor.id, createdAt: cursor.createdAt } : undefined,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        select: {
          id: true,
          content: true,
          createdAt: true,
          userId: true,
        },
      });

      if (recentMessages == null)
        return false;

      let nextCursor: typeof cursor | undefined;
      if (recentMessages.length > limit) {
        const nextItem = recentMessages.pop();
        if (nextItem != null) {
          nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
        }
      }

      if (recentMessages.length == 0)
        return [];
      
      return {
        messages: recentMessages.map((messages) => {
          return {
            id: messages.id,
            content: messages.content,
            createdAt: messages.createdAt,
            userId: messages.userId
          };
        }),
        nextCursor,
      };




    }),
    infiniteConversations: protectedProcedure
    .input(z.object({
      limit: z.number().optional(),
      cursor: z.object({
        id: z.string(),
        createdAt: z.date(),
      }).optional(),
    }))
    .query(async ({input: {limit = 10 , cursor }, ctx }) => {

      const userId = ctx.session.user.id;
      const recentConversations = await ctx.prisma.user.findUnique({
        where: { id: userId },
      }).conversations({
        take: limit + 1,
        cursor: cursor ? { id: cursor.id, createdAt: cursor.createdAt } : undefined,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        select: {
          id: true,
          participants: {
            select: {
              id: true,
              name: true,
              image: true,
            }
          },
          createdAt: true,
          messages: {
            take: 1,
            orderBy: {createdAt: 'desc'},
            select: {
              content: true,
              user: true
            }
          }
        },
      });

      if (recentConversations == null)
        return false;

      let nextCursor: typeof cursor | undefined;
      if (recentConversations.length > limit) {
        const nextItem = recentConversations.pop();
        if (nextItem != null) {
          nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
        }
      }

      if (recentConversations.length == 0)
        return [];
      
      return {
        conversations: recentConversations.map((conversation) => {
          return {
            conversationId: conversation.id,
            lastMessage: conversation.messages[0],
            createdAt: conversation.createdAt,
            participants: conversation.participants
          };
        }),
        nextCursor,
      };
    }),
    createMessage: protectedProcedure
    .input(z.object({
      conversationId: z.string(),
      content: z.string()
    }))
    .mutation(async ({input: {conversationId, content}, ctx}) => {
      
      const creatorId = ctx.session.user.id;
      const createdMessage = await ctx.prisma.message.create({
        data : {
          userId: creatorId,
          content,
          conversationId
        }
      });

      return createdMessage
    })
});
