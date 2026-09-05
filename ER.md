A proper **database ER diagram** where tables are visually connected with relationship lines and each table shows its SQL-style columns.

```mermaid
erDiagram

    USERS {
        UUID id PK
        VARCHAR email UK
        VARCHAR username UK
        TEXT password_hash
        VARCHAR full_name
        TEXT avatar_url
        BOOLEAN email_verified
        BOOLEAN is_active
        TIMESTAMPTZ last_login_at
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    SESSIONS {
        UUID id PK
        UUID user_id FK
        VARCHAR ip_address
        TEXT user_agent
        VARCHAR device_name
        BOOLEAN is_active
        TIMESTAMPTZ last_used_at
        TIMESTAMPTZ expires_at
        TIMESTAMPTZ created_at
    }

    REFRESH_TOKENS {
        UUID id PK
        UUID user_id FK
        UUID session_id FK
        TEXT token_hash
        TIMESTAMPTZ expires_at
        TIMESTAMPTZ revoked_at
        TIMESTAMPTZ created_at
    }

    OTP_VERIFICATIONS {
        UUID id PK
        UUID user_id FK
        VARCHAR email
        TEXT code_hash
        VARCHAR type
        INTEGER attempts
        TIMESTAMPTZ expires_at
        TIMESTAMPTZ verified_at
        TIMESTAMPTZ created_at
    }

    PASSWORD_RESET_TOKENS {
        UUID id PK
        UUID user_id FK
        TEXT token_hash
        TIMESTAMPTZ expires_at
        TIMESTAMPTZ used_at
        TIMESTAMPTZ created_at
    }

    ORGANIZATIONS {
        UUID id PK
        VARCHAR name
        VARCHAR slug UK
        TEXT description
        TEXT logo_url
        UUID created_by FK
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    ORGANIZATION_MEMBERS {
        UUID id PK
        UUID organization_id FK
        UUID user_id FK
        VARCHAR role
        TIMESTAMPTZ joined_at
        TIMESTAMPTZ created_at
    }

    ORGANIZATION_INVITATIONS {
        UUID id PK
        UUID organization_id FK
        VARCHAR email
        VARCHAR role
        TEXT token_hash
        UUID invited_by FK
        TIMESTAMPTZ expires_at
        TIMESTAMPTZ accepted_at
        TIMESTAMPTZ created_at
    }

    TEAMS {
        UUID id PK
        UUID organization_id FK
        VARCHAR name
        VARCHAR slug
        TEXT description
        UUID created_by FK
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    TEAM_MEMBERS {
        UUID id PK
        UUID team_id FK
        UUID user_id FK
        VARCHAR role
        TIMESTAMPTZ joined_at
        TIMESTAMPTZ created_at
    }

    PROJECTS {
        UUID id PK
        UUID organization_id FK
        UUID team_id FK
        VARCHAR name
        VARCHAR key
        TEXT description
        VARCHAR status
        UUID created_by FK
        DATE start_date
        DATE target_date
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    PROJECT_MEMBERS {
        UUID id PK
        UUID project_id FK
        UUID user_id FK
        VARCHAR role
        UUID added_by FK
        TIMESTAMPTZ created_at
    }

    PROJECT_LABELS {
        UUID id PK
        UUID project_id FK
        VARCHAR name
        VARCHAR color
        TEXT description
        TIMESTAMPTZ created_at
    }

    ISSUES {
        UUID id PK
        UUID organization_id FK
        UUID project_id FK
        INTEGER issue_number
        VARCHAR title
        TEXT description
        VARCHAR status
        VARCHAR priority
        VARCHAR severity
        UUID reporter_id FK
        UUID created_by FK
        DATE due_date
        TIMESTAMPTZ resolved_at
        TIMESTAMPTZ closed_at
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    ISSUE_ASSIGNEES {
        UUID id PK
        UUID issue_id FK
        UUID user_id FK
        UUID assigned_by FK
        TIMESTAMPTZ assigned_at
    }

    ISSUE_COMMENTS {
        UUID id PK
        UUID issue_id FK
        UUID user_id FK
        TEXT content
        TIMESTAMPTZ edited_at
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    ISSUE_LABELS {
        UUID issue_id PK, FK
        UUID label_id PK, FK
    }

    TODOS {
        UUID id PK
        UUID organization_id FK
        UUID project_id FK
        UUID issue_id FK
        VARCHAR title
        TEXT description
        VARCHAR status
        VARCHAR priority
        UUID created_by FK
        TIMESTAMPTZ due_date
        TIMESTAMPTZ completed_at
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    TODO_ASSIGNEES {
        UUID id PK
        UUID todo_id FK
        UUID user_id FK
        TIMESTAMPTZ assigned_at
    }

    ISSUE_ACTIVITY {
        UUID id PK
        UUID issue_id FK
        UUID actor_id FK
        VARCHAR action
        VARCHAR field_name
        TEXT old_value
        TEXT new_value
        TIMESTAMPTZ created_at
    }

    NOTIFICATIONS {
        UUID id PK
        UUID user_id FK
        VARCHAR type
        VARCHAR title
        TEXT message
        VARCHAR entity_type
        UUID entity_id
        BOOLEAN is_read
        TIMESTAMPTZ read_at
        TIMESTAMPTZ created_at
    }


    %% AUTH RELATIONSHIPS

    USERS ||--o{ SESSIONS : "has"
    USERS ||--o{ REFRESH_TOKENS : "owns"
    SESSIONS ||--o{ REFRESH_TOKENS : "contains"

    USERS ||--o{ OTP_VERIFICATIONS : "receives"
    USERS ||--o{ PASSWORD_RESET_TOKENS : "requests"


    %% ORGANIZATION RELATIONSHIPS

    USERS ||--o{ ORGANIZATIONS : "creates"

    USERS ||--o{ ORGANIZATION_MEMBERS : "joins"
    ORGANIZATIONS ||--o{ ORGANIZATION_MEMBERS : "has"

    ORGANIZATIONS ||--o{ ORGANIZATION_INVITATIONS : "has"
    USERS ||--o{ ORGANIZATION_INVITATIONS : "sends"


    %% TEAM RELATIONSHIPS

    ORGANIZATIONS ||--o{ TEAMS : "contains"

    TEAMS ||--o{ TEAM_MEMBERS : "has"
    USERS ||--o{ TEAM_MEMBERS : "joins"


    %% PROJECT RELATIONSHIPS

    ORGANIZATIONS ||--o{ PROJECTS : "owns"
    TEAMS ||--o{ PROJECTS : "manages"

    PROJECTS ||--o{ PROJECT_MEMBERS : "has"
    USERS ||--o{ PROJECT_MEMBERS : "joins"


    %% LABEL RELATIONSHIPS

    PROJECTS ||--o{ PROJECT_LABELS : "has"


    %% ISSUE RELATIONSHIPS

    ORGANIZATIONS ||--o{ ISSUES : "contains"
    PROJECTS ||--o{ ISSUES : "contains"

    USERS ||--o{ ISSUES : "reports"
    USERS ||--o{ ISSUES : "creates"

    ISSUES ||--o{ ISSUE_ASSIGNEES : "has"
    USERS ||--o{ ISSUE_ASSIGNEES : "assigned"

    ISSUES ||--o{ ISSUE_COMMENTS : "contains"
    USERS ||--o{ ISSUE_COMMENTS : "writes"


    %% ISSUE LABEL RELATIONSHIPS

    ISSUES ||--o{ ISSUE_LABELS : "has"
    PROJECT_LABELS ||--o{ ISSUE_LABELS : "used"


    %% TODO RELATIONSHIPS

    ORGANIZATIONS ||--o{ TODOS : "owns"
    PROJECTS ||--o{ TODOS : "contains"
    ISSUES ||--o{ TODOS : "contains"

    TODOS ||--o{ TODO_ASSIGNEES : "has"
    USERS ||--o{ TODO_ASSIGNEES : "assigned"


    %% ACTIVITY RELATIONSHIPS

    ISSUES ||--o{ ISSUE_ACTIVITY : "tracks"
    USERS ||--o{ ISSUE_ACTIVITY : "performs"


    %% NOTIFICATION RELATIONSHIPS

    USERS ||--o{ NOTIFICATIONS : "receives"
```

