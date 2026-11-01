const express = require("express");

const MAX_NAME_LENGTH = 50;
const MAX_HOMETOWN_LENGTH = 50;
const MAX_AGE = 120;

function parseInteger(value) {
    if (typeof value === "number" && Number.isInteger(value)) {
        return value;
    }

    if (typeof value === "string" && /^-?\d+$/.test(value.trim())) {
        return Number(value.trim());
    }

    return null;
}

function parseId(value) {
    const number = parseInteger(value);

    return number !== null && number >= 1 ? number : null;
}

function isMissing(value) {
    return value === undefined || value === null || value === "";
}


module.exports = function createTrainersRouter(db) {

    const router = express.Router();

    router.get("/", async (req, res) => {

        try {
            const [trainers] = await db.query(
                `SELECT trainer_id, trainer_name, age, hometown
                 FROM trainer
                 ORDER BY trainer_name`
            );

            res.json(trainers);

        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: "Could not fetch trainers"
            });
        }
    });

    router.get("/:id/pokemons", async (req, res) => {

        const trainerId = parseId(req.params.id);

        if (trainerId === null) {
            return res.status(400).json({
                error: "Trainer ID must be a positive whole number"
            });
        }

        try {
            const [trainers] = await db.query(
                "SELECT trainer_id FROM trainer WHERE trainer_id = ?",
                [trainerId]
            );

            if (trainers.length === 0) {
                return res.status(404).json({
                    error: "Trainer not found"
                });
            }

            const [pokemons] = await db.query(
                `SELECT p.pokedex_number, p.name, p.primary_type, p.secondary_type,
                        p.hp, p.attack, p.defence, p.special_attack,
                        p.special_defence, p.speed
                 FROM trainer_pokemon tp
                 JOIN pokemon p ON p.pokedex_number = tp.pokedex_number
                 WHERE tp.trainer_id = ?
                 ORDER BY p.pokedex_number`,
                [trainerId]
            );

            res.json(pokemons);

        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: "Could not fetch the trainer's Pokémon"
            });
        }
    });

    router.post("/", async (req, res) => {

        const body = req.body ?? {};

        const trainerName =
            typeof body.trainer_name === "string" ? body.trainer_name.trim() : "";

        if (trainerName === "") {
            return res.status(400).json({
                error: "Trainer name is required"
            });
        }

        if (trainerName.length > MAX_NAME_LENGTH) {
            return res.status(400).json({
                error: `Trainer name can be at most ${MAX_NAME_LENGTH} characters`
            });
        }

        const age = isMissing(body.age) ? null : parseInteger(body.age);

        if (age === null || age < 0 || age > MAX_AGE) {
            return res.status(400).json({
                error: `Age is required and must be a whole number between 0 and ${MAX_AGE}`
            });
        }

        const hometown =
            typeof body.hometown === "string" ? body.hometown.trim() : "";

        if (hometown === "") {
            return res.status(400).json({
                error: "Hometown is required"
            });
        }

        if (hometown.length > MAX_HOMETOWN_LENGTH) {
            return res.status(400).json({
                error: `Hometown can be at most ${MAX_HOMETOWN_LENGTH} characters`
            });
        }

        try {
            const [result] = await db.query(
                "INSERT INTO trainer (trainer_name, age, hometown) VALUES (?, ?, ?)",
                [trainerName, age, hometown]
            );

            res.status(201).json({
                trainer_id: result.insertId,
                trainer_name: trainerName,
                age: age,
                hometown: hometown
            });

        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: "Could not create the trainer"
            });
        }
    });

    router.post("/:id/pokemons", async (req, res) => {

        const trainerId = parseId(req.params.id);

        if (trainerId === null) {
            return res.status(400).json({
                error: "Trainer ID must be a positive whole number"
            });
        }

        const body = req.body ?? {};

        if (isMissing(body.pokedex_number)) {
            return res.status(400).json({
                error: "pokedex_number is required"
            });
        }

        const pokedexNumber = parseId(body.pokedex_number);

        if (pokedexNumber === null) {
            return res.status(400).json({
                error: "pokedex_number must be a positive whole number"
            });
        }

        try {
            const [trainers] = await db.query(
                "SELECT trainer_id, trainer_name FROM trainer WHERE trainer_id = ?",
                [trainerId]
            );

            if (trainers.length === 0) {
                return res.status(404).json({
                    error: "Trainer not found"
                });
            }

            const [pokemons] = await db.query(
                "SELECT pokedex_number, name FROM pokemon WHERE pokedex_number = ?",
                [pokedexNumber]
            );

            if (pokemons.length === 0) {
                return res.status(404).json({
                    error: "Pokémon not found"
                });
            }

            const [existing] = await db.query(
                `SELECT 1
                 FROM trainer_pokemon
                 WHERE trainer_id = ? AND pokedex_number = ?`,
                [trainerId, pokedexNumber]
            );

            if (existing.length > 0) {
                return res.status(409).json({
                    error: `${trainers[0].trainer_name} already has ${pokemons[0].name}`
                });
            }

            await db.query(
                "INSERT INTO trainer_pokemon (trainer_id, pokedex_number) VALUES (?, ?)",
                [trainerId, pokedexNumber]
            );

            res.status(201).json({
                trainer_id: trainerId,
                pokedex_number: pokedexNumber,
                name: pokemons[0].name
            });

        } catch (error) {
            console.error(error);

            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    error: "The trainer already has this Pokémon"
                });
            }

            res.status(500).json({
                error: "Could not add the Pokémon to the trainer"
            });
        }
    });

    return router;
};