-- Winter 2026-27 Recreation (house league) coaching staff, from the
-- registration export. team = 'Unassigned' means the registration had no
-- Boys/Girls team filled in -- needs manual follow-up to confirm which team
-- they're actually with.
--
-- Gaps identified from this import, left for a human decision (not loaded
-- here since there's no data to load):
--   - High School Girls has zero staff registered at all.
--   - No League Director for 3/4 Girls, 7/8 Boys, 7/8 Girls, or HS Boys.
--   - 5/6 Boys has no head Coach, only Assistant Coaches.

insert into staff (id, name, role, program, team, email, phone, "bgCheckStatus", "bgCheckDate") values
  ('rst1', 'Jay Zimmer', 'Assistant Coach', 'Recreation', '5/6 Girls', 'jay.w.zimmer@gmail.com', '(703) 963-4979', 'Not Started', null),
  ('rst2', 'Brett Ringo', 'Assistant Coach', 'Recreation', '7/8 Boys', 'ringob5516@gmail.com', '(860) 593-9902', 'Not Started', null),
  ('rst3', 'Sean Harrington', 'Assistant Coach', 'Recreation', '5/6 Girls', 'wreck.harrington@gmail.com', '(781) 608-9678', 'Not Started', null),
  ('rst4', 'Sean Harrington', 'Assistant Coach', 'Recreation', '3/4 Girls', 'wreck.harrington@gmail.com', '(781) 608-9678', 'Not Started', null),
  ('rst5', 'LaToya Johnson', 'Coach', 'Recreation', '5/6 Girls', 'rj.mccray@irs.gov', '(434)594-5252', 'Not Started', null),
  ('rst6', 'RJ McCray', 'Assistant Coach', 'Recreation', 'Unassigned', 'mccrayrj@hotmail.com', '(318) 792-5330', 'Not Started', null),
  ('rst7', 'Daniel Marsh', 'Coach', 'Recreation', 'K-3 3v3', 'dancmarsh@gmail.com', '(703) 517-4464', 'Not Started', null),
  ('rst8', 'Ainsley Marsh', 'Coach', 'Recreation', '3/4 Girls', 'ainsleyerin421@gmail.com', '(703) 517-1357', 'Not Started', null),
  ('rst9', 'Joey Grosso', 'Assistant Coach', 'Recreation', 'K-3 3v3', 'grossojv70@gmail.com', '(215)495-2962', 'Not Started', null),
  ('rst10', 'Jonathan Goldberger', 'Assistant Coach', 'Recreation', 'K-3 3v3', 'Jgoldber@gmail.com', '7039817695', 'Not Started', null),
  ('rst11', 'Humberto Mercado', 'Coach', 'Recreation', 'HS Boys', 'mercadosfam5@gmail.com', '(571) 331-7363', 'Not Started', null),
  ('rst12', 'Megan Zamyatin', 'Assistant Coach', 'Recreation', '5/6 Girls', 'meganzamyatin@gmail.com', '(515) 450-2558', 'Not Started', null),
  ('rst13', 'Anup Manoharan', 'Coach', 'Recreation', '7/8 Girls', 'emanoh@hotmail.com', '(248) 302-4123', 'Not Started', null),
  ('rst14', 'Kunal Savdharia', 'Assistant Coach', 'Recreation', 'Unassigned', 'kunaljs@outlook.com', '(703) 870-4493', 'Not Started', null),
  ('rst15', 'Kunal Savdharia', 'Assistant Coach', 'Recreation', '7/8 Girls', 'kunaljs@outlook.com', '(703) 870-4493', 'Not Started', null),
  ('rst16', 'Dan Cook', 'Coach', 'Recreation', '7/8 Girls', 'dhciii@gmail.com', '(240) 813-5457', 'Not Started', null),
  ('rst17', 'Kalyna Watts', 'Scorekeeper', 'Recreation', '7/8 Boys', 'kalynamalm@gmail.com', '(703)944-4982', 'Not Started', null),
  ('rst18', 'Nicholas Continetti', 'Assistant Coach', 'Recreation', '5/6 Girls', 'n.continetti@gmail.com', '(703) 304-1284', 'Not Started', null),
  ('rst19', 'Alex Valvis', 'Assistant Coach', 'Recreation', '3/4 Boys', 'alex.valvis@gmail.com', '(973) 968-1900', 'Not Started', null),
  ('rst20', 'Dan Sharma', 'League Director', 'Recreation', '5/6 Girls', 'dansharma@gmail.com', '(703) 376-7030', 'Not Started', null),
  ('rst21', 'Catherine Foster', 'Scorekeeper', 'Recreation', '5/6 Girls', 'catherinepfoster@gmail.com', '(510) 847-8562', 'Not Started', null),
  ('rst22', 'Brian Cleary', 'Coach', 'Recreation', '7/8 Boys', 'clearybrianj@gmail.com', '7035178350', 'Not Started', null),
  ('rst23', 'Nabil Ali', 'League Director', 'Recreation', 'K-3 3v3', 'syednabilali@gmail.com', '(703) 994-2211', 'Not Started', null),
  ('rst24', 'Eduwell Jenkins', 'Assistant Coach', 'Recreation', 'K-3 3v3', 'ejenkins82@gmail.com', '8082285386', 'Not Started', null),
  ('rst25', 'Christopher DeSimone', 'Assistant Coach', 'Recreation', '7/8 Boys', 'cjdesimone@gmail.com', '(703) 896-0601', 'Not Started', null),
  ('rst26', 'James Brixius', 'Coach', 'Recreation', '3/4 Girls', 'james.j.brixius@gmail.com', '(703) 965-2650', 'Not Started', null),
  ('rst27', 'James Brixius', 'Coach', 'Recreation', '7/8 Girls', 'james.j.brixius@gmail.com', '(703) 965-2650', 'Not Started', null),
  ('rst28', 'Ross Baker', 'Coach', 'Recreation', '3/4 Boys', 'bossraker@gmail.com', '(413) 575-1501', 'Not Started', null),
  ('rst29', 'Ross Baker', 'Assistant Coach', 'Recreation', '7/8 Girls', 'bossraker@gmail.com', '(413) 575-1501', 'Not Started', null),
  ('rst30', 'Steven Diamond', 'Coach', 'Recreation', 'K-3 3v3', 'steve.diamond09@gmail.com', '(301) 537-5535', 'Not Started', null),
  ('rst31', 'John Baer', 'Coach', 'Recreation', 'K-3 3v3', 'jdbaer@hotmail.com', '(317)946-9942', 'Not Started', null),
  ('rst32', 'Shaun Ali', 'League Director', 'Recreation', '3/4 Boys', 'shaunali34@gmail.com', '(703) 989-0847', 'Not Started', null),
  ('rst33', 'Shaun Ali', 'Coach', 'Recreation', 'K-3 3v3', 'shaunali34@gmail.com', '(703) 989-0847', 'Not Started', null),
  ('rst34', 'Steven Townes', 'Assistant Coach', 'Recreation', '5/6 Girls', 'stownes@gmail.com', '(919) 539-2982', 'Not Started', null),
  ('rst35', 'Jim Hanley', 'Scorekeeper', 'Recreation', '3/4 Girls', 'jasrhanley12@gmail.com', '(585)414-2934', 'Not Started', null),
  ('rst36', 'Sean Mazer', 'Coach', 'Recreation', '3/4 Boys', 'seanamazer@gmail.com', '8083217653', 'Not Started', null),
  ('rst37', 'DeAndre Harris', 'Coach', 'Recreation', 'Unassigned', 'deandreh5@gmail.com', '(703) 728-2564', 'Not Started', null),
  ('rst38', 'DeAndre Harris', 'Scorekeeper', 'Recreation', 'Unassigned', 'deandreh5@gmail.com', '(703) 728-2564', 'Not Started', null),
  ('rst39', 'Vishal Bhakta', 'Assistant Coach', 'Recreation', '7/8 Girls', 'vishal.bhakta@gmail.com', '4792833785', 'Not Started', null),
  ('rst40', 'Brian Saal', 'Scorekeeper', 'Recreation', '5/6 Boys', 'b_saal@yahoo.com', '(703) 609-4994', 'Not Started', null),
  ('rst41', 'Adam Basinger', 'League Director', 'Recreation', '5/6 Boys', 'adambasinger3@hotmail.com', '(703) 943-6413', 'Not Started', null),
  ('rst42', 'Molly Friedson', 'Assistant Coach', 'Recreation', '3/4 Girls', 'mdubsfriedson@gmail.com', '(315) 727-1256', 'Not Started', null),
  ('rst43', 'Laura Bowles', 'Coach', 'Recreation', 'Unassigned', 'lauralbowles@gmail.com', '(703) 835-1546', 'Not Started', null),
  ('rst44', 'Laura Bowles', 'Coach', 'Recreation', '3/4 Girls', 'lauralbowles@gmail.com', '(703) 835-1546', 'Not Started', null),
  ('rst45', 'Laura Bowles', 'Assistant Coach', 'Recreation', '5/6 Boys', 'lauralbowles@gmail.com', '(703) 835-1546', 'Not Started', null),
  ('rst46', 'Haoran Li', 'Assistant Coach', 'Recreation', 'K-3 3v3', 'haoran1925@gmail.com', '(571)789-6678', 'Not Started', null),
  ('rst47', 'Christopher Brophy', 'Assistant Coach', 'Recreation', '3/4 Boys', 'brophyct@gmail.com', '(414) 477-7609', 'Not Started', null),
  ('rst48', 'Thomas Barrett', 'Assistant Coach', 'Recreation', 'K-3 3v3', 'Thomas.john.barrett@gmail.com', '(978) 314-6941', 'Not Started', null),
  ('rst49', 'Emily St. Jacques', 'Assistant Coach', 'Recreation', '7/8 Girls', 'emily.stube@gmail.com', '(703) 851-2201', 'Not Started', null),
  ('rst50', 'Shawn Steel', 'Assistant Coach', 'Recreation', '5/6 Boys', 'shawn@famofsteel.com', '(703) 350-5940', 'Not Started', null),
  ('rst51', 'Matt Habibi', 'Assistant Coach', 'Recreation', 'Unassigned', 'warden26@yahoo.com', '(571) 215-6232', 'Not Started', null),
  ('rst52', 'Danielle Powell', 'Assistant Coach', 'Recreation', '5/6 Boys', 'danielle.powell10@gmail.com', '(571) 228-6323', 'Not Started', null),
  ('rst53', 'Victor Imoh', 'Assistant Coach', 'Recreation', 'Unassigned', 'victorimoh@gmail.com', '7038620738', 'Not Started', null),
  ('rst54', 'Jeremy Burkhart', 'Coach', 'Recreation', 'K-3 3v3', 'jeremy.d.burkhart@gmail.com', '(740) 360-3776', 'Not Started', null),
  ('rst55', 'Alex Valvis', 'Assistant Coach', 'Recreation', 'K-3 3v3', 'alex.valvis@gmail.com', '(973) 968-1900', 'Not Started', null),
  ('rst56', 'Marcus Habibi', 'Scorekeeper', 'Recreation', 'Unassigned', 'mhabibi@gwu.edu', '(571) 215-6232', 'Not Started', null)
on conflict (id) do update set
  name = excluded.name, role = excluded.role, program = excluded.program, team = excluded.team,
  email = excluded.email, phone = excluded.phone, "bgCheckStatus" = excluded."bgCheckStatus", "bgCheckDate" = excluded."bgCheckDate";
