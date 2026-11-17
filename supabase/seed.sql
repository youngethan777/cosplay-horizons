-- Cosplay Horizons — seed data (13 entries, frozen v1, Nov 16 2026)
-- Run AFTER supabase/schema.sql.
-- Photo URLs point at /photos/*.jpg, which are the 6 real photos shipped
-- in public/photos/ in the repo. The other 7 have photo_url NULL and show
-- a clearly labelled placeholder until their real photos arrive via the
-- live submission form.
-- If you later upload the 6 photos to the cosplay-photos storage bucket,
-- update photo_url to the public Supabase Storage URL for each row.

insert into public.cosplays
  (id, character, series, cosplayer, cosplayer_handle, instagram_url, event, date, photographer, photographer_url, photo_url, has_photo, is_favorite, is_first_cosplay, notes, status)
values
  (1, 'Leon Strohl', 'Metaphor: ReFantazio', 'Ethan Young', '@camelcosplays', 'https://www.instagram.com/camelcosplays', 'Metaphor concert', 'Oct 14, 2026', null, null, null, false, false, false, null, 'approved'),
  (2, 'Leon Strohl', 'Metaphor: ReFantazio', 'Ethan Young', '@camelcosplays', 'https://www.instagram.com/camelcosplays', 'Anime Expo 2026', '2026', null, null, null, false, false, false, null, 'approved'),
  (3, 'Agate Crosner', 'Trails in the Sky', 'Ethan Young', '@camelcosplays', 'https://www.instagram.com/camelcosplays', 'Trails cupsleeve event', 'Sep 20, 2026', null, null, null, false, true, false, 'Ethan''s favourite cosplay so far.', 'approved'),
  (4, 'Agate Crosner', 'Trails in the Sky', 'Ethan Young', '@camelcosplays', 'https://www.instagram.com/camelcosplays', 'Anime Expo 2026', '2026', null, null, null, false, false, false, null, 'approved'),
  (5, 'Akihiko Sanada', 'Persona 3', 'Ethan Young', '@camelcosplays', 'https://www.instagram.com/camelcosplays', 'Anime Expo 2026', '2026', null, null, null, false, false, false, null, 'approved'),
  (6, 'Ryusui Nanami', 'Dr. Stone', 'Ethan Young', '@camelcosplays', 'https://www.instagram.com/camelcosplays', 'Anime Expo 2026', '2026', null, null, null, false, false, false, null, 'approved'),
  (7, 'Naofumi Iwatani', 'The Rising of the Shield Hero', 'Ethan Young', '@camelcosplays', 'https://www.instagram.com/camelcosplays', null, null, null, null, '/photos/naofumi-iwatani.jpg', true, false, false, null, 'approved'),
  (8, 'Neptune', 'RWBY', 'Ethan Young', '@camelcosplays', 'https://www.instagram.com/camelcosplays', null, null, null, null, '/photos/neptune-rwby.jpg', true, false, false, 'Neptune Vasilias.', 'approved'),
  (9, 'Satoshi Isshiki', 'Food Wars!', 'Ethan Young', '@camelcosplays', 'https://www.instagram.com/camelcosplays', null, null, null, null, null, false, false, false, null, 'approved'),
  (10, 'Ray Cro Glamor', 'D&D original', 'Ethan Young', '@camelcosplays', 'https://www.instagram.com/camelcosplays', null, null, null, null, '/photos/ray-cro-glamor.jpg', true, false, false, 'Original character — generic rogue / archer based on Ethan’s D&D character.', 'approved'),
  (11, 'Kamen Rider Wizard', 'Kamen Rider Wizard', 'Ethan Young', '@camelcosplays', 'https://www.instagram.com/camelcosplays', null, null, null, null, '/photos/kamen-rider-wizard.jpg', true, false, false, null, 'approved'),
  (12, 'Link', 'The Legend of Zelda', 'Ethan Young', '@camelcosplays', 'https://www.instagram.com/camelcosplays', null, null, null, null, '/photos/link-zelda.jpg', true, false, false, null, 'approved'),
  (13, 'Izaya Orihara', 'Durarara!!', 'Ethan Young', '@camelcosplays', 'https://www.instagram.com/camelcosplays', 'Anime Expo 2016', '2016', null, null, '/photos/izaya-orihara.jpg', true, false, true, 'Ethan''s first cosplay.', 'approved')
on conflict (id) do update set
  character = excluded.character,
  series = excluded.series,
  cosplayer = excluded.cosplayer,
  cosplayer_handle = excluded.cosplayer_handle,
  instagram_url = excluded.instagram_url,
  event = excluded.event,
  date = excluded.date,
  photo_url = excluded.photo_url,
  has_photo = excluded.has_photo,
  is_favorite = excluded.is_favorite,
  is_first_cosplay = excluded.is_first_cosplay,
  notes = excluded.notes,
  status = excluded.status;
