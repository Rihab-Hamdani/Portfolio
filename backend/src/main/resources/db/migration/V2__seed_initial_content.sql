-- =====================================================================
-- V2: Initial portfolio content
--
-- Everything here comes from information Rihab provided. Where a detail
-- is unknown (dates, links, screenshots, personal learnings), the field
-- is left empty and the frontend hides it. Edit everything later from
-- the admin dashboard (/admin).
--
-- Architecture steps use the format "Label|Short description".
-- =====================================================================

-- ---------------------------------------------------------------------
-- Technologies
-- ---------------------------------------------------------------------
INSERT INTO technologies (name) VALUES
    ('Angular 18'), ('Spring Boot'), ('Java 21'), ('PostgreSQL'), ('Flyway'),
    ('PWA'), ('REST API'), ('RBAC'),
    ('React'), ('TypeScript'), ('FastAPI'), ('Qdrant'), ('Docker'), ('LLM API'),
    ('MongoDB'), ('SNMP'), ('SSH');

-- ---------------------------------------------------------------------
-- Projects
-- ---------------------------------------------------------------------
INSERT INTO projects (
    slug, title, tagline, summary, context, problem, solution, my_role,
    architecture_description, architecture_steps, features, contribution,
    challenges, learnings, research_questions, status, featured, published, display_order
) VALUES
(
    'medical-cabinet-stock-management',
    'Medical Cabinet Stock Management PWA',
    $$A mobile-first progressive web app for managing a medical cabinet's stock, with separate roles for the doctor and the secretary.$$,
    $$A stock-management application designed for a real medical cabinet. It runs as a PWA built for phones — especially iPhone — and covers products, categories, units, stock thresholds, alerts, history and usage analytics, all behind role-based access control.$$,
    $$Designed for the day-to-day work of a medical cabinet, where both the doctor and the secretary handle stock, often from a phone rather than a desktop computer.$$,
    $$In a medical cabinet, it is easy to lose track of consumables. Items run out without warning, it is not always clear who changed what, and not everyone should have the same permissions. The tool also has to be comfortable to use on a phone during a working day.$$,
    $$A PWA built with Angular 18 on top of a Spring Boot (Java 21) REST API and a PostgreSQL database whose schema is versioned with Flyway. Stock is organised into products, categories and units. Each product can have a threshold that triggers an alert. Doctors and secretaries get different permissions, the doctor controls account activation, and changes are kept in a history so that stock movements can be traced.$$,
    $$Full-stack development: Angular PWA, Spring Boot API and PostgreSQL schema.$$,
    $$A classic layered architecture: an installable Angular client talks to a Spring Boot REST API, which owns the business rules and persists data in PostgreSQL. Flyway migrations keep the database schema versioned alongside the code.$$,
    $$["Angular PWA|Installable, mobile-first client", "REST API|JSON over HTTPS", "Spring Boot|Business rules, security and RBAC", "PostgreSQL|Relational data", "Flyway migrations|Versioned schema changes"]$$::jsonb,
    $$["Authentication", "Doctor and secretary roles", "Role-based access control (RBAC)", "Doctor-controlled account activation", "Stock management", "Products, categories and units", "Stock thresholds", "Low-stock alerts", "Dashboard", "History / audit trail", "Usage analytics", "Profile management"]$$::jsonb,
    '[]'::jsonb,
    $$["Modelling what a doctor can do compared with a secretary, and applying those rules consistently.", "Doctor-controlled activation, so new accounts cannot use the app until they are approved.", "Defining stock thresholds and deciding when a product should raise an alert.", "Keeping a history of stock changes so every movement can be traced.", "Fitting a data-heavy interface comfortably on an iPhone screen.", "Evolving the database schema safely with versioned Flyway migrations."]$$::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    'CURRENT', TRUE, TRUE, 1
),
(
    'studymate-ai',
    'StudyMate AI',
    $$An AI-powered learning assistant for working with educational PDF documents.$$,
    $$StudyMate AI lets a learner upload course PDFs and work with them through an AI chat. Documents are processed and stored for vector search, so the conversation can draw on the content of the uploaded material.$$,
    NULL,
    $$Course material often lives in long PDFs. Finding the relevant passage, or asking a follow-up question about it, usually means scrolling and re-reading.$$,
    $$A React and TypeScript interface backed by a FastAPI service. Uploaded PDFs go through a document-processing step, their content is stored in Qdrant for vector search, and relevant context is sent to an LLM API to produce a response, which the learner sees in the chat. PostgreSQL is part of the data layer, and the services run with Docker.$$,
    NULL,
    $$Data flows from the uploaded PDF through the FastAPI backend, a document-processing step and vector storage in Qdrant, then to an LLM API. The response is returned to the React interface.$$,
    $$["PDF|Uploaded by the learner", "Backend|FastAPI receives the document", "Document processing|Content is extracted and prepared", "Vector storage|Qdrant enables vector search", "LLM API|Generates a response using document context", "AI response|Returned by the API", "React interface|Shown in the chat"]$$::jsonb,
    $$["PDF upload", "Document processing", "AI chat", "Contextual interaction with documents", "Vector search", "Learning-oriented interaction"]$$::jsonb,
    '[]'::jsonb,
    $$["Turning PDF content into a form that can be searched by meaning, not only by keywords.", "Choosing which document context to send to the LLM for a given question.", "Keeping the chat responsive while documents are being processed.", "Running several services (API, PostgreSQL, Qdrant) consistently with Docker."]$$::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    NULL, TRUE, TRUE, 2
),
(
    'hezly',
    'Hezly — Transport & Expedition Platform',
    $$Frontend work on a transport and expedition platform during my internship at MajraDeep.$$,
    $$Hezly is a platform for transport and expedition services, including routes across Europe and between France and Tunisia. During my internship at MajraDeep, I worked on the frontend of its public interface with Angular 18 and TypeScript.$$,
    $$Internship project at MajraDeep. The platform has a Spring Boot backend in a microservices environment. My work was on the frontend.$$,
    $$The public interface has to present transport and expedition services, including Europe and France–Tunisia / Tunisia–France routes, clearly to the people looking for them.$$,
    $$An Angular 18 public interface that presents the platform's transport and expedition services and communicates with the backend through REST APIs.$$,
    $$Frontend / Software Development Intern. My scope was the frontend. The backend services were built by the wider team and were outside my responsibilities.$$,
    $$Broader platform, not my contribution: a Spring Boot backend organised as microservices and exposing REST APIs. My contribution sits in the Angular frontend layer.$$,
    $$["Angular 18 frontend|My contribution", "REST APIs|Contract between frontend and backend", "Spring Boot microservices|Broader platform, built by the team"]$$::jsonb,
    $$["Public interface for transport and expedition services", "Europe routes", "France–Tunisia and Tunisia–France routes"]$$::jsonb,
    $$["Frontend development of the public interface with Angular 18 and TypeScript", "Building interface components for the platform's transport and expedition services", "Working with the REST APIs exposed by the platform's backend"]$$::jsonb,
    $$["Presenting several routes and service types clearly on both mobile and desktop.", "Working within an existing platform whose backend was owned by other team members."]$$::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    'INTERNSHIP', TRUE, TRUE, 3
),
(
    'badhra',
    'Badhra — AI for Agriculture',
    $$Exploring how existing farmer and soil information could support agricultural decisions.$$,
    $$Badhra is an early-stage agriculture and AI project. It explores whether information farmers already have, such as soil analysis results, can support decisions like crop selection and treatment recommendations. The project is still evolving and is not a finished product.$$,
    NULL,
    $$Soil analysis results and farm information are not always easy to turn into concrete decisions, such as which crop suits a field or which treatment makes sense.$$,
    $$Proposed: a tool that takes existing farmer and soil information and helps interpret it, for example by explaining a soil analysis, suggesting suitable crops and proposing treatments. Recommendations would be validated against real field conditions before anyone relies on them.$$,
    NULL,
    $$Technical direction, still being defined: a pipeline from structured farmer and soil data to AI-assisted interpretation and recommendations, with field validation as a required step rather than an afterthought.$$,
    $$["Farmer & soil data|Information that already exists", "Interpretation|Reading soil analysis results", "Recommendations|Crop selection and treatments", "Field validation|Checked against real conditions"]$$::jsonb,
    $$["Soil analysis interpretation (planned)", "Crop selection support (planned)", "Treatment recommendations (planned)"]$$::jsonb,
    '[]'::jsonb,
    $$["Field validation: recommendations have to be checked against real field conditions before they can be trusted.", "Data quality: farmer and soil information may be incomplete or inconsistent."]$$::jsonb,
    '[]'::jsonb,
    $$["What farmer and soil data is actually available, and in which formats?", "How reliable can recommendations be when data is incomplete?", "How should recommendations be validated in the field before anyone relies on them?", "How should uncertainty be communicated to farmers?"]$$::jsonb,
    'RESEARCH', TRUE, TRUE, 4
),
(
    'netai-monitor',
    'NetAI-Monitor',
    $$An experimental infrastructure and network monitoring project with an AI assistant.$$,
    $$An experimental project exploring infrastructure and network monitoring combined with an AI assistant. It brings together concepts such as SNMP and SSH access to devices, a FastAPI backend, a React interface, and MongoDB and Qdrant for storage and search. It is a learning project and is not production-ready.$$,
    NULL,
    $$Monitoring information about network infrastructure is spread across devices and tools, and it is not always easy to ask questions about it.$$,
    $$An experiment that combines monitoring data with an AI assistant, so the infrastructure can be explored through questions as well as dashboards.$$,
    NULL,
    $$Experimental: this describes the intended design, not a finished system.$$,
    $$["Network devices|SNMP / SSH", "FastAPI backend|Collection and API", "MongoDB + Qdrant|Storage and vector search", "AI assistant|Questions about the infrastructure", "React interface|Monitoring views"]$$::jsonb,
    $$["Infrastructure monitoring (experimental)", "Network monitoring over SNMP / SSH (experimental)", "AI assistant (experimental)"]$$::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    'EXPERIMENTAL', FALSE, TRUE, 5
),
(
    'smartcabinet',
    'SmartCabinet',
    NULL,
    $$TODO: add details for the earlier SmartCabinet application from the SmartCabinet PDF (screenshots, features, verified technologies), then publish it from the admin dashboard. This is a separate, older project, distinct from the Medical Cabinet Stock Management PWA.$$,
    NULL, NULL, NULL, NULL, NULL,
    '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb,
    'DRAFT', FALSE, FALSE, 6
);

