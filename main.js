require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const { createStatsRouter } = require("./stats");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
app.use("/stats", createStatsRouter(connection));
app.get("/", (req, res) => {
    res.json({
        message: "API'et kører"
    });
});

app.get("/pokemons", (req, res) => {
    const sql = `
        SELECT *
        FROM pokemon
        ORDER BY pokedex_number
    `;

    connection.query(sql, (error, results) => {
        if (error) {
            console.error(error);

            return res.status(500).json({
                error: "Kunne ikke hente Pokémon-navne"
            });
        }

        res.json(results);
    });
});

app.get("/pokemon-name", (req, res) => {
    const name = typeof req.query.name === "string"
        ? req.query.name.trim()
        : "";

    if (name === "") {
        return res.status(400).json({
            error: "Query parameter 'name' is required"
        });
    }

    const sql = `
        SELECT *
        FROM pokemon
        WHERE name LIKE ?
        ORDER BY pokedex_number
    `;

    connection.query(sql, [`%${name}%`], (error, results) => {
        if (error) {
            console.error(error);

            return res.status(500).json({
                error: "Kunne ikke hente Pokémon-navne"
            });
        }

        res.json(results);
    });
});

app.get("/pokemon-type", (req, res) => {
    const type = typeof req.query.type === "string"
        ? req.query.type.trim()
        : "";

    if (type === "") {
        return res.status(400).json({
            error: "Query parameter 'type' is required"
        });
    }

    const sql = `
        SELECT *
        FROM pokemon
        WHERE primary_type = ? OR secondary_type = ?
        ORDER BY pokedex_number
    `;

    connection.query(sql, [type, type], (error, results) => {
        if (error) {
            console.error(error);

            return res.status(500).json({
                error: "Kunne ikke hente Pokémon efter type"
            });
        }

        res.json(results);
    });
});

app.get("/pokemon-attack", (req, res) => {
    const attack = Number(req.query.attack);

    if (
        req.query.attack === undefined ||
        req.query.attack === "" ||
        !Number.isFinite(attack) ||
        attack < 0
    ) {
        return res.status(400).json({
            error: "Query parameter 'attack' must be a non-negative number"
        });
    }

    const sql = `
        SELECT *
        FROM pokemon
        WHERE attack >= ?
        ORDER BY attack DESC, pokedex_number
    `;

    connection.query(sql, [attack], (error, results) => {
        if (error) {
            console.error(error);

            return res.status(500).json({
                error: "Kunne ikke hente Pokémon efter attack"
            });
        }

        res.json(results);
    });
});

app.get("/leagues", (req, res) => {
    const sql = `
        SELECT
            league_id,
            league_name,
            region,
            challenge,
            description
        FROM league
        ORDER BY league_name
    `;

    connection.query(sql, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({
                error: "Kunne ikke hente ligaer"
            });
        }

        res.json(results);
    });
});

const createTrainersRouter = require("./trainers");

app.use("/trainers", createTrainersRouter(connection.promise()));

app.use((error, req, res, next) => {

    if (error.type === "entity.parse.failed") {
        return res.status(400).json({
            error: "Request body must be valid JSON"
        });
    }

    next(error);
});

connection.connect((error) => {
    if (error) {
        console.error(
            "Kunne ikke forbinde til databasen:",
            error.message
        );
        process.exitCode = 1;
        return;
    }

    console.log("Forbundet til databasen pokemon");

    app.listen(port, () => {
        console.log(`Serveren kører på http://localhost:${port}`);
    });
});
