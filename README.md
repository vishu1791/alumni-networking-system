# Alumni Networking System (Backend)

**Stack:** Java • Spring Boot • REST APIs • Spring Data JPA / Hibernate • MySQL

**Submitted by:** Krushna Vishwanath Ghuge | **Roll No:** 23349

---

## 1. Project Overview

The Alumni Networking System is a backend application for an institute's alumni community. Graduates can maintain professional profiles, discover other alumni with shared skills or backgrounds, and share or browse career opportunities. Administrators moderate profiles and job postings to keep the platform trustworthy.

The project exposes a set of REST APIs, built with a layered **Controller → Service → Repository** architecture, backed by a MySQL database. It is backend-only; all testing is done through Postman.

### 1.1 Objectives

- Let alumni register and maintain a professional profile.
- Let anyone (authorised) search and filter alumni by graduation year, skills, organisation, or role.
- Let alumni publish, view, update, and close job opportunities.
- Let administrators review and moderate profiles and job postings.
- Protect privacy: private contact details are never exposed by default.
- Demonstrate validation, global exception handling, meaningful HTTP status codes, and clean REST design.

### 1.2 Scope

| In scope | Out of scope (unless added as optional extension) |
|---|---|
| Alumni profiles, skills, organisations | Frontend / UI |
| Job posting lifecycle (publish, update, close) | Real email / SMS sending |
| Search, filter, pagination | Cloud deployment |
| Admin moderation | Payment or any real third-party integration |
| Validation and error handling | Chat / messaging between alumni |

---

## 2. User Roles

| Role | Description | Key permissions |
|---|---|---|
| **Alumnus / Alumna** | A registered graduate of the institute | Create and edit **own** profile; search alumni; post, update, and close **own** jobs; view public profiles and open jobs |
| **Administrator** | Institute staff managing the platform | Everything an alumnus can do on the platform, plus review/approve/reject/hide profiles and job postings, and view private fields where required for moderation |

> **Access-control assumption:** Authentication is optional per the project guidelines. A simple approach is to identify the caller using request headers (user ID and role) and enforce rules in the service layer. JWT-based authentication can be added later as an extension. Whichever approach is chosen must be documented here.

---

## 3. Functional Requirements

### FR-1: Alumni Profile Management
- **FR-1.1** Register a new alumni profile.
- **FR-1.2** Store: full name, email, phone (private), graduation year, department, degree/programme, current organisation, current role/designation, location, short bio, professional interests, and skills.
- **FR-1.3** View a single alumni profile (public view by default).
- **FR-1.4** Update a profile — **only the profile owner** may edit it.
- **FR-1.5** Profile has a status (for example: Pending, Approved, Rejected, Hidden) used for moderation.
- **FR-1.6** Email must be unique across alumni.

### FR-2: Skills
- **FR-2.1** An alumnus can attach multiple skills to their profile.
- **FR-2.2** Skills are stored in a master list so the same skill name is not duplicated (case-insensitive).
- **FR-2.3** A skill can belong to many alumni (many-to-many).

### FR-3: Organisations
- **FR-3.1** Store organisation name, industry, and location.
- **FR-3.2** An alumnus's current organisation links to an Organisation record; an existing organisation is reused instead of being duplicated.
- **FR-3.3** A job opportunity is also associated with an organisation.

### FR-4: Search and Filter Alumni
- **FR-4.1** Filter by **graduation year**, **skill**, **organisation**, and **role** (any combination, all optional).
- **FR-4.2** Results are **paginated** and **sortable** (for example by name or graduation year).
- **FR-4.3** Search returns only profiles that are Approved and only **public** fields.
- **FR-4.4** Invalid filter or pagination values (negative page, absurd size, invalid year) return a validation error.

### FR-5: Job Opportunities
- **FR-5.1** Publish a job opportunity with: title, description, organisation, location, job type (Full-time / Part-time / Internship / Contract), required skills, experience level, application deadline or contact method, and posted-by alumnus.
- **FR-5.2** View a single job and list jobs with filters (status, organisation, location, job type, skill) and pagination.
- **FR-5.3** Update a job — **only the poster** (or admin) may update it.
- **FR-5.4** **Close** a job — only the poster (or admin). A closed job cannot be closed again and cannot be edited into an open state without a defined rule.
- **FR-5.5** Job status values: Pending (awaiting moderation, if used), Open, Closed, Rejected/Removed.
- **FR-5.6** Deadline, if provided, cannot be in the past at the time of posting.

