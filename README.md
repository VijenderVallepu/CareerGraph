# CareerGraph

## Graph-Based Career Recommendation System

CareerGraph is a graph-based career recommendation system that helps users discover suitable jobs based on their existing skills.

The application models relationships between:

- Users
- Skills
- Jobs
- Companies
- Cities

The graph database is used to traverse these relationships and provide career recommendations.

---

# 1. Project Overview

CareerGraph allows a user to:

1. View their existing skills.
2. Find jobs matching their skills.
3. View the skills required for a selected job.
4. Identify skills they need to learn.
5. Discover companies offering those jobs.
6. Find the locations of those companies.

The application uses:

- React for the frontend
- FastAPI for the backend
- CognoDB for graph storage
- Cypher for graph queries

---

# 2. Architecture

```text
                    React Frontend
                         |
                         | HTTP / REST API
                         ↓
                    FastAPI Backend
                         |
                         | Cypher
                         ↓
                    CognoDB
                   Graph Database
