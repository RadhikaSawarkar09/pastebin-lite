# 📋 Pastebin Lite

A simple, fast pastebin application built with Next.js. Create and share temporary text snippets with unique URLs.

## Features

- ✨ Create pastes with a simple interface
- 🔗 Share pastes via unique URLs
- 💾 Persistent storage (file-based for local development, Vercel KV for production)
- 🎨 Clean, minimal UI
- ⚡ Fast and responsive

## Live Demo

**Deployed URL**: https://your-app.vercel.app *(Replace with your deployed URL)*

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

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

## How to Use

1. Go to the home page
2. Type or paste your text in the textarea
3. Click the "Create Paste" button
4. Share the generated link with others

## Architecture & Design Decisions

### Persistence Layer

**Local Development**: File-based storage (`.pastebin-data/` directory)
- Data is stored as JSON files on the filesystem
- Keys are encoded in hexadecimal to avoid filesystem issues (Windows doesn't allow colons in filenames)
- Simple, no external dependencies needed for development
- Data persists across server reloads

**Production (Vercel)**: Vercel KV (Redis-compatible serverless database)
- Scalable and reliable
- Set environment variables: `KV_REST_API_URL` and `KV_REST_API_TOKEN`

### Key Design Decisions

1. **File-based Storage for Development**
   - Avoids the need for external services during local development
   - Files are encoded with hex keys to work cross-platform
   - Simple debugging - data is visible in `.pastebin-data/` folder

2. **Next.js App Router**
   - Used for both frontend pages and API routes
   - Dynamic routes: `/p/[id]` for viewing pastes
   - Server-side params handling with async/await

3. **Client-side Components**
   - Home page: Create pastes with real-time feedback
   - Paste page: Display paste content with back button
   - URL-based ID extraction to handle hydration issues

4. **Minimal UI**
   - No external CSS framework (except Tailwind imports)
   - Inline styles for quick styling
   - Responsive textarea and button with hover effects

5. **ID Generation**
   - Using `nanoid(8)` for short, unique paste IDs
   - Example: `Au-e0r44`

## Project Structure

```
pastebin-lite/
├── app/
│   ├── page.js                 # Home page (create paste)
│   ├── layout.tsx              # Root layout
│   ├── globals.css             # Global styles
│   ├── api/
│   │   ├── healthz/
│   │   │   └── route.js        # Health check endpoint
│   │   └── pastes/
│   │       ├── route.js        # POST: Create paste
│   │       └── [id]/
│   │           └── route.js    # GET: Fetch paste
│   └── p/
│       └── [id]/
│           └── page.js         # View paste page
├── lib/
│   └── redis.js                # KV storage abstraction layer
├── package.json
└── README.md
```

## API Endpoints

### POST `/api/pastes`
Create a new paste
```bash
curl -X POST http://localhost:3000/api/pastes \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello World"}'
```
Response:
```json
{
  "id": "Au-e0r44",
  "url": "http://localhost:3000/p/Au-e0r44"
}
```

### GET `/api/pastes/[id]`
Fetch a paste by ID
```bash
curl http://localhost:3000/api/pastes/Au-e0r44
```
Response:
```json
{
  "content": "Hello World"
}
```

### GET `/api/healthz`
Health check
```bash
curl http://localhost:3000/api/healthz
```
Response:
```json
{ "ok": true }
```

## Deployment to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" and import your repository
4. Vercel will auto-detect Next.js
5. Set environment variables in Settings → Environment Variables:
   - `KV_REST_API_URL`: Your Vercel KV endpoint
   - `KV_REST_API_TOKEN`: Your Vercel KV token
   - `NEXT_PUBLIC_BASE_URL`: Your production URL
6. Click Deploy

### Getting Vercel KV Credentials
1. In Vercel dashboard, go to Storage
2. Create or select your KV database
3. Click on the database to view credentials
4. Copy the `.env.local` section values
5. Add them to your Vercel project settings

## Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Environment Variables

Create a `.env.local` file for local development:
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

For production (Vercel):
```env
KV_REST_API_URL=https://[your-kv-url].kv.vercel.sh
KV_REST_API_TOKEN=your_actual_token_here
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
```

## Technologies Used

- **Framework**: Next.js 16.1
- **Language**: JavaScript/React
- **Styling**: Tailwind CSS
- **Storage**: File-based (development) / Vercel KV (production)
- **ID Generation**: nanoid
- **Runtime**: Node.js

## Troubleshooting

### "Paste not found" error
- Make sure the server is running (`npm run dev`)
- Check that the paste ID is correct in the URL
- For file-based storage, verify `.pastebin-data/` folder exists

### "Invalid JSON body" error
- Ensure you're sending valid JSON in the POST request
- Check that the `Content-Type` header is `application/json`

## Future Enhancements

- [ ] TTL (Time-To-Live) for auto-deleting pastes
- [ ] View count tracking
- [ ] Max views limit
- [ ] Copy to clipboard button
- [ ] Syntax highlighting for code
- [ ] Dark mode toggle
- [ ] Delete paste functionality
- [ ] User authentication
- [ ] Paste expiration management

## License

MIT

## Support

For issues and questions, open a GitHub issue in the repository.
