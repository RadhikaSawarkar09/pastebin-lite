# Pastebin Lite

A simple pastebin application where users can create and share temporary text snippets.

## Deployed URL
https://your-app.vercel.app *(Update with your actual Vercel deployment URL)*

## GitHub Repository
https://github.com/yourusername/pastebin-lite *(Update with your actual GitHub URL)*

---

## How to Run Locally

### Prerequisites
- Node.js 18+
- npm

### Installation & Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pastebin-lite.git
cd pastebin-lite
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

---

## Persistence Layer

### Local Development
- **Storage**: File-based (`.pastebin-data/` directory)
- **Format**: JSON files
- **How it works**: 
  - Each paste is stored as a separate JSON file
  - Keys are hex-encoded to work on Windows (filesystem-compatible)
  - Data persists across server reloads

### Production (Vercel)
- **Storage**: Vercel KV (serverless Redis)
- **Setup**: Add environment variables:
  ```
  KV_REST_API_URL=your_kv_url
  KV_REST_API_TOKEN=your_kv_token
  ```

---

## Important Design Decisions

1. **File-Based Storage for Development**
   - No external database/service required for local testing
   - Simple debugging - data visible in `.pastebin-data/` folder
   - Keys encoded in hex to avoid Windows filename issues

2. **nanoid for Paste IDs**
   - Short unique IDs (8 characters)
   - Example: `Au-e0r44`

3. **Next.js App Router**
   - API routes: `/api/pastes` (POST to create)
   - API routes: `/api/pastes/[id]` (GET to fetch)
   - Pages: `/p/[id]` (view paste)

4. **Client-Side Components**
   - Paste creation form on home page
   - Paste viewing on dedicated page
   - Minimal UI with inline styling

---

## API Usage

### Create a Paste
```bash
POST /api/pastes
Content-Type: application/json

{"content": "Your text here"}
```

Response:
```json
{
  "id": "Au-e0r44",
  "url": "http://localhost:3000/p/Au-e0r44"
}
```

### Fetch a Paste
```bash
GET /api/pastes/Au-e0r44
```

Response:
```json
{
  "content": "Your text here"
}
```

---

## Tech Stack

- **Framework**: Next.js
- **Runtime**: Node.js
- **Storage**: File-based (dev) / Vercel KV (prod)
- **Styling**: Tailwind CSS

---

## Deployment to Vercel

1. Push code to GitHub
2. Go to vercel.com → New Project
3. Import your GitHub repository
4. Add environment variables (KV_REST_API_URL, KV_REST_API_TOKEN)
5. Deploy

---

## File Structure

```
pastebin-lite/
├── app/
│   ├── page.js              # Home page (create paste)
│   ├── layout.tsx           # Root layout
│   ├── api/
│   │   └── pastes/
│   │       ├── route.js     # POST: create paste
│   │       └── [id]/
│   │           └── route.js # GET: fetch paste
│   └── p/[id]/
│       └── page.js          # View paste
├── lib/
│   └── redis.js             # Storage abstraction
└── package.json
```

---

## Status

✅ Complete and working locally  
⏳ Ready for deployment to Vercel