### FR-6: Administration and Moderation
- **FR-6.1** Admin can list profiles and jobs awaiting review.
- **FR-6.2** Admin can approve, reject, or hide a profile, with an optional remark.
- **FR-6.3** Admin can approve, reject, or remove a job posting, with an optional remark.
- **FR-6.4** Only users with the Administrator role can perform moderation actions; others receive a forbidden response.

### FR-7: Validation and Error Handling
- **FR-7.1** All request bodies are validated (required fields, formats, length limits, valid ranges).
- **FR-7.2** A **global exception handler** returns a consistent JSON error structure (timestamp, status, error, message, path, and field-level errors where relevant).
- **FR-7.3** Proper HTTP status codes are returned for every outcome (see Section 7).

---

## 4. Business Rules and Validation

### 4.1 Business Rules

| # | Rule |
|---|---|
| BR-1 | Only the profile owner may edit their own profile. |
| BR-2 | Only the job poster or an administrator may update or close a job posting. |
| BR-3 | Only administrators may moderate (approve / reject / hide) profiles and jobs. |
| BR-4 | Private contact details (phone, and optionally email) are **not** returned in public responses. |
| BR-5 | Email addresses are unique. |
| BR-6 | Only **Approved** profiles appear in search results; only **Open** (and approved) jobs appear in the public job list by default. |
| BR-7 | A closed job cannot be closed again. |
| BR-8 | Graduation year must be realistic (for example, between 1950 and the current year + 1). |
| BR-9 | A job must belong to a valid organisation and be posted by an existing alumnus. |
| BR-10 | Deleting is avoided; use status changes (soft removal) so history is preserved. |

### 4.2 Field Validation Summary

| Field | Rules |
|---|---|
| Full name | Required, 2–100 characters |
| Email | Required, valid format, unique |
| Phone | Optional, valid phone pattern, private |
| Graduation year | Required, within allowed range |
| Department | Required, max 100 characters |
| Skills | Each skill 1–50 characters; maximum number of skills per profile (for example 20) |
| Bio | Optional, max 1000 characters |
| Job title | Required, 3–150 characters |
| Job description | Required, 10–3000 characters |
| Job deadline | Optional; if present, must not be in the past |
| Pagination | Page ≥ 0, size between 1 and 100 |

### 4.3 Public vs Private Profile Fields (Document Decision)

| Field | Visibility |
|---|---|
| Full name | Public |
| Graduation year, department | Public |
| Skills | Public |
| Current organisation, current role | Public |
| Professional interests, short bio | Public |
| Location (city level) | Public |
| Email | **Private** (visible to owner and admin only) |
| Phone | **Private** (visible to owner and admin only) |
| Moderation status and remarks | Owner and admin only |

---

## 5. Data Model

### 5.1 Entities

**AlumniProfile**
| Column | Notes |
|---|---|
| id | Primary key |
| full_name | Required |
| email | Required, unique, private |
| phone | Optional, private |
| graduation_year | Required |
| department | Required |
| current_role | Optional |
| location | Optional |
| bio | Optional |
| interests | Optional |
| status | Pending / Approved / Rejected / Hidden |
| moderation_remark | Optional |
| organisation_id | Foreign key → Organisation (current organisation) |
| created_at, updated_at | Timestamps |

**Skill**
| Column | Notes |
|---|---|
| id | Primary key |
| name | Required, unique (case-insensitive) |

**Organisation**
| Column | Notes |
|---|---|
| id | Primary key |
| name | Required, unique |
| industry | Optional |
| location | Optional |

**JobOpportunity**
| Column | Notes |
|---|---|
| id | Primary key |
| title | Required |
| description | Required |
| job_type | Full-time / Part-time / Internship / Contract |
| experience_level | Optional |
| location | Optional |
| deadline | Optional |
| status | Pending / Open / Closed / Rejected |
| moderation_remark | Optional |
| posted_by | Foreign key → AlumniProfile |
| organisation_id | Foreign key → Organisation |
| created_at, updated_at | Timestamps |

**Join tables**
- `alumni_skill` (alumni_id, skill_id) — many-to-many between AlumniProfile and Skill.
- `job_skill` (job_id, skill_id) — many-to-many between JobOpportunity and Skill.

### 5.2 Relationships

