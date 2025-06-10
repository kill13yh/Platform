# AI & Crypto Platform


This is the starter template for the Next.js App Router Course. It contains the starting code for the dashboard application.

For more information, see the [course curriculum](https://nextjs.org/learn) on the Next.js Website.

A reference Next.js 15 project showcasing simple text analysis, IP and virus checks, and basic authentication. It is built for educational purposes and demonstrates using PostgreSQL with the App Router.

## Installation

1. Install **Node.js 18+** and the [pnpm](https://pnpm.io/) package manager.
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Create a `.env` file in the project root and provide the following variables:
   ```ini
   # Database connection
   POSTGRES_URL=postgresql://USER:PASSWORD@HOST:5432/DB?sslmode=require
   POSTGRES_HOST=HOST
   POSTGRES_PORT=5432
   POSTGRES_USER=USER
   POSTGRES_PASSWORD=PASSWORD
   POSTGRES_DATABASE=DB

   # External services
   OPENAI_API_KEY=your-openai-key
   VIRUSTOTAL_API_KEY=your-virustotal-key
   ABUSEIPDB_API_KEY=your-abuseipdb-key

   # NextAuth configuration
   AUTH_SECRET=generated-secret
   AUTH_URL=http://localhost:3000/api/auth
   ```
4. Ensure PostgreSQL is running and, if desired, seed the database by starting the dev server and visiting `/seed`.

## Development

- `pnpm dev` – start the Next.js development server.
- `pnpm lint` – run ESLint.
- `pnpm build` – create a production build.
- `pnpm start` – run the production build locally.

## Deployment

Run `pnpm build` and then `pnpm start` to serve the compiled app. Set all environment variables on the target platform (e.g., Vercel or another hosting provider) to match your `.env` values.