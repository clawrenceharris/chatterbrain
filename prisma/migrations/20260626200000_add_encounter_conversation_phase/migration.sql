-- AlterTable
ALTER TABLE "Encounter" ADD COLUMN "conversationPhase" TEXT;

-- AlterTable
ALTER TABLE "ConversationTurn" ADD COLUMN "phase" TEXT;
