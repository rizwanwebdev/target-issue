# TargetIssue

**TargetIssue** is a multi-tenant project and issue management platform built around a simple idea: give teams a structured place to plan work, assign responsibility, track progress, and resolve issues.

It models the way engineering teams actually work — from an organization and its members, through teams and projects, down to individual issues, tasks, and activity.

## Features

* 🏢 **Organizations** — Create isolated workspaces for teams and projects
* 👥 **Members & Invitations** — Invite users and manage organization membership
* 🔐 **Role-Based Access** — Control what members can see and do
* 👨‍💻 **Teams** — Organize members into functional teams
* 📁 **Projects** — Manage multiple projects inside an organization
* 🎯 **Issues** — Track bugs, features, improvements, and other work
* 👤 **Assignments** — Assign issues to teams and individual members
* 🚦 **Priority & Severity** — Distinguish urgency from technical impact
* 🏷️ **Labels** — Categorize and filter issues
* 📋 **Todos & Subtasks** — Break larger issues into actionable work
* 💬 **Comments** — Discuss work directly on issues
* 🔄 **Issue Workflows** — Move issues through defined states
* 🔔 **Notifications** — Keep members informed about relevant activity
* 📜 **Activity Logs** — Track changes and important actions
* 📊 **Project & Team Visibility** — Understand what is happening across the workspace

## Core Workflow

```text
User
 │
 ▼
Organization
 │
 ├── Members
 │
 ├── Teams
 │    └── Team Members
 │
 └── Projects
      │
      ├── Project Members
      │
      └── Issues
           │
           ├── Assignee
           ├── Team
           ├── Priority
           ├── Severity
           ├── Status
           ├── Labels
           ├── Todos
           ├── Subtasks
           ├── Comments
           └── Activity
```

A typical workflow looks like:

```text
Create Organization
        ↓
Invite Members
        ↓
Create Teams
        ↓
Create Project
        ↓
Add Project Members
        ↓
Create Issue
        ↓
Assign Team / Member
        ↓
Set Priority & Severity
        ↓
Create Todos / Subtasks
        ↓
Work on Issue
        ↓
Review
        ↓
Resolve
```

## Issue Lifecycle

```text
Backlog
   ↓
Todo
   ↓
In Progress
   ↓
In Review
   ↓
Done
```

Issues can also become **Blocked** or **Reopened** when circumstances require it.

## Priority vs Severity

TargetIssue keeps these concepts separate.

**Priority** describes how urgently something should be handled:

```text
Urgent
High
Medium
Low
```

**Severity** describes the impact of the issue:

```text
Critical
Major
Minor
Trivial
```

This allows a team to distinguish between something that is highly urgent and something that is technically severe.

## Multi-Tenant Workspace

Each organization is an isolated workspace.

```text
Organization A
├── Members
├── Teams
├── Projects
└── Issues

Organization B
├── Members
├── Teams
├── Projects
└── Issues
```

Users can belong to multiple organizations, with their membership and permissions managed independently in each one.

## Documentation

The system architecture, workflows, data relationships, and technical design are documented separately:

**[Architecture Documentation](./ARCHITECTURE.md)**

That document contains the deeper technical design and Mermaid diagrams for the system.

## Project Status

> 🚧 **Under active development**

The project is being built incrementally, with the focus on implementing the core domain correctly before expanding into additional functionality.

## License

This project is currently for educational and portfolio purposes.
