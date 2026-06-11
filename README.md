# PulseHub Frontend

PulseHub frontend is a Next.js and TypeScript app that talks only to the backend BFF. It handles registration, login, logout, current-user lookup, and a simple chat flow for the `general` channel.

## Screenshot

![PulseHub Home](docs/screenshots/pulsehub-home.png)

## Install

```bash
npm install
```

## Environment

Create a local `.env.local` file in the project root.

Use this variable:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

`NEXT_PUBLIC_API_BASE_URL` tells the frontend where the BFF lives. If you do not set it, the app falls back to `http://localhost:8080`.

## Start Frontend

```bash
npm run dev
```

The app usually runs on `http://localhost:3000`. If that port is taken, Next.js may pick another port.

## Backend

The backend must be running separately. The frontend does not talk to `auth-service`, `user-service`, or `message-service` directly. It only talks to the BFF.

## Test Flow

1. Start the backend BFF on `http://localhost:8080`.
2. Start the frontend with `npm run dev`.
3. Register a user.
4. Log in.
5. Send a message in `general`.
6. Send `hej bot` and check that the bot reply appears after the backend has processed it.
