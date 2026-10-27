-- =============================================================================
-- Chatterbrain RLS policies (Supabase)
-- =============================================================================
-- Assumes:
--   1. Tables match prisma/schema.prisma @@map names (snake_case).
--   2. Columns are Prisma defaults (quoted camelCase).
--   3. auth.users.id (uuid) == user_profiles."userId" / encounters."userId" /
--      scenarios."createdById" / likes+saves."userId" (text).
--
-- How to apply: Supabase SQL Editor → paste → Run.
-- Verify tables first:  select tablename from pg_tables where schemaname = 'public';
-- If you still have PascalCase migration names ("UserProfile"), rename below.
--
-- Note: Prisma via the postgres/service connection bypasses RLS. These policies
-- protect the Supabase Data API (anon / authenticated keys).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.current_user_id()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT auth.uid()::text;
$$;

-- SECURITY DEFINER so child-table policies can check encounter ownership
-- without fighting RLS recursion on encounters.
CREATE OR REPLACE FUNCTION public.owns_encounter(p_encounter_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.encounters e
    WHERE e.id = p_encounter_id
      AND e."userId" = auth.uid()::text
  );
$$;

CREATE OR REPLACE FUNCTION public.owns_encounter_review(p_review_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.encounter_reviews er
    JOIN public.encounters e ON e.id = er."encounterId"
    WHERE er.id = p_review_id
      AND e."userId" = auth.uid()::text
  );
$$;

CREATE OR REPLACE FUNCTION public.can_read_scenario(p_scenario_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.scenarios s
    WHERE s.id = p_scenario_id
      AND (
        s.status = 'PUBLISHED'
        OR s."createdById" = auth.uid()::text
      )
  );
$$;

CREATE OR REPLACE FUNCTION public.owns_scenario(p_scenario_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.scenarios s
    WHERE s.id = p_scenario_id
      AND s."createdById" = auth.uid()::text
  );
$$;

