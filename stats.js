const express = require("express");

const queries = {
    types: `
        SELECT pokemon_type AS type, COUNT(*) AS pokemon_count
        FROM (
            SELECT pokedex_number, TRIM(primary_type) AS pokemon_type
            FROM pokemon
            UNION
            SELECT pokedex_number, TRIM(secondary_type) AS pokemon_type
            FROM pokemon
        ) AS pokemon_types
        WHERE pokemon_type IS NOT NULL AND pokemon_type <> ''
        GROUP BY pokemon_type
        ORDER BY pokemon_count DESC, pokemon_type;
    `,

    averageAttack: `
        SELECT pokemon_type AS type, ROUND(AVG(attack), 2) AS average_attack
        FROM (
            SELECT pokedex_number, TRIM(primary_type) AS pokemon_type, attack
            FROM pokemon
            UNION
            SELECT pokedex_number, TRIM(secondary_type) AS pokemon_type, attack
            FROM pokemon
        ) AS pokemon_types
        WHERE pokemon_type IS NOT NULL AND pokemon_type <> ''
        GROUP BY pokemon_type
        ORDER BY average_attack DESC, pokemon_type;
    `,

    trainers: `
        SELECT t.trainer_id, t.trainer_name,
               COUNT(tp.pokedex_number) AS pokemon_count
        FROM trainer AS t
        LEFT JOIN trainer_pokemon AS tp ON tp.trainer_id = t.trainer_id
        GROUP BY t.trainer_id, t.trainer_name
        ORDER BY pokemon_count DESC, t.trainer_name, t.trainer_id;
    `
};

function createStatsRouter(connection) {
    const router = express.Router();

    router.get("/types", (req, res) => {
        connection.query(
            { sql: queries.types, timeout: 8000 },
            (error, results) => {
                if (res.headersSent) return;

                if (error) {
                    console.error("Statistikfejl:", error.code);

                    return res.status(500).json({
                        error: "Kunne ikke hente antal Pokémon pr. type. Prøv igen senere."
                    });
                }

                for (const row of results) {
                    row.pokemon_count = Number(row.pokemon_count);
                }

                res.json(results);
            }
        );
    });

    router.get("/average-attack", (req, res) => {
        connection.query(
            { sql: queries.averageAttack, timeout: 8000 },
            (error, results) => {
                if (res.headersSent) return;

                if (error) {
                    console.error("Statistikfejl:", error.code);

                    return res.status(500).json({
                        error: "Kunne ikke hente gennemsnitlig attack pr. type. Prøv igen senere."
                    });
                }

                for (const row of results) {
                    if (row.average_attack !== null) {
                        row.average_attack = Number(row.average_attack);
                    }
                }

                res.json(results);
            }
        );
    });

    router.get("/trainers", (req, res) => {
        connection.query(
            { sql: queries.trainers, timeout: 8000 },
            (error, results) => {
                if (res.headersSent) return;

                if (error) {
                    console.error("Statistikfejl:", error.code);

                    return res.status(500).json({
                        error: "Kunne ikke hente antal Pokémon pr. trainer. Prøv igen senere."
                    });
                }

                for (const row of results) {
                    row.trainer_id = Number(row.trainer_id);
                    row.pokemon_count = Number(row.pokemon_count);
                }

                res.json(results);
            }
        );
    });

    return router;
}

module.exports = { createStatsRouter, queries };