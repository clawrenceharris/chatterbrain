-- CreateEnum
CREATE TYPE "PracticeLane" AS ENUM ('QUICK_ROUNDS', 'ENCOUNTERS', 'SKILL_DRILLS', 'GROUP_CHAT_LAB');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('GENTLE', 'REALISTIC', 'CHALLENGE', 'DIFFICULT');

-- CreateEnum
CREATE TYPE "ScenarioStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "EncounterStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "ConversationRole" AS ENUM ('USER', 'ACTOR');

-- CreateEnum
CREATE TYPE "HelperId" AS ENUM ('TONE_SPECTRUM', 'X_RAY', 'REPHRASER', 'RESPONSE_BUILDER', 'CUE_DETECTOR');

-- CreateEnum
CREATE TYPE "SocialSkill" AS ENUM ('EMPATHY', 'ASSERTIVENESS', 'CLARITY', 'ENGAGEMENT', 'SOCIAL_AWARENESS', 'SETTING_BOUNDARIES', 'REPAIR', 'CUE_RECOGNITION', 'SMALL_TALK', 'CONFLICT_NAVIGATION', 'EMOTIONAL_RECOGNITION', 'RELEVANCE', 'TONE_AWARENESS', 'FOLLOW_UP', 'CONVERSATION_FLOW', 'SOCIAL_TIMING', 'PERSPECTIVE_TAKING');

-- CreateEnum
CREATE TYPE "ReviewItemType" AS ENUM ('STRENGTH', 'GROWTH_AREA');

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Actor" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "voiceId" TEXT NOT NULL,
    "personalityTraits" TEXT[],
    "communicationStyle" TEXT,
    "avatarUrl" TEXT,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Actor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Encounter" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "status" "EncounterStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "actorId" TEXT NOT NULL,
    "variableValues" JSONB,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "abandonedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Encounter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationTurn" (
    "id" TEXT NOT NULL,
    "encounterId" TEXT NOT NULL,
    "role" "ConversationRole" NOT NULL,
    "speakerId" TEXT,
    "speakerName" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversationTurn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HelperUse" (
    "id" TEXT NOT NULL,
    "encounterId" TEXT NOT NULL,
    "targetTurnId" TEXT,
    "helperId" "HelperId" NOT NULL,
    "inputText" TEXT,
    "outputText" TEXT,
    "result" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HelperUse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EncounterReview" (
    "id" TEXT NOT NULL,
    "encounterId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "retryMoment" JSONB,
    "skillScores" JSONB NOT NULL,
    "unlockedBadgeIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EncounterReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EncounterReviewItem" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "type" "ReviewItemType" NOT NULL,
    "criterion" "SocialSkill" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "evidenceId" TEXT NOT NULL,
    "suggestion" TEXT,
    "xpEarned" INTEGER NOT NULL DEFAULT 10,
    "confidence" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EncounterReviewItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScenarioDomain" (
    "scenarioId" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,

    CONSTRAINT "ScenarioDomain_pkey" PRIMARY KEY ("scenarioId","domainId")
);

