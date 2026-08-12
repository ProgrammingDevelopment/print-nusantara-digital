# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/722ff7c4-8d63-43fa-a1c8-0142728f4af5

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/722ff7c4-8d63-43fa-a1c8-0142728f4af5) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Vercel API, Webhooks, and SSE

This repo now includes Vercel serverless endpoints under `api/`:

- `GET /api/products` lists products with `category`, `search`, `limit`, and `offset` query params.
- `POST|PUT|PATCH|DELETE /api/products` performs admin CRUD with `X-Admin-Token` or `Authorization: Bearer <ADMIN_API_TOKEN>`.
- `GET|POST|PUT|PATCH|DELETE /api/orders` performs admin order CRUD and uses nested Supabase selects to avoid N+1 queries.
- `POST /api/webhooks/supabase` accepts Supabase/webhook payloads with `X-Webhook-Token` or bearer auth, then publishes an SSE event.
- `GET /api/events` opens a Server-Sent Events stream with heartbeat support.

Set these environment variables in Vercel:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_API_TOKEN`
- `WEBHOOK_SECRET`
- Optional: `EVENTS_CLIENT_TOKEN` and matching `VITE_EVENTS_CLIENT_TOKEN`

Complexity notes:

- Product list reads are `O(pageSize)` because filtering and pagination happen at the endpoint.
- Order reads are `O(orders + orderItems)` in a single nested Supabase query, avoiding N+1 loops.
- Order item creation is batched in one insert, so checkout does not insert items one request at a time.

The SSE bus is dependency-free and suitable for simple Vercel deployments. For multi-region or high-volume production fanout, replace the in-memory bus in `api/_lib/event-bus.ts` with a durable pub/sub service such as Upstash Redis while keeping the same `/api/events` contract.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/722ff7c4-8d63-43fa-a1c8-0142728f4af5) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
