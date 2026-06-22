-- Practice attendance and notes — persisted per coach/team
CREATE TABLE IF NOT EXISTS practice_attendance (
  practice_id  text        NOT NULL,
  player_id    text        NOT NULL,
  team_id      text        NOT NULL,
  present      boolean     NOT NULL DEFAULT false,
  updated_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (practice_id, player_id)
);

CREATE TABLE IF NOT EXISTS practice_notes (
  practice_id  text        PRIMARY KEY,
  team_id      text        NOT NULL,
  notes        text        NOT NULL DEFAULT '',
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- Open read/write for authenticated and anon (coach portal uses anon key)
ALTER TABLE practice_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_notes      ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow all attendance" ON practice_attendance FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow all notes"      ON practice_notes      FOR ALL USING (true) WITH CHECK (true);
