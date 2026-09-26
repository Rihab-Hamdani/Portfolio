-- =====================================================================
-- V1: Initial schema for the portfolio platform
-- PostgreSQL 13+ (gen_random_uuid() is built in)
-- =====================================================================

-- ---------------------------------------------------------------------
-- Users (admin accounts). Created at runtime from environment variables,
-- never seeded with credentials in migrations.
-- ---------------------------------------------------------------------
CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         VARCHAR(254) NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    display_name  VARCHAR(120) NOT NULL,
    role          VARCHAR(20)  NOT NULL DEFAULT 'ADMIN',
    enabled       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT ck_users_role CHECK (role IN ('ADMIN'))
);

-- ---------------------------------------------------------------------
-- Technologies (shared across projects)
-- ---------------------------------------------------------------------
CREATE TABLE technologies (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       VARCHAR(80) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_technologies_name UNIQUE (name)
);

-- ---------------------------------------------------------------------
-- Projects (case studies)
-- List-like fields are stored as JSONB arrays of strings; screenshots as
-- a JSONB array of {src, caption, alt} objects.
-- ---------------------------------------------------------------------
CREATE TABLE projects (
    id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug                     VARCHAR(120) NOT NULL,
    title                    VARCHAR(160) NOT NULL,
    tagline                  VARCHAR(300),
    summary                  TEXT         NOT NULL,
    context                  TEXT,
    problem                  TEXT,
    solution                 TEXT,
    my_role                  TEXT,
    architecture_description TEXT,
    architecture_steps       JSONB        NOT NULL DEFAULT '[]'::jsonb,
    features                 JSONB        NOT NULL DEFAULT '[]'::jsonb,
    contribution             JSONB        NOT NULL DEFAULT '[]'::jsonb,
    challenges               JSONB        NOT NULL DEFAULT '[]'::jsonb,
    learnings                JSONB        NOT NULL DEFAULT '[]'::jsonb,
    research_questions       JSONB        NOT NULL DEFAULT '[]'::jsonb,
    screenshots              JSONB        NOT NULL DEFAULT '[]'::jsonb,
    status                   VARCHAR(30),
    github_url               VARCHAR(500),
    demo_url                 VARCHAR(500),
    cover_image              VARCHAR(500),
    featured                 BOOLEAN      NOT NULL DEFAULT FALSE,
    published                BOOLEAN      NOT NULL DEFAULT FALSE,
    display_order            INTEGER      NOT NULL DEFAULT 0,
    created_at               TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at               TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT uq_projects_slug UNIQUE (slug),
    CONSTRAINT ck_projects_slug_format CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    CONSTRAINT ck_projects_status CHECK (
        status IS NULL OR status IN ('CURRENT', 'COMPLETED', 'IN_PROGRESS', 'EXPERIMENTAL', 'RESEARCH', 'INTERNSHIP', 'DRAFT')
    ),
    CONSTRAINT ck_projects_json_arrays CHECK (
        jsonb_typeof(architecture_steps) = 'array'
        AND jsonb_typeof(features) = 'array'
        AND jsonb_typeof(contribution) = 'array'
        AND jsonb_typeof(challenges) = 'array'
        AND jsonb_typeof(learnings) = 'array'
        AND jsonb_typeof(research_questions) = 'array'
        AND jsonb_typeof(screenshots) = 'array'
    )
);

CREATE INDEX idx_projects_published_order ON projects (published, display_order);

-- ---------------------------------------------------------------------
-- Project <-> Technology (ordered many-to-many)
-- ---------------------------------------------------------------------
CREATE TABLE project_technologies (
    project_id    UUID    NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
    technology_id UUID    NOT NULL REFERENCES technologies (id) ON DELETE RESTRICT,
    position      INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (project_id, technology_id)
);

CREATE INDEX idx_project_technologies_technology ON project_technologies (technology_id);

-- ---------------------------------------------------------------------
-- Experience (employment / internships)
-- ---------------------------------------------------------------------
CREATE TABLE experiences (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization     VARCHAR(160) NOT NULL,
    role             VARCHAR(160) NOT NULL,
    employment_type  VARCHAR(60),
    period_label     VARCHAR(80),
    location         VARCHAR(120),
    summary          TEXT,
    responsibilities JSONB        NOT NULL DEFAULT '[]'::jsonb,
    technologies     JSONB        NOT NULL DEFAULT '[]'::jsonb,
    project_slug     VARCHAR(120),
    display_order    INTEGER      NOT NULL DEFAULT 0,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT ck_experiences_json_arrays CHECK (
        jsonb_typeof(responsibilities) = 'array' AND jsonb_typeof(technologies) = 'array'
    )
);

CREATE INDEX idx_experiences_order ON experiences (display_order);

-- ---------------------------------------------------------------------
-- Leadership & community roles
-- ---------------------------------------------------------------------
CREATE TABLE leadership_roles (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization        VARCHAR(160) NOT NULL,
    role                VARCHAR(160) NOT NULL,
    period_label        VARCHAR(80),
    summary             TEXT,
    organizational      JSONB        NOT NULL DEFAULT '[]'::jsonb,
    technical           JSONB        NOT NULL DEFAULT '[]'::jsonb,
    display_order       INTEGER      NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT ck_leadership_json_arrays CHECK (
        jsonb_typeof(organizational) = 'array' AND jsonb_typeof(technical) = 'array'
    )
);

CREATE INDEX idx_leadership_order ON leadership_roles (display_order);

-- ---------------------------------------------------------------------
-- Skills
-- ---------------------------------------------------------------------
CREATE TABLE skills (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(80)  NOT NULL,
    category      VARCHAR(30)  NOT NULL,
    description   VARCHAR(300),
    icon          VARCHAR(60),
    display_order INTEGER      NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT uq_skills_name_category UNIQUE (name, category),
    CONSTRAINT ck_skills_category CHECK (
        category IN ('LANGUAGES', 'FRONTEND', 'BACKEND', 'DATABASES', 'AI', 'TOOLS')
    )
);

CREATE INDEX idx_skills_category_order ON skills (category, display_order);

-- ---------------------------------------------------------------------
-- Contact messages
-- ---------------------------------------------------------------------
CREATE TABLE contact_messages (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       VARCHAR(100)  NOT NULL,
    email      VARCHAR(254)  NOT NULL,
    subject    VARCHAR(150)  NOT NULL,
    message    VARCHAR(5000) NOT NULL,
    status     VARCHAR(20)   NOT NULL DEFAULT 'NEW',
    created_at TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT ck_contact_status CHECK (status IN ('NEW', 'READ', 'ARCHIVED'))
);

CREATE INDEX idx_contact_messages_created ON contact_messages (created_at DESC);
CREATE INDEX idx_contact_messages_status ON contact_messages (status);

-- ---------------------------------------------------------------------
-- Analytics events (first-party, no IP addresses or personal data stored)
-- ---------------------------------------------------------------------
CREATE TABLE analytics_events (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type  VARCHAR(40)  NOT NULL,
    page        VARCHAR(255),
    project_id  UUID REFERENCES projects (id) ON DELETE SET NULL,
    metadata    JSONB,
    occurred_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT ck_analytics_event_type CHECK (
        event_type IN ('page_view', 'project_view', 'resume_download', 'contact_submit', 'github_click', 'linkedin_click')
    )
);

CREATE INDEX idx_analytics_occurred ON analytics_events (occurred_at);
CREATE INDEX idx_analytics_type_occurred ON analytics_events (event_type, occurred_at);
CREATE INDEX idx_analytics_project ON analytics_events (project_id);
