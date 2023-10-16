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
    
    getConversation: protectedProcedure
    .input(z.object({convUserId: z.string()}))
    .query(async ({input: {convUserId}, ctx }) => {
       
      const userId = ctx.session.user.id;

      const user1Id = ctx.session?.user.id;
      const user2Id = convUserId;


      const userConversation = await ctx.prisma.user.findUnique({
        where: {
          id: userId
        }}).conversations({
        where: {
          AND: [
              { participants: { some: { id: user1Id } } },
              { participants: { some: { id: user2Id } } },
          ],
        },
        })
        
        if (userConversation)
        {
          if (userConversation[0]?.id && userConversation[0].id !== undefined)
            return userConversation[0].id; 
        }
        // Create a new conversation with empty messages array
        const newConversation = await prisma.conversation.create({
            data: {
                participants: {
                    connect: [{ id: user1Id }, { id: user2Id }],
                },
            },
            include: {
                messages: true,
                participants: true
            },
        });

        return newConversation.id;
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
    .query(async ({input: {limit = 20 , cursor, conversationId }, ctx }) => {

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
        return [];

      let nextCursor: typeof cursor | undefined;
      if (recentMessages.length > limit) {
        const nextItem = recentMessages.pop();
        if (nextItem != null) {
          nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
        }
      }

      if (recentMessages.length == 0)
        return false;
      
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
        return [];

      let nextCursor: typeof cursor | undefined;
      if (recentConversations.length > limit) {
        const nextItem = recentConversations.pop();
        if (nextItem != null) {
          nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
        }
      }

      if (recentConversations.length == 0)
        return false;
      
      return {
        conversations: recentConversations.map((conversation) => {
          return {
            id: conversation.id,
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
    }),
    matchConversation: protectedProcedure
    .input(z.object({userInConv: z.string()}))
    .query(async ({input: {userInConv }, ctx }) => {

      if (userInConv == '')
        return [];

      const userId = ctx.session.user.id;
    
      const matchedConversations = await ctx.prisma.user.findUnique({
        where: {
          id: userId
        }
      }).conversations({
        where: {
          participants: {
            some: {
              OR: [
                {
                  name: {
                    contains: userInConv,
                  },
                },
                {
                  name: {
                    equals: userInConv,
                  },
                },
              ],
            },
          },
        },
        select: {
          id: true,
          participants: true,
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            select: {
              content: true,
              user: true,
            },
          },
        },
      })

      return matchedConversations?.map(conversation => {
        return {
          id: conversation.id,
          lastMessage: conversation.messages[0],
          participants: conversation.participants
        }
      })
    }),
    // example input
    // uploadFiles: protectedProcedure
    // .input(z.object({name: z.string()}))
    // .mutation(async ({input: {name}, ctx}) => {

    // })

});
