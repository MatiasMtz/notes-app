[README_notes-app.md](https://github.com/user-attachments/files/31652884/README_notes-app.md)
<h1 align="center">📝 Notes App</h1>

<p align="center">
  A full-stack single page application to create, edit, archive and filter notes by category.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React">
  <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" alt="Express">
  <img src="https://img.shields.io/badge/sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white" alt="Sequelize">
  <img src="https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
</p>

---
## Demo
<p align="center">
  <img src="https://github.com/MatiasMtz/notes-app/issues/1#issue-5303381169" width="80%" alt="Notes App demo">
</p>


---

## Features

- **Note management** — create, edit and delete notes.
- **Archiving** — archive and unarchive notes, with separate views for active and archived ones.
- **Categories** — tag notes with one or more colour-coded categories through a many-to-many relationship.
- **Filtering** — narrow the list down to a single category.
- **One-command setup** — a single script provisions the database, runs migrations and starts both apps.

---

## Architecture

The backend follows a **layered architecture**, so each layer has one responsibility and can be tested or replaced on its own:

```
Frontend  ->  Routes  ->  Controller  ->  Service  ->  Repository  ->  Database
```

- **Routes** map HTTP verbs and paths to controllers.
- **Controllers** parse requests and shape responses. No business rules live here.
- **Services** hold the business logic.
- **Repositories** are the only layer that talks to the ORM, so persistence details never leak upwards.

Frontend and backend are separate applications with their own `package.json`, communicating exclusively over a REST API.

```
notes-app/
├── backend/
│   ├── layer_controllers/    # Request handling
│   ├── layer_services/       # Business logic
│   ├── layer_repositories/   # Data access
│   ├── models/               # Sequelize models and associations
│   ├── migrations/           # Versioned schema changes
│   ├── routes/               # API endpoint definitions
│   └── app.js                # Express entry point
├── frontend/
│   └── src/components/       # React components
└── start.sh                  # Setup and run script
```

---

## API

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/notes` | List all notes |
| `GET` | `/notes/:id` | Get a single note |
| `POST` | `/notes` | Create a note |
| `PUT` | `/notes/:id` | Update a note |
| `DELETE` | `/notes/:id` | Delete a note |
| `GET` | `/categories` | List all categories |

---

## Data model

| Entity | Fields |
| :--- | :--- |
| **Note** | `title`, `content`, `isArchived` |
| **Category** | `name` (unique), `color` |

Notes and categories are linked through a `NoteCategories` join table, so a note can carry several categories and a category can group several notes.

---

## Getting started

### Requirements

| Tool | Version |
| :--- | :--- |
| Node.js | 20.17.0 or later |
| npm | 10.8.2 or later |
| MySQL | 8.0 or later |

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/MatiasMtz/notes-app.git
cd notes-app
```

**2. Run the setup script** (Linux / macOS)

```bash
chmod +x start.sh
./start.sh
```

The script installs dependencies for both apps, creates the database and its user, applies the migrations and starts the two servers.

**3. Open the app**

| Service | URL |
| :--- | :--- |
| Frontend | http://localhost:3000 |
| API | http://localhost:5000/api |

> **Note:** MySQL has to be running before you launch the script. If anything fails, the script logs the failing step.

### Default local configuration

| Setting | Value |
| :--- | :--- |
| Database | `notes_app` |
| User | `notes_user` |
| Password | `notes_password` |

These are development-only values, created locally by the setup script.

---

## What I would improve next

- Move the database credentials to environment variables with a versioned `.env.example`.
- Add unit tests for the service layer and integration tests for the API.
- Introduce authentication so notes belong to a user.
- Paginate the note list, which currently loads every record at once.

---

## Author

**Matías Martínez** — [GitHub](https://github.com/MatiasMtz) · [LinkedIn](https://www.linkedin.com/in/matiasmartinezhirsiger/)
