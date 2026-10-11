# 🛒 বাজার দর (BazarDor)

BazarDor is a Bangla market-price tracker. It shows today's prices for rice, lentils, oil, vegetables, fish, meat, eggs and spices, along with daily price changes, so you can see at a glance what is getting cheaper or more expensive.

**Live site:** _add your Vercel link here_
**Repository:** _add your GitHub link here_

## Technologies Used

- Next.js (App Router) and React, written in JSX
- Tailwind CSS
- Better Auth (email/password, Google and GitHub login)
- MongoDB
- react-hot-toast
- Deployed on Vercel

## Features

1. **Live price ticker:** an infinite marquee under the navbar with price and ▲/▼ change for every product.
2. **Today's movers:** the top 6 price risers and top 6 fallers on the home page.
3. **Category pages:** browse every category, with a sort control (default, low to high, high to low) that sorts by numeric value.
4. **Product details:** a login-protected page with minimum, maximum and average price plus market-wise prices.
5. **Authentication:** email/password and Google/GitHub sign-in with toast notifications and protected routes.
6. **Profile management:** view your profile and update your name.
7. **Fully responsive:** works on mobile, tablet and desktop, with skeleton loaders and a friendly 404 page.

## Project Structure

```
app/
  api/auth/[...all]/route.js   Better Auth handler
  category/[slug]/             category page + skeleton
  product/[slug]/              product details (protected)
  profile/                     profile + update name
  signin/  signup/             auth pages
  components/                  Navbar, AuthMenu, ProductCard, ...
  layout.jsx  page.jsx         root layout and home page
lib/
  auth.js  auth-client.js      Better Auth server and client
  product.js  categories.js    API helpers
  bn.js                        Bengali digits, price and unit helpers
proxy.js                       protects /product and /profile
```

## Getting Started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Open http://localhost:3000.

### Social login setup

**GitHub:** GitHub -> Settings -> Developer settings -> OAuth Apps -> New OAuth App.
Homepage URL `http://localhost:3000`, callback URL `http://localhost:3000/api/auth/callback/github`.
Copy the Client ID and a generated Client secret into `.env.local`.

**Google:** Google Cloud Console -> APIs & Services -> Credentials -> OAuth client ID (Web application).
Authorized origin `http://localhost:3000`, redirect URI `http://localhost:3000/api/auth/callback/google`.
Add your Gmail as a test user while the consent screen is in Testing mode.

A provider is enabled only when both its ID and secret are set in `.env.local`. Restart `npm run dev` after editing the file.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string (include a database name) |
| `BETTER_AUTH_SECRET` | Random secret, e.g. `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | Your site URL (`http://localhost:3000` locally) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth client |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth app |

OAuth callback URLs:

- `http://localhost:3000/api/auth/callback/google`
- `http://localhost:3000/api/auth/callback/github`

For production, add the same paths on your Vercel domain.

## Notes

- Prices come from the BazarDor API (`/products`, `/categories`), with an automatic fallback to the alternative base URL.
- On Next.js 15 or older, rename `proxy.js` to `middleware.js` and the function `proxy` to `middleware`.
- Replace `public/bazar-hero.png` with your own hero image.