## How to read the lines

Mermaid ER notation:

```text
||--o{
```

Means:

```text
One ──────── Zero or Many
```

For example:

```mermaid
erDiagram
    USERS ||--o{ ORGANIZATION_MEMBERS : belongs_to
    ORGANIZATIONS ||--o{ ORGANIZATION_MEMBERS : has
```

Visually the relationship means:

```text
                 ORGANIZATION_MEMBERS
                 ┌──────────────────┐
USERS ───────────┤ user_id           │
                 │ organization_id   ├──────── ORGANIZATIONS
                 └──────────────────┘
```

This creates the many-to-many relationship:

```text
USER A ─────┐
            │
USER B ─────┼──── ORGANIZATION MEMBERS ──── ORGANIZATION A
            │
USER C ─────┘
```

---

## Important improvement to the schema

I would make one architectural decision before you start migrations:

### `organization_id` in issues

You technically don't need both:

```text
issues.organization_id
issues.project_id
```

Because:

```text
Issue
  ↓
Project
  ↓
Organization
```

You can determine the organization through the project.

So you have two options.

### Option A — Normalized

```text
issues
├── id
└── project_id
```

Query organization through joins.

### Option B — Denormalized

```text
issues
├── id
├── organization_id
└── project_id
```

Faster filtering but creates duplicate relationship data.

For this project, I recommend **Option A**. It teaches better relational database design.

The same thinking applies to:

```text
todos.organization_id
```

if the todo already belongs to a project.

---

## Simplified relationship hierarchy

Keep this mental model while building:

```mermaid
flowchart TD

    U[Users]

    U --> OM[Organization Members]
    OM --> O[Organizations]

    O --> T[Teams]
    U --> TM[Team Members]
    TM --> T

    O --> P[Projects]

    U --> PM[Project Members]
    PM --> P

    P --> I[Issues]

    I --> IA[Issue Assignees]
    IA --> U

    I --> IC[Issue Comments]
    IC --> U

    I --> IL[Issue Labels]
    IL --> PL[Project Labels]

    P --> TD[Todos]
    I --> TD

    TD --> TA[Todo Assignees]
    TA --> U
```

I recommend keeping **both diagrams** in your `architecture.md`:

1. The large ER diagram — complete database reference.
2. The simplified flowchart — easy mental model.

The large diagram will become difficult to read as your SaaS grows, which is normal in real systems.

---

Any other questions?

**Suggested topic: Database normalization** — relationships, duplication, query design.