REVOKE ALL ON FUNCTION public.current_user_id() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.owns_encounter(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.owns_encounter_review(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.can_read_scenario(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.owns_scenario(text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.current_user_id() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.owns_encounter(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.owns_encounter_review(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.can_read_scenario(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.owns_scenario(text) TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- Enable RLS on every app table
-- ---------------------------------------------------------------------------

ALTER TABLE public.user_profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.actors                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domains                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenarios                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenario_domains         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenario_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenario_likes           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenario_saves           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.encounters               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_turns       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.helper_uses              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.encounter_reviews        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.encounter_review_items   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_histories         ENABLE ROW LEVEL SECURITY;

-- Optional Prisma M2M join (present if relatedDomains is used)
DO $$
BEGIN
  IF to_regclass('public._RelatedDomains') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public."_RelatedDomains" ENABLE ROW LEVEL SECURITY';
  END IF;
END $$;

-- =============================================================================
-- CATALOG (public-ish content)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- actors
-- Reason: NPCs are product catalog. Anyone can browse/search them; only
-- backend/service role should create or edit them.
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS actors_select_all ON public.actors;
DROP POLICY IF EXISTS actors_no_client_writes ON public.actors;

CREATE POLICY actors_select_all
  ON public.actors
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- No INSERT/UPDATE/DELETE policies → client roles cannot mutate.

-- ---------------------------------------------------------------------------
-- domains
-- Reason: Category taxonomy is public catalog content; mutations are admin-only.
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS domains_select_all ON public.domains;
CREATE POLICY domains_select_all
  ON public.domains
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- ---------------------------------------------------------------------------
-- scenarios
-- Reason: Published scenarios are the product surface. Drafts/archived stay
-- private to the creator (createdById). Creators manage their own rows.
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS scenarios_select_published_or_own ON public.scenarios;
DROP POLICY IF EXISTS scenarios_insert_own ON public.scenarios;
DROP POLICY IF EXISTS scenarios_update_own ON public.scenarios;
DROP POLICY IF EXISTS scenarios_delete_own ON public.scenarios;

CREATE POLICY scenarios_select_published_or_own
  ON public.scenarios
  FOR SELECT
  TO anon, authenticated
  USING (
    status = 'PUBLISHED'
    OR "createdById" = public.current_user_id()
  );

CREATE POLICY scenarios_insert_own
  ON public.scenarios
  FOR INSERT
  TO authenticated
  WITH CHECK ("createdById" = public.current_user_id());

CREATE POLICY scenarios_update_own
  ON public.scenarios
  FOR UPDATE
  TO authenticated
  USING ("createdById" = public.current_user_id())
  WITH CHECK ("createdById" = public.current_user_id());

CREATE POLICY scenarios_delete_own
  ON public.scenarios
  FOR DELETE
  TO authenticated
  USING ("createdById" = public.current_user_id());

-- ---------------------------------------------------------------------------
-- scenario_domains
-- Reason: Join rows follow parent scenario visibility; only owner can attach
-- domains to their scenario.
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS scenario_domains_select_readable ON public.scenario_domains;
DROP POLICY IF EXISTS scenario_domains_insert_own_scenario ON public.scenario_domains;
DROP POLICY IF EXISTS scenario_domains_delete_own_scenario ON public.scenario_domains;

CREATE POLICY scenario_domains_select_readable
  ON public.scenario_domains
  FOR SELECT
  TO anon, authenticated
  USING (public.can_read_scenario("scenarioId"));

CREATE POLICY scenario_domains_insert_own_scenario
  ON public.scenario_domains
  FOR INSERT
  TO authenticated
  WITH CHECK (public.owns_scenario("scenarioId"));

CREATE POLICY scenario_domains_delete_own_scenario
  ON public.scenario_domains
  FOR DELETE
  TO authenticated
  USING (public.owns_scenario("scenarioId"));

-- ---------------------------------------------------------------------------
-- scenario_recommendations
-- Reason: Recs are curated catalog edges. Readable when the source scenario is
-- readable; no client writes (seeded / admin via service role).
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS scenario_recommendations_select_readable ON public.scenario_recommendations;

CREATE POLICY scenario_recommendations_select_readable
  ON public.scenario_recommendations
  FOR SELECT
  TO anon, authenticated
  USING (public.can_read_scenario("sourceScenarioId"));

-- ---------------------------------------------------------------------------
-- _RelatedDomains (Prisma implicit M2M)
-- Reason: Domain graph is public taxonomy metadata.
-- ---------------------------------------------------------------------------

DO $$
BEGIN
  IF to_regclass('public._RelatedDomains') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS related_domains_select_all ON public."_RelatedDomains"';
    EXECUTE $p$
      CREATE POLICY related_domains_select_all
        ON public."_RelatedDomains"
        FOR SELECT
        TO anon, authenticated
        USING (true)
    $p$;
  END IF;
END $$;

-- =============================================================================
-- USER IDENTITY / SOCIAL
-- =============================================================================

-- ---------------------------------------------------------------------------
-- user_profiles
-- Reason: Profiles are discoverable (people search uses displayName/username).
-- Authenticated users may read profiles; only the owner may write their row.
-- Column-level hiding of birthday/etc. needs a view if you want that later.
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS user_profiles_select_authenticated ON public.user_profiles;
DROP POLICY IF EXISTS user_profiles_insert_own ON public.user_profiles;
DROP POLICY IF EXISTS user_profiles_update_own ON public.user_profiles;
DROP POLICY IF EXISTS user_profiles_delete_own ON public.user_profiles;

CREATE POLICY user_profiles_select_authenticated
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY user_profiles_insert_own
  ON public.user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK ("userId" = public.current_user_id());

CREATE POLICY user_profiles_update_own
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING ("userId" = public.current_user_id())
  WITH CHECK ("userId" = public.current_user_id());

CREATE POLICY user_profiles_delete_own
  ON public.user_profiles
  FOR DELETE
  TO authenticated
  USING ("userId" = public.current_user_id());

-- =============================================================================
-- USER LIBRARY
-- =============================================================================

-- ---------------------------------------------------------------------------
-- scenario_likes / scenario_saves
-- Reason: Counts are part of the scenario social surface (anyone can see how
-- many likes/saves a scenario has). Mutations stay owner-only so users can
-- only like/save as themselves.
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS scenario_likes_select_own ON public.scenario_likes;
DROP POLICY IF EXISTS scenario_likes_select_all ON public.scenario_likes;
DROP POLICY IF EXISTS scenario_likes_insert_own ON public.scenario_likes;
DROP POLICY IF EXISTS scenario_likes_delete_own ON public.scenario_likes;

CREATE POLICY scenario_likes_select_all
  ON public.scenario_likes
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY scenario_likes_insert_own
  ON public.scenario_likes
  FOR INSERT
  TO authenticated
  WITH CHECK ("userId" = public.current_user_id());

CREATE POLICY scenario_likes_delete_own
  ON public.scenario_likes
  FOR DELETE
  TO authenticated
  USING ("userId" = public.current_user_id());

DROP POLICY IF EXISTS scenario_saves_select_own ON public.scenario_saves;
DROP POLICY IF EXISTS scenario_saves_select_all ON public.scenario_saves;
DROP POLICY IF EXISTS scenario_saves_insert_own ON public.scenario_saves;
DROP POLICY IF EXISTS scenario_saves_delete_own ON public.scenario_saves;

CREATE POLICY scenario_saves_select_all
  ON public.scenario_saves
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY scenario_saves_insert_own
  ON public.scenario_saves
  FOR INSERT
  TO authenticated
  WITH CHECK ("userId" = public.current_user_id());

CREATE POLICY scenario_saves_delete_own
  ON public.scenario_saves
  FOR DELETE
  TO authenticated
  USING ("userId" = public.current_user_id());

-- =============================================================================
-- ENCOUNTER SESSION DATA (private to the practicing user)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- encounters
-- Reason: Practice runs are private progress data keyed by userId.
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS encounters_select_own ON public.encounters;
DROP POLICY IF EXISTS encounters_insert_own ON public.encounters;
DROP POLICY IF EXISTS encounters_update_own ON public.encounters;
DROP POLICY IF EXISTS encounters_delete_own ON public.encounters;

CREATE POLICY encounters_select_own
  ON public.encounters
  FOR SELECT
  TO authenticated
  USING ("userId" = public.current_user_id());

CREATE POLICY encounters_insert_own
  ON public.encounters
  FOR INSERT
  TO authenticated
  WITH CHECK ("userId" = public.current_user_id());

CREATE POLICY encounters_update_own
  ON public.encounters
  FOR UPDATE
  TO authenticated
  USING ("userId" = public.current_user_id())
  WITH CHECK ("userId" = public.current_user_id());

CREATE POLICY encounters_delete_own
  ON public.encounters
  FOR DELETE
  TO authenticated
  USING ("userId" = public.current_user_id());

-- ---------------------------------------------------------------------------
-- conversation_turns
-- Reason: Chat transcripts belong to the encounter owner only.
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS conversation_turns_select_own ON public.conversation_turns;
DROP POLICY IF EXISTS conversation_turns_insert_own ON public.conversation_turns;
DROP POLICY IF EXISTS conversation_turns_update_own ON public.conversation_turns;
DROP POLICY IF EXISTS conversation_turns_delete_own ON public.conversation_turns;

CREATE POLICY conversation_turns_select_own
  ON public.conversation_turns
  FOR SELECT
  TO authenticated
  USING (public.owns_encounter("encounterId"));

CREATE POLICY conversation_turns_insert_own
  ON public.conversation_turns
  FOR INSERT
  TO authenticated
  WITH CHECK (public.owns_encounter("encounterId"));

CREATE POLICY conversation_turns_update_own
  ON public.conversation_turns
  FOR UPDATE
  TO authenticated
  USING (public.owns_encounter("encounterId"))
  WITH CHECK (public.owns_encounter("encounterId"));

CREATE POLICY conversation_turns_delete_own
  ON public.conversation_turns
  FOR DELETE
  TO authenticated
  USING (public.owns_encounter("encounterId"));

-- ---------------------------------------------------------------------------
-- helper_uses
-- Reason: Helper tool usage is session telemetry owned by the encounter user.
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS helper_uses_select_own ON public.helper_uses;
DROP POLICY IF EXISTS helper_uses_insert_own ON public.helper_uses;
DROP POLICY IF EXISTS helper_uses_delete_own ON public.helper_uses;

CREATE POLICY helper_uses_select_own
  ON public.helper_uses
  FOR SELECT
  TO authenticated
  USING (public.owns_encounter("encounterId"));

CREATE POLICY helper_uses_insert_own
  ON public.helper_uses
  FOR INSERT
  TO authenticated
  WITH CHECK (public.owns_encounter("encounterId"));

CREATE POLICY helper_uses_delete_own
  ON public.helper_uses
  FOR DELETE
  TO authenticated
  USING (public.owns_encounter("encounterId"));

-- ---------------------------------------------------------------------------
-- encounter_reviews
-- Reason: Post-session coaching feedback is private to the encounter owner.
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS encounter_reviews_select_own ON public.encounter_reviews;
DROP POLICY IF EXISTS encounter_reviews_insert_own ON public.encounter_reviews;
DROP POLICY IF EXISTS encounter_reviews_update_own ON public.encounter_reviews;
DROP POLICY IF EXISTS encounter_reviews_delete_own ON public.encounter_reviews;

CREATE POLICY encounter_reviews_select_own
  ON public.encounter_reviews
  FOR SELECT
  TO authenticated
  USING (public.owns_encounter("encounterId"));

CREATE POLICY encounter_reviews_insert_own
  ON public.encounter_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (public.owns_encounter("encounterId"));

CREATE POLICY encounter_reviews_update_own
  ON public.encounter_reviews
  FOR UPDATE
  TO authenticated
  USING (public.owns_encounter("encounterId"))
  WITH CHECK (public.owns_encounter("encounterId"));

CREATE POLICY encounter_reviews_delete_own
  ON public.encounter_reviews
  FOR DELETE
  TO authenticated
  USING (public.owns_encounter("encounterId"));

-- ---------------------------------------------------------------------------
-- encounter_review_items
-- Reason: Review line-items inherit privacy from the parent review/encounter.
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS encounter_review_items_select_own ON public.encounter_review_items;
DROP POLICY IF EXISTS encounter_review_items_insert_own ON public.encounter_review_items;
DROP POLICY IF EXISTS encounter_review_items_delete_own ON public.encounter_review_items;

CREATE POLICY encounter_review_items_select_own
  ON public.encounter_review_items
  FOR SELECT
  TO authenticated
  USING (public.owns_encounter_review("reviewId"));

CREATE POLICY encounter_review_items_insert_own
  ON public.encounter_review_items
  FOR INSERT
  TO authenticated
  WITH CHECK (public.owns_encounter_review("reviewId"));

CREATE POLICY encounter_review_items_delete_own
  ON public.encounter_review_items
  FOR DELETE
  TO authenticated
  USING (public.owns_encounter_review("reviewId"));

-- =============================================================================
-- search_histories
-- Reason: Table has no userId, so per-user ownership is impossible. Lock down
-- client access entirely until you add "userId" and re-policy. Service role /
-- Prisma continue to work.
-- =============================================================================

-- RLS enabled above with zero policies for anon/authenticated → deny by default.

-- Suggested follow-up schema change:
--   ALTER TABLE search_histories ADD COLUMN "userId" text REFERENCES ...;
-- Then policies like likes/saves (own-row only).

-- =============================================================================
-- Grants (Supabase Data API roles)
-- RLS still filters rows; grants only open the door.
-- =============================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT ON public.actors, public.domains, public.scenarios,
  public.scenario_domains, public.scenario_recommendations
  TO anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_profiles TO authenticated;
GRANT SELECT ON public.scenario_likes, public.scenario_saves TO anon, authenticated;
GRANT INSERT, DELETE ON public.scenario_likes, public.scenario_saves TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.encounters TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.conversation_turns TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.helper_uses TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.encounter_reviews TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.encounter_review_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scenarios TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.scenario_domains TO authenticated;

-- Explicitly no grants on search_histories for anon/authenticated.
REVOKE ALL ON public.search_histories FROM anon, authenticated;
