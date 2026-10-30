-- =====================================================
-- DDL OG GRUNDDATA TIL LIGASYSTEMET
-- =====================================================
-- Forudsætter:
-- 1. Databasen pokemon eksisterer.
-- 2. Tabellen trainer eksisterer.
-- 3. trainer har kolonnen trainer_id som primærnøgle.
-- =====================================================

USE pokemon;

-- =====================================================
-- TABLE: league
-- Indeholder ligaernes grundoplysninger.
-- =====================================================

CREATE TABLE IF NOT EXISTS league (
                                      league_id INT NOT NULL AUTO_INCREMENT,
                                      league_name VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    challenge VARCHAR(100),
    description VARCHAR(500),

    PRIMARY KEY (league_id),
    UNIQUE KEY uq_league_name (league_name)
    )
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8mb4
    COLLATE = utf8mb4_0900_ai_ci;


-- =====================================================
-- TABLE: league_trainer
-- Forbinder trainers og ligaer.
-- En trainer kan deltage i flere ligaer.
-- En liga kan have flere trainers.
-- =====================================================

CREATE TABLE IF NOT EXISTS league_trainer (
                                              league_id INT NOT NULL,
                                              trainer_id INT NOT NULL,
                                              joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                              PRIMARY KEY (league_id, trainer_id),

    CONSTRAINT fk_league_trainer_league
    FOREIGN KEY (league_id)
    REFERENCES league (league_id)
    ON DELETE CASCADE,

    CONSTRAINT fk_league_trainer_trainer
    FOREIGN KEY (trainer_id)
    REFERENCES trainer (trainer_id)
    ON DELETE CASCADE
    )
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8mb4
    COLLATE = utf8mb4_0900_ai_ci;


-- =====================================================
-- TABLE: battle
-- Indeholder planlagte, afsluttede og aflyste kampe.
-- =====================================================

CREATE TABLE IF NOT EXISTS battle (
                                      battle_id INT NOT NULL AUTO_INCREMENT,
                                      league_id INT NOT NULL,
                                      trainer_one_id INT NOT NULL,
                                      trainer_two_id INT NOT NULL,
                                      winner_id INT NULL,
                                      battle_date DATETIME NULL,

                                      status ENUM(
                                      'scheduled',
                                      'completed',
                                      'cancelled'
) NOT NULL DEFAULT 'scheduled',

    PRIMARY KEY (battle_id),

    CONSTRAINT fk_battle_league
    FOREIGN KEY (league_id)
    REFERENCES league (league_id)
    ON DELETE CASCADE,

    CONSTRAINT fk_battle_trainer_one
    FOREIGN KEY (trainer_one_id)
    REFERENCES trainer (trainer_id),

    CONSTRAINT fk_battle_trainer_two
    FOREIGN KEY (trainer_two_id)
    REFERENCES trainer (trainer_id),

    CONSTRAINT fk_battle_winner
    FOREIGN KEY (winner_id)
    REFERENCES trainer (trainer_id)
    ON DELETE SET NULL
    )
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8mb4
    COLLATE = utf8mb4_0900_ai_ci;


-- =====================================================
-- GRUNDDATA TIL LEAGUE
-- ID-numrene oprettes automatisk af MySQL.
--
-- ON DUPLICATE KEY UPDATE betyder, at scriptet kan
-- køres igen uden at oprette dubletter.
-- =====================================================

INSERT INTO league (
    league_name,
    region,
    challenge,
    description
)
VALUES
    (
        'Kanto League',
        'Kanto',
        'Speed',
        'The classic Pokémon League of Kanto! Speed is everything here. The trainer whose Pokémon have the highest average Speed wins.'
    ),
    (
        'Orange League',
        'Orange Archipelago',
        'HP',
        'Endurance is the key to victory. The trainer whose Pokémon have the highest average HP wins.'
    ),
    (
        'Johto League',
        'Johto',
        'Defense',
        'The legendary Johto League puts your Pokémon defenses to the test. The trainer with the highest average Defense wins.'
    ),
    (
        'Hoenn League',
        'Hoenn',
        'Attack',
        'In the Hoenn region, raw power rules the battlefield. The trainer whose Pokémon have the highest average Attack wins.'
    ),
    (
        'Sinnoh League',
        'Sinnoh',
        'Sp. Defense',
        'Only the toughest Pokémon can withstand powerful special attacks. The trainer with the highest average Special Defense wins.'
    ),
    (
        'Unova League',
        'Unova',
        'Sp. Attack',
        'Unleash the hidden power of your Pokémon in the Unova League. The trainer with the highest average Special Attack wins.'
    ),
    (
        'Kalos League',
        'Kalos',
        'Total Stats',
        'True champions master every skill. The trainer whose Pokémon have the highest average total stats wins.'
    ),
    (
        'Alola League',
        'Alola',
        'Lowest Speed',
        'Patience is the secret to victory. The trainer with the lowest average Speed wins.'
    ),
    (
        'Galar League',
        'Galar',
        'Attack + Speed',
        'Victory requires both strength and speed. The trainer with the highest combined average Attack and Speed wins.'
    ),
    (
        'Paldea League',
        'Paldea',
        'HP + Defense',
        'Only the most resilient Pokémon will succeed. The trainer with the highest combined average HP and Defense wins.'
    )
    ON DUPLICATE KEY UPDATE
                         region = VALUES(region),
                         challenge = VALUES(challenge),
                         description = VALUES(description);


-- =====================================================
-- KONTROL
-- Viser alle ligaer efter oprettelse eller opdatering.
-- =====================================================

SELECT
    league_id,
    league_name,
    region,
    challenge,
    description
FROM league
ORDER BY league_name;