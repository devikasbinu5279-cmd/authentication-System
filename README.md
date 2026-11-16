# Project 1 — Login and Registration System

A React frontend and Express API backed by MongoDB. New users can register, passwords are hashed with bcrypt, and valid users receive a JWT when logging in.

## Setup
1. Install and start MongoDB.
2. In `backend`, copy `.env.example` to `.env`, set `MONGODB_URI` and a long random `JWT_SECRET`.
3. Run `npm install && npm run dev`.
4. In `frontend`, run `npm install && npm run dev`.
5. Open the Vite URL, normally http://localhost:5173.

API routes: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`.
