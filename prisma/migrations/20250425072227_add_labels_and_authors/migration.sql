/*
  Warnings:

  - Added the required column `authorId` to the `Issue` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Label" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#CCCCCC',
    "projectId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Label_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_IssueToLabel" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_IssueToLabel_A_fkey" FOREIGN KEY ("A") REFERENCES "Issue" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_IssueToLabel_B_fkey" FOREIGN KEY ("B") REFERENCES "Label" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Find or create a default user for existing issues
INSERT INTO "User" ("id", "name", "email")
SELECT 'default-user-id', 'System', 'system@example.com'
WHERE NOT EXISTS (SELECT 1 FROM "User" WHERE "id" = 'default-user-id');

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Issue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "projectId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL DEFAULT 'default-user-id',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Issue_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Issue_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Issue" ("createdAt", "description", "id", "projectId", "status", "title", "updatedAt") SELECT "createdAt", "description", "id", "projectId", "status", "title", "updatedAt" FROM "Issue";
DROP TABLE "Issue";
ALTER TABLE "new_Issue" RENAME TO "Issue";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_IssueToLabel_AB_unique" ON "_IssueToLabel"("A", "B");

-- CreateIndex
CREATE INDEX "_IssueToLabel_B_index" ON "_IssueToLabel"("B");
