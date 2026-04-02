# QuoteVault Backend - TypeScript / Express / MongoDB

A fully typed REST API backend (ESM + TypeScript) that replicates the Supabase-powered QuoteVault functionality using Node.js, Express, and MongoDB.

## Schema Mapping (Supabase → MongoDB)

| Supabase Table     | MongoDB Model  | Notes                                    |
| ------------------ | -------------- | ---------------------------------------- |
| `auth.users`       | `User`         | JWT auth replaces Supabase Auth          |
| `quotes`           | `Quote`        | Same fields, `_id` replaces `id`         |
| `user_favorites`   | `Favorite`     | References User + Quote                  |
| `collections`      | `Collection`   | Quotes embedded as ObjectId array        |
| `collection_quotes`| _(embedded)_   | Stored inside Collection.quotes[]        |
| `profiles`         | `Profile`      | References User, settings as sub-document|

## Setup

### 1. Prerequisites
- **Node.js** >= 18
- **MongoDB** running locally or a MongoDB Atlas connection string

### 2. Install dependencies
```bash
cd backend
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
```
Edit `.env` with your values:
- `MONGO_URI` — your MongoDB connection string
- `JWT_SECRET` — a strong random secret for JWT signing

### 4. Seed the database
```bash
npm run seed
```

### 5. Start the server
```bash
# Development (auto-restart on changes via tsx)
npm run dev

# Production (build first, then run)
npm run build
npm start
```

Server runs on `http://localhost:5000` by default.

---

## API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint                    | Auth | Description                |
| ------ | --------------------------- | ---- | -------------------------- |
| POST   | `/api/auth/signup`          | No   | Create account             |
| POST   | `/api/auth/signin`          | No   | Sign in, get JWT token     |
| POST   | `/api/auth/reset-password`  | No   | Request password reset     |
| PUT    | `/api/auth/reset-password/:token` | No | Complete password reset |
| GET    | `/api/auth/me`              | Yes  | Get current user           |

### Quotes (`/api/quotes`) — Public
| Method | Endpoint                 | Auth | Description                     |
| ------ | ------------------------ | ---- | ------------------------------- |
| GET    | `/api/quotes`            | No   | List quotes (paginated)         |
| GET    | `/api/quotes/search`     | No   | Search by text/author           |
| GET    | `/api/quotes/today`      | No   | Get quote of the day            |
| GET    | `/api/quotes/categories` | No   | Get all categories              |
| GET    | `/api/quotes/:id`        | No   | Get single quote by ID          |

### Favorites (`/api/favorites`) — Auth Required
| Method | Endpoint                        | Description                     |
| ------ | ------------------------------- | ------------------------------- |
| POST   | `/api/favorites/toggle`         | Toggle favorite on/off          |
| GET    | `/api/favorites`                | Get user's favorite quotes      |
| GET    | `/api/favorites/check/:quoteId` | Check if quote is favorited     |
| GET    | `/api/favorites/ids`            | Get all favorited quote IDs     |
| GET    | `/api/favorites/count`          | Get favorites count             |

### Collections (`/api/collections`) — Auth Required
| Method | Endpoint                                  | Description                     |
| ------ | ----------------------------------------- | ------------------------------- |
| POST   | `/api/collections`                        | Create collection               |
| GET    | `/api/collections`                        | List user's collections         |
| GET    | `/api/collections/:id`                    | Get collection with quotes      |
| PUT    | `/api/collections/:id`                    | Update collection title         |
| DELETE | `/api/collections/:id`                    | Delete collection               |
| POST   | `/api/collections/:id/quotes`             | Add quote to collection         |
| DELETE | `/api/collections/:id/quotes/:quoteId`    | Remove quote from collection    |
| GET    | `/api/collections/:id/check/:quoteId`     | Check if quote is in collection |

### Profile (`/api/profile`) — Auth Required
| Method | Endpoint                   | Description                     |
| ------ | -------------------------- | ------------------------------- |
| GET    | `/api/profile`             | Get user profile & settings     |
| PUT    | `/api/profile/settings`    | Update settings                 |
| PUT    | `/api/profile/display-name`| Update display name             |
| PUT    | `/api/profile/avatar`      | Update avatar URL               |
| POST   | `/api/profile/sync`        | Sync local settings with server |

---

## Authentication

All protected routes require a Bearer token in the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

## Example Requests

### Sign Up
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "mypassword", "name": "John"}'
```

### Get Quotes (paginated)
```bash
curl http://localhost:5000/api/quotes?page=1&limit=20&category=Motivation
```

### Toggle Favorite
```bash
curl -X POST http://localhost:5000/api/favorites/toggle \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"quoteId": "60f7b2c5e1234567890abcdef"}'
```

---

## Project Structure
```
backend/
├── src/
│   ├── config/
│   │   └── db.ts              # MongoDB connection
│   ├── middleware/
│   │   └── auth.ts            # JWT auth middleware
│   ├── models/
│   │   ├── User.ts            # User model (replaces auth.users)
│   │   ├── Quote.ts           # Quote model
│   │   ├── Favorite.ts        # Favorites model (user_favorites)
│   │   ├── Collection.ts      # Collection model (collections + collection_quotes)
│   │   └── Profile.ts         # Profile model (profiles)
│   ├── routes/
│   │   ├── auth.ts            # Auth endpoints
│   │   ├── quotes.ts          # Quote endpoints
│   │   ├── favorites.ts       # Favorites endpoints
│   │   ├── collections.ts     # Collection endpoints
│   │   └── profile.ts         # Profile endpoints
│   ├── seed/
│   │   └── seed.ts            # Database seeder (105 quotes)
│   ├── types/
│   │   └── index.ts           # Shared TypeScript interfaces
│   └── server.ts              # App entry point
├── .env.example               # Environment template
├── package.json               # "type": "module" + TS deps
├── tsconfig.json              # TypeScript config (NodeNext)
└── README.md
```
