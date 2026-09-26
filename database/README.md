# Database

PostgreSQL 16, schema managed by **Flyway**.

The migrations live with the backend so Spring Boot runs them automatically on startup:

```
backend/src/main/resources/db/migration/
├── V1__init_schema.sql          # tables, keys, constraints, indexes
└── V2__seed_initial_content.sql # initial portfolio content (no credentials)
```

Rules:

- Never edit a migration that has already run. Add a new one (`V3__...sql`) instead.
- No passwords or secrets in migrations — the admin account is created at runtime from
  `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
- Content (projects, skills, …) is meant to be edited from the admin dashboard after the first start.

## Schema

```mermaid
erDiagram
    projects ||--o{ project_technologies : has
    technologies ||--o{ project_technologies : "used in"
    projects |o--o{ analytics_events : "viewed as"
    projects {
        uuid id PK
        varchar slug UK
        varchar title
        text summary
        jsonb architecture_steps
        jsonb features
        jsonb screenshots
        varchar status
        boolean published
        int display_order
    }
    technologies {
        uuid id PK
        varchar name UK
    }
    project_technologies {
        uuid project_id FK
        uuid technology_id FK
        int position
    }
    experiences {
        uuid id PK
        varchar organization
        varchar role
        jsonb responsibilities
    }
    leadership_roles {
        uuid id PK
        varchar organization
        varchar role
        jsonb organizational
        jsonb technical
    }
    skills {
        uuid id PK
        varchar name
        varchar category
    }
    contact_messages {
        uuid id PK
        varchar email
        varchar subject
        varchar status
    }
    analytics_events {
        uuid id PK
        varchar event_type
        varchar page
        uuid project_id FK
        jsonb metadata
        timestamptz occurred_at
    }
    users {
        uuid id PK
        varchar email UK
        varchar password_hash
        varchar role
    }
```

## Useful commands

```bash
# Open a psql shell in the Docker database
docker compose exec postgres psql -U portfolio -d portfolio

# See which migrations ran
docker compose exec postgres psql -U portfolio -d portfolio -c "select version, description, success from flyway_schema_history"
```
