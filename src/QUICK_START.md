# 🚀 Quick Start - Local Development

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://ljljxfgvjhrcocjruzgh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqbGp4Zmd2amhyY29janJ1emdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2OTU2MTIsImV4cCI6MjA4MzI3MTYxMn0.8gzVTy6V89vB8SpK0y9L5Dg9M24phvipHWjfRU69jjo
```

## 3. Run Development Server

```bash
npm run dev
```

Your app will be available at `http://localhost:5173`

## 4. Build for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

## 5. Preview Production Build

```bash
npm run preview
```

---

## 📦 Deploy to Vercel

See [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

**Quick deploy:**
```bash
npm install -g vercel
vercel
```

---

## 🔧 Troubleshooting

### Port already in use
If port 5173 is already in use, Vite will automatically try the next available port.

### Module not found errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build errors
Make sure you're using Node.js version 18 or higher:
```bash
node --version
```
