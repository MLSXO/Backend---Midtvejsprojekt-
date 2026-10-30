-- Testdata til ligasystemet
-- Forudsætter, at league.sql er kørt, og at trainer 1-6 findes.
-- Scriptet kan køres flere gange uden at oprette de samme ligaer,
-- tilmeldinger eller kampe igen.

USE pokemon;

-- -----------------------------------------------------
-- Ligaer
-- -----------------------------------------------------
INSERT INTO league (league_name, region, description)
SELECT
    'Kanto League',
    'Kanto',
    'En liga for Pokémon-trainers fra Kanto'
WHERE NOT EXISTS (
    SELECT 1
    FROM league
    WHERE league_name = 'Kanto League'
);

INSERT INTO league (league_name, region, description)
SELECT
    'Johto League',
    'Johto',
    'En liga for Pokémon-trainers fra Johto'
WHERE NOT EXISTS (
    SELECT 1
    FROM league
    WHERE league_name = 'Johto League'
);

-- Gem ligaernes ID'er, så scriptet ikke er afhængigt af bestemte league_id-værdier.
SET @kanto_league_id = (
    SELECT league_id
    FROM league
    WHERE league_name = 'Kanto League'
    LIMIT 1
);

SET @johto_league_id = (
    SELECT league_id
    FROM league
    WHERE league_name = 'Johto League'
    LIMIT 1
);

-- -----------------------------------------------------
-- Deltagere
-- Eksisterende trainers:
-- 1 = Ash, 2 = Misty, 3 = Brock, 4 = Gary, 5 = Jessie, 6 = James
-- -----------------------------------------------------
INSERT IGNORE INTO league_trainer (league_id, trainer_id)
VALUES
    (@kanto_league_id, 1),
    (@kanto_league_id, 2),
    (@kanto_league_id, 3),
    (@kanto_league_id, 4),
    (@johto_league_id, 1),
    (@johto_league_id, 3),
    (@johto_league_id, 5),
    (@johto_league_id, 6);

-- -----------------------------------------------------
-- Afsluttet kamp: Ash mod Misty, Ash vandt
-- -----------------------------------------------------
INSERT INTO battle (
    league_id,
    trainer_one_id,
    trainer_two_id,
    winner_id,
    battle_date,
    status
)
SELECT
    @kanto_league_id,
    1,
    2,
    1,
    '2026-10-30 14:00:00',
    'completed'
WHERE NOT EXISTS (
    SELECT 1
    FROM battle
    WHERE league_id = @kanto_league_id
      AND trainer_one_id = 1
      AND trainer_two_id = 2
      AND battle_date = '2026-10-30 14:00:00'
);

-- Hvis den oprindelige Ash/Misty-testkamp allerede findes, sikrer dette korrekt resultat.
UPDATE battle
SET
    winner_id = 1,
    status = 'completed'
WHERE league_id = @kanto_league_id
  AND trainer_one_id = 1
  AND trainer_two_id = 2
  AND battle_date = '2026-10-30 14:00:00';

-- -----------------------------------------------------
-- Afsluttet kamp: Brock mod Gary, Gary vandt
-- -----------------------------------------------------
INSERT INTO battle (
    league_id,
    trainer_one_id,
    trainer_two_id,
    winner_id,
    battle_date,
    status
)
SELECT
    @kanto_league_id,
    3,
    4,
    4,
    '2026-10-30 15:00:00',
    'completed'
WHERE NOT EXISTS (
    SELECT 1
    FROM battle
    WHERE league_id = @kanto_league_id
      AND trainer_one_id = 3
      AND trainer_two_id = 4
      AND battle_date = '2026-10-30 15:00:00'
);

-- -----------------------------------------------------
-- Planlagt kamp: Ash mod Gary
-- -----------------------------------------------------
INSERT INTO battle (
    league_id,
    trainer_one_id,
    trainer_two_id,
    battle_date,
    status
)
SELECT
    @kanto_league_id,
    1,
    4,
    '2026-11-01 13:00:00',
    'scheduled'
WHERE NOT EXISTS (
    SELECT 1
    FROM battle
    WHERE league_id = @kanto_league_id
      AND trainer_one_id = 1
      AND trainer_two_id = 4
      AND battle_date = '2026-11-01 13:00:00'
);

-- -----------------------------------------------------
-- Planlagt kamp i Johto League: Jessie mod James
-- -----------------------------------------------------
INSERT INTO battle (
    league_id,
    trainer_one_id,
    trainer_two_id,
    battle_date,
    status
)
SELECT
    @johto_league_id,
    5,
    6,
    '2026-11-01 15:00:00',
    'scheduled'
WHERE NOT EXISTS (
    SELECT 1
    FROM battle
    WHERE league_id = @johto_league_id
      AND trainer_one_id = 5
      AND trainer_two_id = 6
      AND battle_date = '2026-11-01 15:00:00'
);

-- -----------------------------------------------------
-- Kontrolforespørgsler
-- -----------------------------------------------------
SELECT *
FROM league
ORDER BY league_id;

SELECT
    l.league_name,
    t.trainer_id,
    t.trainer_name,
    lt.joined_at
FROM league_trainer lt
JOIN league l
    ON l.league_id = lt.league_id
JOIN trainer t
    ON t.trainer_id = lt.trainer_id
ORDER BY l.league_name, t.trainer_name;

SELECT
    b.battle_id,
    l.league_name,
    trainer_one.trainer_name AS trainer_one,
    trainer_two.trainer_name AS trainer_two,
    winner.trainer_name AS winner,
    b.battle_date,
    b.status
FROM battle b
JOIN league l
    ON l.league_id = b.league_id
JOIN trainer AS trainer_one
    ON trainer_one.trainer_id = b.trainer_one_id
JOIN trainer AS trainer_two
    ON trainer_two.trainer_id = b.trainer_two_id
LEFT JOIN trainer AS winner
    ON winner.trainer_id = b.winner_id
ORDER BY b.battle_date;
