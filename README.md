# Pokébase – Backend

Backend-API til vores midtvejsprojekt Pokébase. API’et er udviklet med Node.js og Express og kommunikerer med en MySQL-database med Pokémon, trainers, ligaer og kampe.

Frontend-repository:  
https://github.com/MLSXO/Frontend---Midtvejsprojekt-

## Teknologier

- Node.js
- Express
- MySQL
- mysql2
- CORS
- dotenv

## Installation

Klon repositoryet:

```bash
git clone https://github.com/MLSXO/Backend---Midtvejsprojekt-.git
cd Backend---Midtvejsprojekt-
```

Installer dependencies:

```bash
npm install
```

Opret en `.env`-fil ud fra `.env.example`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=din_adgangskode
DB_NAME=pokemon
PORT=3000
```

Den rigtige `.env`-fil må ikke uploades til GitHub.

## Database

Projektets databasefiler findes i mappen `Database`.

- `league.sql` opretter tabellerne til ligaer og kampe.
- `test-data.sql` indsætter testdata.
- ER-diagrammet viser databasens tabeller og relationer.

SQL-filerne forudsætter, at databasen `pokemon` og de grundlæggende Pokémon- og trainer-tabeller allerede er oprettet.

Kør først det grundlæggende databasescript. Kør derefter:

1. `Database/league.sql`
2. `Database/test-data.sql`

Filerne kan køres gennem MySQL Workbench eller MySQL-kommandolinjen.

## Start API’et

```bash
npm start
```

Når serveren er startet, er API’et tilgængeligt på:

```text
http://localhost:3000
```

Terminalen bør vise:

```text
Forbundet til databasen pokemon
Serveren kører på http://localhost:3000
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
├── trainers.js
├── package.json
└── package-lock.json
```

## Dokumentation

ER-diagrammet findes i repositoryets `Database`-mappe.

Til den endelige aflevering tilføjes også:

- Screenshots af den kørende hjemmeside
- Screenshot af API-data
- Link til demonstrationsvideo

## Gruppemedlemmer

- Marcus Larn Sperling
- Emil Frost
- Nikolaj Falck Gutfeld
- John
