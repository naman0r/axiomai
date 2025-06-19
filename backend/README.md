## Development notes on the backend server:

## list of endpoints:

- [ ] GET /api/health -> simple test endpoint to see if the API is up and running.
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]

## Running:

```bash
cd backend
npm install
npm run dev
```

-- IF DB MIGRATIONS NEEDED:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

## todo for backend:

- add testing capabilities (jest? how do you unit test an api? )
- figure out ORM with prisma or drizzle
- make a Supabase project

##

- running `npx prisma init` made the prisma folder in the backend.
- `npx prisma migrate dev --name init`:

  - creates database tables based on our schema
  - creates SQL migration files in prisma/migrations/
  - applies those changes to the database (supabase)
  - only need to run this when we change our schema (access problems to the supabase project solved)
  - this is really cool

- running `npx prisma generate`

  - purpose: generates the typescript client code
  - creates typescript types based on our schema
  - generates prisma client code that we import
  - **run this after schema changes or first setup**

- Connection string?????

postgresql://postgres:YOUR_PASSWORD@d-/postgres

```
postgresql:// - Protocol
postgres - Username
YOUR_PASSWORD - Your database password
db.zzczqcseofmpkijszepu.supabase.co - Database host
5432 - Port
postgres - Database name
```