-- CreateTable
CREATE TABLE "Domain" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "imageUrl" TEXT,
    "backgroundImageUrl" TEXT,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchHistory" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SearchHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScenarioLike" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScenarioLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScenarioSave" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScenarioSave_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scenario" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT,
    "status" "ScenarioStatus" NOT NULL DEFAULT 'DRAFT',
    "description" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "defaultActorId" TEXT,
    "actorRelationshipType" TEXT NOT NULL,
    "actorRole" TEXT NOT NULL,
    "tags" TEXT[],
    "focusSkills" "SocialSkill"[],
    "sampleConversation" JSONB,
    "setting" TEXT NOT NULL,
    "userRole" TEXT,
    "userGoal" TEXT NOT NULL,
    "openingMessage" TEXT,
    "successCriteria" JSONB NOT NULL,
    "variables" JSONB,
    "contentWarnings" TEXT[],
    "xpReward" INTEGER NOT NULL DEFAULT 50,
    "supportNote" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "imageUrl" TEXT,
    "actorBackgroundImageUrl" TEXT,
    "primaryDomainId" TEXT NOT NULL,
    "secondaryDomainId" TEXT,

    CONSTRAINT "Scenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScenarioRecommendation" (
    "id" TEXT NOT NULL,
    "sourceScenarioId" TEXT NOT NULL,
    "targetScenarioId" TEXT NOT NULL,
    "reason" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScenarioRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RelatedDomains" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RelatedDomains_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Actor_slug_key" ON "Actor"("slug");

-- CreateIndex
CREATE INDEX "Actor_slug_idx" ON "Actor"("slug");

-- CreateIndex
CREATE INDEX "Encounter_userId_idx" ON "Encounter"("userId");

-- CreateIndex
CREATE INDEX "Encounter_scenarioId_idx" ON "Encounter"("scenarioId");

-- CreateIndex
CREATE INDEX "Encounter_status_idx" ON "Encounter"("status");

-- CreateIndex
CREATE INDEX "Encounter_actorId_idx" ON "Encounter"("actorId");

-- CreateIndex
CREATE INDEX "Encounter_startedAt_idx" ON "Encounter"("startedAt");

-- CreateIndex
CREATE INDEX "ConversationTurn_encounterId_idx" ON "ConversationTurn"("encounterId");

-- CreateIndex
CREATE INDEX "ConversationTurn_role_idx" ON "ConversationTurn"("role");

-- CreateIndex
CREATE INDEX "ConversationTurn_createdAt_idx" ON "ConversationTurn"("createdAt");

-- CreateIndex
CREATE INDEX "HelperUse_encounterId_idx" ON "HelperUse"("encounterId");

-- CreateIndex
CREATE INDEX "HelperUse_targetTurnId_idx" ON "HelperUse"("targetTurnId");

-- CreateIndex
CREATE INDEX "HelperUse_helperId_idx" ON "HelperUse"("helperId");

-- CreateIndex
CREATE UNIQUE INDEX "EncounterReview_encounterId_key" ON "EncounterReview"("encounterId");

-- CreateIndex
CREATE INDEX "EncounterReview_encounterId_idx" ON "EncounterReview"("encounterId");

-- CreateIndex
CREATE INDEX "EncounterReviewItem_reviewId_idx" ON "EncounterReviewItem"("reviewId");

-- CreateIndex
CREATE INDEX "EncounterReviewItem_type_idx" ON "EncounterReviewItem"("type");

-- CreateIndex
CREATE INDEX "EncounterReviewItem_evidenceId_idx" ON "EncounterReviewItem"("evidenceId");

-- CreateIndex
CREATE INDEX "EncounterReviewItem_criterion_idx" ON "EncounterReviewItem"("criterion");

-- CreateIndex
CREATE INDEX "ScenarioDomain_domainId_idx" ON "ScenarioDomain"("domainId");

-- CreateIndex
CREATE INDEX "ScenarioDomain_scenarioId_idx" ON "ScenarioDomain"("scenarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Domain_slug_key" ON "Domain"("slug");

-- CreateIndex
CREATE INDEX "SearchHistory_query_idx" ON "SearchHistory"("query");

-- CreateIndex
CREATE INDEX "SearchHistory_createdAt_idx" ON "SearchHistory"("createdAt");

-- CreateIndex
CREATE INDEX "ScenarioLike_userId_idx" ON "ScenarioLike"("userId");

-- CreateIndex
CREATE INDEX "ScenarioLike_scenarioId_idx" ON "ScenarioLike"("scenarioId");

-- CreateIndex
CREATE UNIQUE INDEX "ScenarioLike_userId_scenarioId_key" ON "ScenarioLike"("userId", "scenarioId");

-- CreateIndex
CREATE INDEX "ScenarioSave_userId_idx" ON "ScenarioSave"("userId");

-- CreateIndex
CREATE INDEX "ScenarioSave_scenarioId_idx" ON "ScenarioSave"("scenarioId");

-- CreateIndex
CREATE UNIQUE INDEX "ScenarioSave_userId_scenarioId_key" ON "ScenarioSave"("userId", "scenarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Scenario_slug_key" ON "Scenario"("slug");

-- CreateIndex
CREATE INDEX "Scenario_primaryDomainId_idx" ON "Scenario"("primaryDomainId");

-- CreateIndex
CREATE INDEX "Scenario_secondaryDomainId_idx" ON "Scenario"("secondaryDomainId");

-- CreateIndex
CREATE INDEX "Scenario_createdById_idx" ON "Scenario"("createdById");

-- CreateIndex
CREATE INDEX "Scenario_createdAt_idx" ON "Scenario"("createdAt");

-- CreateIndex
CREATE INDEX "Scenario_difficulty_idx" ON "Scenario"("difficulty");

-- CreateIndex
CREATE INDEX "Scenario_status_idx" ON "Scenario"("status");

-- CreateIndex
CREATE INDEX "Scenario_defaultActorId_idx" ON "Scenario"("defaultActorId");

-- CreateIndex
CREATE INDEX "ScenarioRecommendation_sourceScenarioId_idx" ON "ScenarioRecommendation"("sourceScenarioId");

-- CreateIndex
CREATE INDEX "ScenarioRecommendation_targetScenarioId_idx" ON "ScenarioRecommendation"("targetScenarioId");

-- CreateIndex
CREATE UNIQUE INDEX "ScenarioRecommendation_sourceScenarioId_targetScenarioId_key" ON "ScenarioRecommendation"("sourceScenarioId", "targetScenarioId");

-- CreateIndex
CREATE INDEX "_RelatedDomains_B_index" ON "_RelatedDomains"("B");

-- AddForeignKey
ALTER TABLE "Encounter" ADD CONSTRAINT "Encounter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encounter" ADD CONSTRAINT "Encounter_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encounter" ADD CONSTRAINT "Encounter_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationTurn" ADD CONSTRAINT "ConversationTurn_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "Encounter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HelperUse" ADD CONSTRAINT "HelperUse_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "Encounter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HelperUse" ADD CONSTRAINT "HelperUse_targetTurnId_fkey" FOREIGN KEY ("targetTurnId") REFERENCES "ConversationTurn"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EncounterReview" ADD CONSTRAINT "EncounterReview_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "Encounter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EncounterReviewItem" ADD CONSTRAINT "EncounterReviewItem_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "EncounterReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EncounterReviewItem" ADD CONSTRAINT "EncounterReviewItem_evidenceId_fkey" FOREIGN KEY ("evidenceId") REFERENCES "ConversationTurn"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScenarioDomain" ADD CONSTRAINT "ScenarioDomain_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScenarioDomain" ADD CONSTRAINT "ScenarioDomain_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScenarioLike" ADD CONSTRAINT "ScenarioLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScenarioLike" ADD CONSTRAINT "ScenarioLike_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScenarioSave" ADD CONSTRAINT "ScenarioSave_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScenarioSave" ADD CONSTRAINT "ScenarioSave_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scenario" ADD CONSTRAINT "Scenario_defaultActorId_fkey" FOREIGN KEY ("defaultActorId") REFERENCES "Actor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scenario" ADD CONSTRAINT "Scenario_primaryDomainId_fkey" FOREIGN KEY ("primaryDomainId") REFERENCES "Domain"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scenario" ADD CONSTRAINT "Scenario_secondaryDomainId_fkey" FOREIGN KEY ("secondaryDomainId") REFERENCES "Domain"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScenarioRecommendation" ADD CONSTRAINT "ScenarioRecommendation_sourceScenarioId_fkey" FOREIGN KEY ("sourceScenarioId") REFERENCES "Scenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScenarioRecommendation" ADD CONSTRAINT "ScenarioRecommendation_targetScenarioId_fkey" FOREIGN KEY ("targetScenarioId") REFERENCES "Scenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RelatedDomains" ADD CONSTRAINT "_RelatedDomains_A_fkey" FOREIGN KEY ("A") REFERENCES "Domain"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RelatedDomains" ADD CONSTRAINT "_RelatedDomains_B_fkey" FOREIGN KEY ("B") REFERENCES "Domain"("id") ON DELETE CASCADE ON UPDATE CASCADE;
