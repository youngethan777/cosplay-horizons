-- Cosplay Horizons — seed data (13 entries, frozen v1, Nov 16 2026;
-- v1.1, Nov 18 2026: photo_urls + variant_type/variant_label added.
-- v1.1 follow-up, Nov 18 2026: main_series added; id 3 (Agate, Trails
-- cupsleeve) is variant 'other' / 'Cupsleeve' — 12 traditional + 1 other.
-- photo_urls matches photo_url.
-- Run AFTER supabase/schema.sql.
-- Photo URLs point at /photos/*.jpg, which are the 6 real photos shipped
-- in public/photos/ in the repo. The other 7 have photo_url NULL and show
-- a clearly labelled placeholder until their real photos arrive via the
-- live submission form.
-- If you later upload the 6 photos to the cosplay-photos storage bucket,
-- update photo_url to the public Supabase Storage URL for each row.

insert into public.cosplays
  (id, character, main_series, series, cosplayer, cosplayer_handle, instagram_url, event, date, photographer, photographer_url, photo_url, photo_urls, variant_type, variant_label, has_photo, is_favorite, is_first_cosplay, notes, status)
values
  (1, 'Leon Strohl', 'Metaphor: ReFantazio', 'Metaphor: ReFantazio', 'Camel438', '@camelcosplays', 'https://www.instagram.com/camelcosplays', 'Metaphor concert', 'Oct 14, 2026', null, null, null, array[]::text[], 'traditional', null, false, false, false, null, 'approved'),
  (2, 'Leon Strohl', 'Metaphor: ReFantazio', 'Metaphor: ReFantazio', 'Camel438', '@camelcosplays', 'https://www.instagram.com/camelcosplays', 'Anime Expo 2026', '2026', null, null, null, array[]::text[], 'traditional', null, false, false, false, null, 'approved'),
  (3, 'Agate Crosner', 'Trails', 'Trails in the Sky', 'Camel438', '@camelcosplays', 'https://www.instagram.com/camelcosplays', 'Trails cupsleeve event', 'Sep 20, 2026', null, null, null, array[]::text[], 'other', 'Cupsleeve', false, true, false, 'Ethan''s favourite cosplay so far.', 'approved'),
  (4, 'Agate Crosner', 'Trails', 'Trails in the Sky', 'Camel438', '@camelcosplays', 'https://www.instagram.com/camelcosplays', 'Anime Expo 2026', '2026', null, null, null, array[]::text[], 'traditional', null, false, false, false, null, 'approved'),
  (5, 'Akihiko Sanada', 'Persona', 'Persona 3', 'Camel438', '@camelcosplays', 'https://www.instagram.com/camelcosplays', 'Anime Expo 2026', '2026', null, null, null, array[]::text[], 'traditional', null, false, false, false, null, 'approved'),
  (6, 'Ryusui Nanami', 'Dr. Stone', 'Dr. Stone', 'Camel438', '@camelcosplays', 'https://www.instagram.com/camelcosplays', 'Anime Expo 2026', '2026', null, null, null, array[]::text[], 'traditional', null, false, false, false, null, 'approved'),
  (7, 'Naofumi Iwatani', 'The Rising of the Shield Hero', 'The Rising of the Shield Hero', 'Camel438', '@camelcosplays', 'https://www.instagram.com/camelcosplays', null, null, null, null, '/photos/naofumi-iwatani.jpg', array['/photos/naofumi-iwatani.jpg'], 'traditional', null, true, false, false, null, 'approved'),
  (8, 'Neptune', 'RWBY', 'RWBY', 'Camel438', '@camelcosplays', 'https://www.instagram.com/camelcosplays', null, null, null, null, '/photos/neptune-rwby.jpg', array['/photos/neptune-rwby.jpg'], 'traditional', null, true, false, false, 'Neptune Vasilias.', 'approved'),
  (9, 'Satoshi Isshiki', 'Food Wars!', 'Food Wars!', 'Camel438', '@camelcosplays', 'https://www.instagram.com/camelcosplays', null, null, null, null, null, array[]::text[], 'traditional', null, false, false, false, null, 'approved'),
  (10, 'Ray Cro Glamor', 'Dungeons & Dragons', 'D&D original', 'Camel438', '@camelcosplays', 'https://www.instagram.com/camelcosplays', null, null, null, null, '/photos/ray-cro-glamor.jpg', array['/photos/ray-cro-glamor.jpg'], 'traditional', null, true, false, false, 'Original character — generic rogue / archer based on Ethan’s D&D character.', 'approved'),
  (11, 'Kamen Rider Wizard', 'Kamen Rider', 'Kamen Rider Wizard', 'Camel438', '@camelcosplays', 'https://www.instagram.com/camelcosplays', null, null, null, null, '/photos/kamen-rider-wizard.jpg', array['/photos/kamen-rider-wizard.jpg'], 'traditional', null, true, false, false, null, 'approved'),
  (12, 'Link', 'The Legend of Zelda', 'The Legend of Zelda', 'Camel438', '@camelcosplays', 'https://www.instagram.com/camelcosplays', null, null, null, null, '/photos/link-zelda.jpg', array['/photos/link-zelda.jpg'], 'traditional', null, true, false, false, null, 'approved'),
  (13, 'Izaya Orihara', 'Durarara!!', 'Durarara!!', 'Camel438', '@camelcosplays', 'https://www.instagram.com/camelcosplays', 'Anime Expo 2016', '2016', null, null, '/photos/izaya-orihara.jpg', array['/photos/izaya-orihara.jpg'], 'traditional', null, true, false, true, 'Ethan''s first cosplay.', 'approved')
on conflict (id) do update set
  character = excluded.character,
  main_series = excluded.main_series,
  series = excluded.series,
  cosplayer = excluded.cosplayer,
  cosplayer_handle = excluded.cosplayer_handle,
  instagram_url = excluded.instagram_url,
  event = excluded.event,
  date = excluded.date,
  photo_url = excluded.photo_url,
  photo_urls = excluded.photo_urls,
  variant_type = excluded.variant_type,
  variant_label = excluded.variant_label,
  has_photo = excluded.has_photo,
  is_favorite = excluded.is_favorite,
  is_first_cosplay = excluded.is_first_cosplay,
  notes = excluded.notes,
  status = excluded.status;
