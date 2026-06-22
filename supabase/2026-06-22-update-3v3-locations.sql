-- Update all 3v3 Summer Cup games with correct location
UPDATE games
SET location = 'Providence Elementary School'
WHERE id IN ('g231','g232','g233','g234','g235','g236',
             'gg1','gg2','gg3','gg4','gg5','gg6',
             'g451','g452','g453','g454','g455','g456',
             'g681','g682','g683','g684','g685','g686');

-- Mark Week 1 (June 16/18) as final — already played
UPDATE games SET status = 'final', us = 0, them = 0
WHERE id IN ('g231','gg1','g451','g681');

-- Seed any missing games that aren't in Supabase yet
INSERT INTO games (id, status, month, date, weekday, day, time, opponent, location, home, team) VALUES
  ('g231','final',  'Jun',16,'Tue','Tue, Jun 16','6:30 PM - 7:30 PM','Week 1: Opening Night Tournament','Providence Elementary School',true,'Rising 2nd-3rd Boys'),
  ('g232','scheduled','Jun',23,'Tue','Tue, Jun 23','6:30 PM - 7:30 PM','Week 2: King of the Court',        'Providence Elementary School',true,'Rising 2nd-3rd Boys'),
  ('g233','scheduled','Jun',30,'Tue','Tue, Jun 30','6:30 PM - 7:30 PM','Week 3: World Cup Night',           'Providence Elementary School',true,'Rising 2nd-3rd Boys'),
  ('g234','scheduled','Jul', 7,'Tue','Tue, Jul 7', '6:30 PM - 7:30 PM','Week 4: Rivalry Night',             'Providence Elementary School',true,'Rising 2nd-3rd Boys'),
  ('g235','scheduled','Jul',14,'Tue','Tue, Jul 14','6:30 PM - 7:30 PM','Week 5: All-Star Challenge',        'Providence Elementary School',true,'Rising 2nd-3rd Boys'),
  ('g236','scheduled','Jul',21,'Tue','Tue, Jul 21','6:30 PM - 7:30 PM','Week 6: Summer Cup Finals',         'Providence Elementary School',true,'Rising 2nd-3rd Boys'),
  ('gg1', 'final',  'Jun',16,'Tue','Tue, Jun 16','7:30 PM - 8:30 PM','Week 1: Opening Night Tournament','Providence Elementary School',true,'Girls 3v3 (2nd-8th)'),
  ('gg2', 'scheduled','Jun',23,'Tue','Tue, Jun 23','7:30 PM - 8:30 PM','Week 2: King of the Court',        'Providence Elementary School',true,'Girls 3v3 (2nd-8th)'),
  ('gg3', 'scheduled','Jun',30,'Tue','Tue, Jun 30','7:30 PM - 8:30 PM','Week 3: World Cup Night',           'Providence Elementary School',true,'Girls 3v3 (2nd-8th)'),
  ('gg4', 'scheduled','Jul', 7,'Tue','Tue, Jul 7', '7:30 PM - 8:30 PM','Week 4: Rivalry Night',             'Providence Elementary School',true,'Girls 3v3 (2nd-8th)'),
  ('gg5', 'scheduled','Jul',14,'Tue','Tue, Jul 14','7:30 PM - 8:30 PM','Week 5: All-Star Challenge',        'Providence Elementary School',true,'Girls 3v3 (2nd-8th)'),
  ('gg6', 'scheduled','Jul',21,'Tue','Tue, Jul 21','7:30 PM - 8:30 PM','Week 6: Summer Cup Finals',         'Providence Elementary School',true,'Girls 3v3 (2nd-8th)'),
  ('g451','final',  'Jun',18,'Thu','Thu, Jun 18','6:30 PM - 7:30 PM','Week 1: Opening Night Tournament','Providence Elementary School',true,'Rising 4th-5th Boys'),
  ('g452','scheduled','Jun',25,'Thu','Thu, Jun 25','6:30 PM - 7:30 PM','Week 2: King of the Court',        'Providence Elementary School',true,'Rising 4th-5th Boys'),
  ('g453','scheduled','Jul', 2,'Thu','Thu, Jul 2', '6:30 PM - 7:30 PM','Week 3: World Cup Night',           'Providence Elementary School',true,'Rising 4th-5th Boys'),
  ('g454','scheduled','Jul', 9,'Thu','Thu, Jul 9', '6:30 PM - 7:30 PM','Week 4: Rivalry Night',             'Providence Elementary School',true,'Rising 4th-5th Boys'),
  ('g455','scheduled','Jul',16,'Thu','Thu, Jul 16','6:30 PM - 7:30 PM','Week 5: All-Star Challenge',        'Providence Elementary School',true,'Rising 4th-5th Boys'),
  ('g456','scheduled','Jul',23,'Thu','Thu, Jul 23','6:30 PM - 7:30 PM','Week 6: Summer Cup Finals',         'Providence Elementary School',true,'Rising 4th-5th Boys'),
  ('g681','final',  'Jun',18,'Thu','Thu, Jun 18','7:30 PM - 9:00 PM','Week 1: Opening Night Tournament','Providence Elementary School',true,'Rising 6th-8th Boys'),
  ('g682','scheduled','Jun',25,'Thu','Thu, Jun 25','7:30 PM - 9:00 PM','Week 2: King of the Court',        'Providence Elementary School',true,'Rising 6th-8th Boys'),
  ('g683','scheduled','Jul', 2,'Thu','Thu, Jul 2', '7:30 PM - 9:00 PM','Week 3: World Cup Night',           'Providence Elementary School',true,'Rising 6th-8th Boys'),
  ('g684','scheduled','Jul', 9,'Thu','Thu, Jul 9', '7:30 PM - 9:00 PM','Week 4: Rivalry Night',             'Providence Elementary School',true,'Rising 6th-8th Boys'),
  ('g685','scheduled','Jul',16,'Thu','Thu, Jul 16','7:30 PM - 9:00 PM','Week 5: All-Star Challenge',        'Providence Elementary School',true,'Rising 6th-8th Boys'),
  ('g686','scheduled','Jul',23,'Thu','Thu, Jul 23','7:30 PM - 9:00 PM','Week 6: Summer Cup Finals',         'Providence Elementary School',true,'Rising 6th-8th Boys')
ON CONFLICT (id) DO UPDATE SET
  location = EXCLUDED.location,
  status   = EXCLUDED.status,
  time     = EXCLUDED.time;
