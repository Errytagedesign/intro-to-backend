# Blog API

A learning project for backend development with **Express 5**, **MongoDB**, and **Mongoose**.

The goal is to build a working blog API from scratch — posts, users, authentication, and the
supporting pieces (validation, error handling, pagination) that turn a tutorial project into
something you could actually deploy.

## Stack

| Piece     | Choice             |
| --------- | ------------------ |
| Runtime   | Node.js (ESM)      |
| Framework | Express 5          |
| Database  | MongoDB + Mongoose |
| Config    | dotenv             |
| Dev       | nodemon            |

## Getting started

```bash
npm install
npm run dev
```

Create a `.env.local` in the project root:

```
PORT=8000
MONGODB_URI=<your connection string>
```

---

## Milestone 1 — CRUD on a single resource

Get `Post` working end to end. This is where the request lifecycle clicks: how a URL becomes a
route, how a route reaches a controller, and how a controller talks to the database.

- [x] Finish the `Post` schema (title, content, timestamps)
- [x] Create `src/routes/post.routes.js` and mount it in `app.js` under `/api/posts`
- [ x] Create `src/controllers/post.controller.js`
- [ x] `POST /api/posts` — create a post (reading `req.body`)
- [ x] `GET /api/posts` — list all posts
- [ x] `GET /api/posts/:id` — get one post (reading `req.params`)
- [x ] `PATCH /api/posts/:id` — update a post
- [x ] `DELETE /api/posts/:id` — delete a post
- [ x] Return correct status codes: `201` created, `200` ok, `404` not found, `400` bad request
- [ x] Test every route in Postman / Thunder Client / `curl`

**You'll learn:** routing, `req.body` / `req.params`, `express.json()`, Mongoose's
`create`, `find`, `findById`, `findByIdAndUpdate`, `findByIdAndDelete`, HTTP status codes.

---

## Milestone 2 — A second resource and relationships

Add users, then connect posts to them. Documents stop being isolated and start referencing
each other.

- [ ] Finish the `User` schema (name, email unique, password)
- [ ] `POST /api/users` — create a user
- [ ] `GET /api/users/:id` — get a user
- [ ] Add an `author` field to `Post`: `{ type: Schema.Types.ObjectId, ref: 'User' }`
- [ ] Use `.populate('author')` so post responses include author details
- [ ] `GET /api/users/:id/posts` — all posts by one user
- [ ] Exclude the password from every user response

**You'll learn:** `ObjectId` references, `.populate()`, schema `unique` constraints,
shaping responses so you never leak sensitive fields.

---

## Milestone 3 — Authentication and authorization

The milestone that teaches middleware. Users log in, get a token, and can only modify their
own content.

- [ ] Hash passwords with `bcrypt` in a Mongoose `pre('save')` hook
- [ ] `POST /api/auth/register` — register and hash the password
- [ ] `POST /api/auth/login` — verify password, sign a JWT with `jsonwebtoken`
- [ ] Write `src/middlewares/auth.middleware.js` — read the `Authorization: Bearer <token>`
      header, verify it, attach `req.user`
- [ ] Protect create / update / delete post routes with that middleware
- [ ] Set `author` from `req.user` instead of trusting the request body
- [ ] Authorization check: only a post's author may update or delete it (`403` otherwise)
- [ ] `GET /api/auth/me` — return the currently logged-in user

**You'll learn:** password hashing, JWTs, custom middleware, the difference between
_authentication_ (who are you) and _authorization_ (what may you do), `401` vs `403`.

---

## Milestone 4 — Production polish

Three things that separate a tutorial API from a real one.

- [ ] Pagination on `GET /api/posts` via `?page=1&limit=10` using `.skip()` and `.limit()`
- [ ] Return pagination metadata: `total`, `page`, `totalPages`
- [ ] Centralized error handler — an Express error middleware, so controllers stop repeating
      try/catch blocks
- [ ] An `ApiError` class and an `asyncHandler` wrapper
- [ ] Input validation with `zod` as route middleware
- [ ] Consistent response shape across every endpoint
- [ ] Handle invalid `ObjectId`s gracefully instead of throwing a `CastError`
- [ ] Add CORS with the `cors` package

**You'll learn:** Express error middleware (the 4-argument signature), schema validation at
the edge, why a consistent response envelope matters to API consumers.

---

## Stretch goals

Pick these up once the four milestones are done.

- [ ] **Comments** — a third model, referencing both `Post` and `User`
- [ ] **Search** — `?search=` over post titles and content using a MongoDB text index
- [ ] **Filtering and sorting** — `?tag=express&sort=-createdAt`
- [ ] **Image uploads** — `multer` for handling files, Cloudinary for storage
- [ ] **Likes** — an array of user references on `Post`, with a toggle endpoint
- [ ] **Rate limiting** — `express-rate-limit` on the auth routes
- [ ] **Refresh tokens** — short-lived access token, long-lived refresh token in an httpOnly cookie
- [ ] **Tests** — Jest + Supertest against an in-memory MongoDB
- [ ] **API docs** — Swagger / OpenAPI
- [ ] **Deploy** — Render or Railway, with MongoDB Atlas

---

## Project structure

The layout to grow into as the milestones land:

```
src/
├── index.js              # entry point — env, DB connection, server start
├── app.js                # express app — middleware, route mounting
├── config/
│   ├── database.js
│   └── constant.js
├── models/
│   ├── user.model.js
│   └── post.model.js
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   └── post.routes.js
├── controllers/
│   ├── auth.controller.js
│   ├── user.controller.js
│   └── post.controller.js
├── middlewares/
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── validate.middleware.js
└── utils/
    ├── ApiError.js
    ├── ApiResponse.js
    └── asyncHandler.js
```

## API reference

Fill this in as you build each endpoint.

| Method | Endpoint               | Description       | Auth |
| ------ | ---------------------- | ----------------- | ---- |
| POST   | `/api/auth/register`   | Register a user   | No   |
| POST   | `/api/auth/login`      | Log in, get a JWT | No   |
| GET    | `/api/auth/me`         | Current user      | Yes  |
| GET    | `/api/posts`           | List posts        | No   |
| POST   | `/api/posts`           | Create a post     | Yes  |
| GET    | `/api/posts/:id`       | Get one post      | No   |
| PATCH  | `/api/posts/:id`       | Update own post   | Yes  |
| DELETE | `/api/posts/:id`       | Delete own post   | Yes  |
| GET    | `/api/users/:id`       | Get a user        | No   |
| GET    | `/api/users/:id/posts` | Posts by a user   | No   |
