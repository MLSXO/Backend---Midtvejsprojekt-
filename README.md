# Pokébase backend

Dette er backend-delen af vores Pokébase-projekt. Den er lavet med Node.js og Express og henter data fra en MySQL-database.

[Link til frontend](https://github.com/MLSXO/Frontend---Midtvejsprojekt-)

## Teknologier

- Node.js
- Express
- MySQL og mysql2
- CORS
- dotenv

## Sådan starter du projektet

Klon repositoryet og installer pakkerne:

```bash
git clone https://github.com/MLSXO/Backend---Midtvejsprojekt-.git
cd Backend---Midtvejsprojekt-
npm install
```

Lav en `.env`-fil med de samme felter som i `.env.example`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=din_adgangskode
DB_NAME=pokemon
PORT=3000
```

Start serveren med:

```bash
npm start
```

Serveren kører derefter på `http://localhost:3000`.

## Database

SQL-filerne ligger i mappen `Database`.

- `league.sql` opretter tabellerne til ligaer og kampe.
- `test-data.sql` indsætter testdata.
- `Database/ER-Diagram.png` viser tabellerne og deres relationer.

Den grundlæggende Pokémon-database skal være oprettet først. Derefter køres `league.sql` og til sidst `test-data.sql`.

## Endpoints

### Pokémon

| Metode | Endpoint | Funktion |
|---|---|---|
| GET | `/pokemons` | Henter alle Pokémon |
| GET | `/pokemon-name?name=pika` | Søger efter navn |
| GET | `/pokemon-type?type=Fire` | Søger efter type |
| GET | `/pokemon-attack?attack=80` | Filtrerer efter minimum attack |

### Trainers

| Metode | Endpoint | Funktion |
|---|---|---|
| GET | `/trainers` | Henter alle trainers |
| GET | `/trainers/:id/pokemons` | Henter en trainers Pokémon |
| POST | `/trainers` | Opretter en trainer |
| POST | `/trainers/:id/pokemons` | Tilføjer en Pokémon til en trainer |

Eksempel på en ny trainer:

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

### Ligaer og statistik

| Metode | Endpoint | Funktion |
|---|---|---|
| GET | `/leagues` | Henter ligaerne |
| GET | `/stats/types` | Henter antal Pokémon pr. type |
| GET | `/stats/average-attack` | Henter gennemsnitlig attack pr. type |
| GET | `/stats/trainers` | Henter antal Pokémon pr. trainer |

## Filer

```text
Backend---Midtvejsprojekt-/
├── Database/
│   ├── league.sql
│   ├── test-data.sql
│   └── Database/ER-Diagram.png
├── main.js
├── stats.js
├── trainers.js
├── .env.example
├── package.json
└── README.md
```

## Screenshots

- [Screenshots af backend og database](https://docs.google.com/document/d/16kE5Hu5FAS7nfV2TgGm4l0a3A2DmsZcow7lh1YhFFAo/edit?usp=sharing)
- [ER-diagram](Database/Database/ER-Diagram.png)

## Gruppe

- Marcus Larn Sperling
- Emil Frost
- Nikolaj Falck Gutfeld
- John Bærendsen
  