-- Project technologies (ordered)
INSERT INTO project_technologies (project_id, technology_id, position)
SELECT p.id, t.id, (x.ord - 1)::int
FROM projects p
CROSS JOIN LATERAL unnest(CASE p.slug
    WHEN 'medical-cabinet-stock-management' THEN ARRAY['Angular 18', 'Spring Boot', 'Java 21', 'PostgreSQL', 'Flyway', 'PWA', 'REST API', 'RBAC']
    WHEN 'studymate-ai' THEN ARRAY['React', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Qdrant', 'Docker', 'LLM API']
    WHEN 'hezly' THEN ARRAY['Angular 18', 'TypeScript', 'REST API', 'Spring Boot']
    WHEN 'netai-monitor' THEN ARRAY['FastAPI', 'React', 'MongoDB', 'Qdrant', 'Docker', 'SNMP', 'SSH']
    ELSE ARRAY[]::text[]
END) WITH ORDINALITY AS x(name, ord)
JOIN technologies t ON t.name = x.name;

-- ---------------------------------------------------------------------
-- Experience
-- ---------------------------------------------------------------------
INSERT INTO experiences (organization, role, employment_type, period_label, location, summary, responsibilities, technologies, project_slug, display_order)
VALUES (
    'MajraDeep',
    'Frontend / Software Development Intern',
    'Internship',
    NULL, -- TODO: add the internship period
    NULL,
    $$Internship focused on frontend development for Hezly, a transport and expedition platform.$$,
    $$["Frontend development of Hezly's public interface with Angular 18 and TypeScript", "Building interface components for transport and expedition services", "Working with the REST APIs exposed by the platform's Spring Boot backend"]$$::jsonb,
    $$["Angular 18", "TypeScript", "REST APIs"]$$::jsonb,
    'hezly',
    1
);

-- ---------------------------------------------------------------------
-- Leadership
-- ---------------------------------------------------------------------
INSERT INTO leadership_roles (organization, role, period_label, summary, organizational, technical, display_order) VALUES
(
    'IEEE ISIMA Student Branch',
    'General Secretary',
    '2025–2026',
    $$General Secretary of the IEEE student branch at ISI Mahdia, a role that covers both how the branch is organised and its technical activities.$$,
    $$["Coordination across the branch's teams and activities", "Documentation and organisation of branch work", "Contributing to the student engineering community"]$$::jsonb,
    $$["Involvement in the branch's technical activities", "Involvement in software and AI-related initiatives"]$$::jsonb,
    1
),
(
    'IEEE Women in Engineering',
    'Vice Chair',
    '2024–2025',
    NULL,
    '[]'::jsonb,
    '[]'::jsonb,
    2
),
(
    'TRY IT',
    'Sponsorship Manager',
    NULL, -- TODO: add the period
    NULL,
    '[]'::jsonb,
    '[]'::jsonb,
    3
);

-- ---------------------------------------------------------------------
-- Skills (no percentages, no invented proficiency levels)
-- ---------------------------------------------------------------------
INSERT INTO skills (name, category, description, icon, display_order) VALUES
    ('Java',          'LANGUAGES', 'Main backend language, used with Spring Boot.',        'coffee',    1),
    ('TypeScript',    'LANGUAGES', 'Typed frontend code in Angular and React.',            'file-code', 2),
    ('JavaScript',    'LANGUAGES', 'The language of the web platform.',                    'braces',    3),
    ('Python',        'LANGUAGES', 'FastAPI services and AI-related work.',                'terminal',  4),
    ('SQL',           'LANGUAGES', 'Relational modelling and queries.',                    'database',  5),
    ('HTML',          'LANGUAGES', 'Semantic, accessible markup.',                         'code',      6),
    ('CSS',           'LANGUAGES', 'Layout, responsive design and styling.',               'palette',   7),

    ('React',         'FRONTEND',  'Component-based interfaces with TypeScript.',          'atom',      1),
    ('Angular',       'FRONTEND',  'Angular 18 applications, including a PWA.',            'layout',    2),
    ('Tailwind CSS',  'FRONTEND',  'Utility-first styling and design systems.',            'wind',      3),
    ('Vite',          'FRONTEND',  'Fast frontend tooling and builds.',                    'zap',       4),

    ('Spring Boot',   'BACKEND',   'REST APIs, security and persistence in Java.',         'leaf',      1),
    ('FastAPI',       'BACKEND',   'Python APIs for AI-oriented services.',                'server',    2),
    ('REST APIs',     'BACKEND',   'Designing and consuming HTTP APIs.',                   'network',   3),

    ('PostgreSQL',    'DATABASES', 'Relational database, with Flyway migrations.',         'database',  1),
    ('MongoDB',       'DATABASES', 'Document storage.',                                    'layers',    2),
    ('Qdrant',        'DATABASES', 'Vector database for semantic search.',                 'search',    3),

    ('LLM APIs',                 'AI', 'Integrating large language models into applications.', 'sparkles', 1),
    ('AI-powered applications',  'AI', 'Building product features around AI.',                  'bot',      2),
    ('NLP experimentation',      'AI', 'Experimenting with natural language processing.',       'message',  3),
    ('Vector databases',         'AI', 'Storing and searching embeddings.',                     'boxes',    4),

    ('Git',           'TOOLS',     'Version control.',                                     'git',       1),
    ('GitHub',        'TOOLS',     'Hosting, collaboration and CI.',                       'github',    2),
    ('Docker',        'TOOLS',     'Containerised development environments.',              'container', 3),
    ('Flyway',        'TOOLS',     'Versioned database migrations.',                       'history',   4),
    ('Linux / WSL',   'TOOLS',     'Day-to-day development on Linux and WSL.',             'terminal',  5),
    ('IntelliJ IDEA', 'TOOLS',     'Java development environment.',                        'code',      6),
    ('DBeaver',       'TOOLS',     'Database inspection and queries.',                     'table',     7),
    ('Bruno',         'TOOLS',     'API testing and request collections.',                 'send',      8);
