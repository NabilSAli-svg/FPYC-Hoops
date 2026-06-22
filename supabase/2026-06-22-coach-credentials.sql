-- Coach credentials table with per-team passwords
CREATE TABLE IF NOT EXISTS coach_credentials (
  team_id     text PRIMARY KEY,
  password    text NOT NULL,
  team_name   text NOT NULL,
  updated_at  timestamptz DEFAULT now()
);

-- Seed with current passwords (skip if already exists)
INSERT INTO coach_credentials (team_id, password, team_name) VALUES
  ('23boys',   'nick2025',     'Rising 2nd-3rd Boys'),
  ('girls',    'girls2025',    'Girls 3v3 (2nd-8th)'),
  ('45boys',   'rising2025',   'Rising 4th-5th Boys'),
  ('68boys',   'rising682025', 'Rising 6th-8th Boys'),
  ('ts-ab5',   'aidris2025',   'Aidris B5'),
  ('ts-tb6',   'tom2025',      'Tom B6'),
  ('ts-mdg6',  'mikedo2025',   'Mike Do G6'),
  ('ts-eg7',   'earnest2025',  'Earnest G7'),
  ('ts-rb7',   'rene2025',     'Rene B7'),
  ('ts-mlb8',  'mikele2025',   'Mike Lee B8'),
  ('ts-kb82',  'keun2025',     'Keun B8-2')
ON CONFLICT (team_id) DO NOTHING;

-- Block all direct table access
ALTER TABLE coach_credentials ENABLE ROW LEVEL SECURITY;

-- RPC: verify password and return team_id + team_name (no password exposed)
CREATE OR REPLACE FUNCTION coach_login(p_password text)
RETURNS TABLE(team_id text, team_name text)
LANGUAGE sql SECURITY DEFINER
AS $$
  SELECT team_id, team_name
  FROM coach_credentials
  WHERE password = p_password
  LIMIT 1;
$$;

-- RPC: change password — requires correct old password to succeed
CREATE OR REPLACE FUNCTION coach_change_password(
  p_team_id    text,
  p_old_password text,
  p_new_password text
)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  IF length(trim(p_new_password)) < 6 THEN
    RETURN false;
  END IF;
  IF EXISTS (
    SELECT 1 FROM coach_credentials
    WHERE team_id = p_team_id AND password = p_old_password
  ) THEN
    UPDATE coach_credentials
    SET password = p_new_password, updated_at = now()
    WHERE team_id = p_team_id;
    RETURN true;
  END IF;
  RETURN false;
END;
$$;