| Relationship | Type |
|---|---|
| Organisation → AlumniProfile | One-to-many |
| Organisation → JobOpportunity | One-to-many |
| AlumniProfile → JobOpportunity (posted by) | One-to-many |
| AlumniProfile ↔ Skill | Many-to-many |
| JobOpportunity ↔ Skill | Many-to-many |

### 5.3 ER Diagram

Create the ER diagram (using draw.io, dbdiagram.io, or MySQL Workbench) based on the tables above and place it in the `docs/` folder as `er-diagram.png`. Reference it here:

`![ER Diagram](docs/er-diagram.png)`

---

## 6. REST API Design

Base path: `/api`

### 6.1 Alumni

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/alumni` | Register an alumni profile | Anyone / new alumnus |
| GET | `/api/alumni` | Search and filter alumni (paginated) | Authorised users |
| GET | `/api/alumni/{id}` | Get one alumni profile (public view; full view for owner/admin) | Authorised users |
| PUT | `/api/alumni/{id}` | Update a profile | Owner only |

**Query parameters for `GET /api/alumni`:** `graduationYear`, `skill`, `organisation`, `role`, `page`, `size`, `sortBy`, `direction`

### 6.2 Jobs

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/jobs` | Publish a job opportunity | Alumnus |
| GET | `/api/jobs` | List jobs with filters and pagination | Authorised users |
| GET | `/api/jobs/{id}` | Get one job | Authorised users |
| PUT | `/api/jobs/{id}` | Update a job | Poster / admin |
| PATCH | `/api/jobs/{id}/close` | Close a job | Poster / admin |

**Query parameters for `GET /api/jobs`:** `status`, `organisation`, `location`, `jobType`, `skill`, `page`, `size`, `sortBy`, `direction`

### 6.3 Admin / Moderation

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/admin/alumni/pending` | List profiles awaiting review | Admin |
| PATCH | `/api/admin/alumni/{id}/moderate` | Approve / reject / hide a profile with remark | Admin |
| GET | `/api/admin/jobs/pending` | List jobs awaiting review | Admin |
| PATCH | `/api/admin/jobs/{id}/moderate` | Approve / reject / remove a job with remark | Admin |

### 6.4 Supporting Endpoints (Optional but Useful)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/skills` | List all skills |
| POST | `/api/organisations` | Create an organisation |
| GET | `/api/organisations` | List organisations |

> The endpoints above are suggestions. Document any changes you make in the final README.

---

## 7. HTTP Status Codes

| Situation | Status |
|---|---|
| Resource created | 201 Created |
| Successful read / update | 200 OK |
| Validation failure, bad parameters | 400 Bad Request |
| Missing or invalid identity | 401 Unauthorized |
| Not allowed (not owner / not admin) | 403 Forbidden |
| Resource not found | 404 Not Found |
| Duplicate (e.g., email exists) or invalid state change (closing a closed job) | 409 Conflict |
| Unexpected server error | 500 Internal Server Error |

### Standard Error Response Fields
`timestamp`, `status`, `error`, `message`, `path`, and an optional list of `fieldErrors` (field name + message).

---

## 8. Architecture

### 8.1 Layers

| Layer | Responsibility |
|---|---|
| **Controller** | Receives HTTP requests, validates input, returns responses with correct status codes |
| **Service** | Business rules, ownership and role checks, moderation logic |
| **Repository** | Database access via Spring Data JPA |
| **Entity** | JPA-mapped database tables |
| **DTO** | Request and response objects, so entities and private fields are never exposed directly |
| **Exception** | Custom exceptions and the global exception handler |

### 8.2 Suggested Package Structure

```
com.institute.alumni
 ├── controller
 ├── service
 ├── repository
 ├── entity
 ├── dto
 ├── exception
 ├── config
 └── util
```

### 8.3 Technologies

- Java 17 (or the version your course uses)
- Spring Boot, Spring Web, Spring Data JPA, Bean Validation
- MySQL 8
- Maven or Gradle
- Postman for API testing
- Git and GitHub for version control

---

## 9. Testing Plan (Postman)

Create a Postman collection with folders for Alumni, Jobs, Admin, and Errors. Include both successful and unsuccessful scenarios.

### 9.1 Positive Test Cases
- Register a valid alumni profile.
- Fetch a profile by ID (public view hides email and phone).
- Update own profile.
- Search alumni by graduation year, by skill, by organisation, by role, and by a combination.
- Paginated and sorted search results.
- Post a job, list jobs, fetch a job, update own job, close own job.
- Admin approves a profile and a job.

