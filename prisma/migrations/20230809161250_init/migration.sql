/*
  Warnings:

  - You are about to drop the `_ConversationToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ConversationToUser";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_conv" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_conv_A_fkey" FOREIGN KEY ("A") REFERENCES "Conversation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_conv_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_conv_AB_unique" ON "_conv"("A", "B");

-- CreateIndex
CREATE INDEX "_conv_B_index" ON "_conv"("B");
