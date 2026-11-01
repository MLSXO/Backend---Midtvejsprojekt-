# Pokébase – Backend

Backend-API til midtvejsprojektet Pokébase. API'et er udviklet med Node.js og Express og kommunikerer med en MySQL-database med Pokémon, trainers, ligaer og kampe.

[Frontend-repository](https://github.com/MLSXO/Frontend---Midtvejsprojekt-)

## Teknologier

- Node.js
- Express
- MySQL og mysql2
- CORS
- dotenv

## Installation

Klon repositoryet og installer dependencies:

```bash
git clone https://github.com/MLSXO/Backend---Midtvejsprojekt-.git
cd Backend---Midtvejsprojekt-
npm install
```

Opret en lokal `.env`-fil ud fra `.env.example`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=din_adgangskode
DB_NAME=pokemon
PORT=3000
```

Den rigtige `.env`-fil må ikke uploades til GitHub.

## Database

Databasefilerne findes i mappen `Database`:

- `league.sql` opretter tabellerne til ligaer og kampe.
- `test-data.sql` indsætter testdata.
- `Database/ER-Diagram.png` viser tabeller og relationer.

SQL-filerne forudsætter, at databasen `pokemon` og de grundlæggende Pokémon- og trainer-tabeller allerede er oprettet. Kør derefter filerne i denne rækkefølge:

1. `Database/league.sql`
2. `Database/test-data.sql`

Filerne kan køres gennem MySQL Workbench eller MySQL-kommandolinjen.

## Start API'et

```bash
npm start
```

API'et er derefter tilgængeligt på `http://localhost:3000`.

Terminalen bør vise:

```text
Forbundet til databasen pokemon
Serveren kører på http://localhost:3000
```

Syntakskontrollen kan køres med:

```bash
npm test
```

## API-endpoints

### Pokémon

| Metode | Endpoint | Beskrivelse |
|---|---|---|
| GET | `/pokemons` | Henter alle Pokémon |
| GET | `/pokemon-name?name=pika` | Søger efter Pokémon-navn |
| GET | `/pokemon-type?type=Fire` | Søger efter primær eller sekundær type |
| GET | `/pokemon-attack?attack=80` | Henter Pokémon med mindst den valgte attack-værdi |

### Trainers

| Metode | Endpoint | Beskrivelse |
|---|---|---|
| GET | `/trainers` | Henter alle trainers |
| GET | `/trainers/:id/pokemons` | Henter en trainers Pokémon |
| POST | `/trainers` | Opretter en trainer |
| POST | `/trainers/:id/pokemons` | Tilføjer en Pokémon til en trainer |

Eksempel på oprettelse af en trainer:

```json
{
  "trainer_name": "Ash",
  "age": 10,
  "hometown": "Pallet Town"
}
```

Eksempel på at tilføje en Pokémon:

```json
{
  "pokedex_number": 25
}
```

### Ligaer

| Metode | Endpoint | Beskrivelse |
|---|---|---|
| GET | `/leagues` | Henter alle ligaer |

### Dashboard-statistik

| Metode | Endpoint | Beskrivelse |
|---|---|---|
| GET | `/stats/types` | Henter antal Pokémon pr. type |
| GET | `/stats/average-attack` | Henter gennemsnitlig attack pr. type |
| GET | `/stats/trainers` | Henter antal Pokémon pr. trainer |

## Projektstruktur

```text
Backend---Midtvejsprojekt-/
├── Database/
│   ├── league.sql
│   ├── test-data.sql
│   └── Database/
│       └── ER-Diagram.png
├── .env.example
├── .gitignore
├── main.js
├── stats.js
├── trainers.js
├── package.json
├── package-lock.json
└── README.md
```

## Dokumentation og screenshots

- [Backend-screenshots](https://docs.google.com/document/d/16kE5Hu5FAS7nfV2TgGm4l0a3A2DmsZcow7lh1YhFFAo/edit?usp=sharing)
- [ER-diagram](Database/Database/ER-Diagram.png)

Screenshot-dokumentationen viser databaseforbindelsen, data i MySQL Workbench, API-resultatet og ER-diagrammet.

## Gruppemedlemmer

- Marcus Larn Sperling
- Emil Frost
- Nikolaj Falck Gutfeld
- John