### 9.2 Negative Test Cases
- Register with a missing required field, invalid email, or duplicate email.
- Graduation year out of range.
- Update another alumnus's profile (expect 403).
- Fetch a profile or job that does not exist (expect 404).
- Post a job with a past deadline or an invalid organisation.
- Close an already closed job (expect 409).
- Non-admin attempts moderation (expect 403).
- Invalid pagination values (negative page, size too large).
- Search by a skill that does not exist (empty result, not an error).

---

## 10. Setup Instructions

### 10.1 Prerequisites
- JDK 17 or compatible
- Maven (or Gradle)
- MySQL Server 8 and a client (MySQL Workbench or CLI)
- Postman
- An IDE (IntelliJ IDEA / Eclipse / VS Code)

### 10.2 Steps
1. Clone the repository from GitHub.
2. Create an empty MySQL database named `alumni_db`.
3. Open the application configuration file and set your database URL, username, and password. Set Hibernate to create/update tables automatically for development.
4. Build the project using Maven.
5. Run the main Spring Boot application class.
6. Confirm the application is running on port 8080 (or your configured port).
7. Import the Postman collection from the `docs/` folder and run the requests.
8. (Optional) Load sample data using a seed script or data-loading class so that search can be demonstrated.

### 10.3 Sample Data Suggestions
Prepare roughly 10–15 alumni across different graduation years and departments, 5–8 organisations, 15–20 skills, and 8–10 jobs in mixed statuses so filters and moderation can be demonstrated clearly.

---

## 11. Assumptions (Edit to Match Your Implementation)

1. Authentication is simplified (identity passed via request headers) unless JWT is implemented.
2. Only graduates of the institute can register; no external verification is performed.
3. New profiles start as **Pending** and become visible only after admin approval (or are auto-approved if you choose to simplify — document the choice).
4. Email and phone are private by default.
5. Jobs and profiles are never hard-deleted; status changes are used instead.
6. An alumnus has one current organisation at a time.
7. Skills are case-insensitive and stored once in a master table.
8. All data in the system is sample data.

---

## 12. Optional Resume-Enhancing Extensions

- **JWT authentication** with role-based access (ALUMNI, ADMIN).
- **Mentorship requests** between alumni.
- **Event listings** (reunions, webinars).
- **Profile visibility settings** (alumnus chooses which fields are public).
- **Email notification simulation** when a job is approved or a profile is moderated.
- **Unit and integration tests** (JUnit, Mockito, MockMvc).
- **Swagger / OpenAPI** documentation.
- **Docker** containerisation of the app and MySQL.
- **Audit history** of moderation actions.

---

## 13. Deliverables Checklist

- [ ] Working Spring Boot application
- [ ] Source code pushed to GitHub with meaningful commits
- [ ] This README (updated with your final decisions)
- [ ] ER diagram / database schema (`docs/er-diagram.png`, optional `schema.sql`)
- [ ] Postman collection with positive and negative test cases
- [ ] Endpoint documentation (this README or Swagger)
- [ ] Setup instructions verified on a clean machine
- [ ] Project demonstration / viva preparation

---

## 14. Suggested Development Roadmap

| Phase | Tasks |
|---|---|
| **1. Setup** | Create project, connect MySQL, set up package structure, add global exception handler |
| **2. Core entities** | Organisation, Skill, AlumniProfile with relationships |
| **3. Alumni APIs** | Register, view, update, ownership checks, public vs private DTOs |
| **4. Search** | Filters, pagination, sorting |
| **5. Jobs** | Publish, view, list with filters, update, close |
| **6. Moderation** | Admin endpoints for profiles and jobs |
| **7. Validation and errors** | Complete field rules, consistent error responses |
| **8. Testing** | Postman collection, sample data, edge cases |
| **9. Documentation** | ER diagram, finalise README, record demo |
| **10. Extensions** | JWT, Swagger, Docker, automated tests (as time allows) |

---

## 15. Viva Preparation Points

Be ready to explain:
- Why the layered architecture was used and what each layer does.
- Why DTOs are used instead of exposing entities.
- How private fields are protected.
- How ownership and admin checks are enforced.
- The many-to-many relationships and how the join tables work.
- How pagination and filtering are implemented.
- How the global exception handler works and which status codes you return.
- What you would add next (JWT, tests, Docker).

---

*Note: This is an academic project using sample data. No real personal data should be stored.*