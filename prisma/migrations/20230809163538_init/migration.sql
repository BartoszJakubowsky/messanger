/*
  Warnings:

  - You are about to drop the `_conv` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `updatedAt` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Message` table. All the data in the column will be lost.
  - Added the required column `text` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_conv_B_index";

-- DropIndex
DROP INDEX "_conv_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_conv";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_Participant" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_Participant_A_fkey" FOREIGN KEY ("A") REFERENCES "Conversation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Participant_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Conversation" (
    "id" TEXT NOT NULL PRIMARY KEY
);
INSERT INTO "new_Conversation" ("id") SELECT "id" FROM "Conversation";
DROP TABLE "Conversation";
ALTER TABLE "new_Conversation" RENAME TO "Conversation";
CREATE TABLE "new_Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("conversationId", "createdAt", "id", "userId") SELECT "conversationId", "createdAt", "id", "userId" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_Participant_AB_unique" ON "_Participant"("A", "B");

-- CreateIndex
CREATE INDEX "_Participant_B_index" ON "_Participant"("B");
