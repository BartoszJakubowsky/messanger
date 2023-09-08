/* eslint-disable @typescript-eslint/no-floating-promises */

import { object, z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const userRouter = createTRPCRouter({
    updateUser: protectedProcedure
    .input(z.object({ name: z.string(), description: z.string() }))
    .mutation(async ({ input: { name, description }, ctx }) => {

        const userId = ctx.session.user.id;

        const updatedUser = ctx.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                name,
                description
            }
        })

        return updatedUser
    }),
    deleteUser: protectedProcedure
    .mutation(async ({ ctx }) => {
        const userId = ctx.session.user.id;

        const deleteUser = await ctx.prisma.user.delete({
            where: {
                id: userId
            }
        })

        return deleteUser;
    }),
    matchedUsers: protectedProcedure
    .input(z.object({ content: z.string() }))
    .query(async ({ input: { content }, ctx }) => {

      const userId = ctx.session.user.id;

      if (content === '')
      return await ctx.prisma.user.findMany({
        where: {
          NOT: {
            id: userId
          }
        }
      });

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
});
