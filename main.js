require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

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

app.get("/", (req, res) => {
    res.json({
        message: "API'et kører"
    });
});

app.get("/pokemons", (req, res) => {
    const sql = `
        SELECT *
        FROM pokemon
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
    const sql = `
        SELECT name
        FROM pokemon
        ORDER BY name
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
