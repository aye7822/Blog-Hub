# BlogHub Deployment Guide

## 🚀 Vercel Deployment Setup

### 1. Environment Variables

Add these environment variables in your Vercel dashboard:

```bash
# Database
DATABASE_URL=postgresql://username:password@host:5432/bloghub

# Vercel Blob Storage (Required for image uploads)
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here
```

### 2. Getting Vercel Blob Token

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project
3. Go to **Settings** → **Environment Variables**
4. Add `BLOB_READ_WRITE_TOKEN`
5. Get the token from Vercel Blob dashboard

### 3. Database Setup

#### Option A: Vercel Postgres (Recommended)
1. In Vercel dashboard, go to **Storage** tab
2. Create a new **Postgres** database
3. Copy the connection string to `DATABASE_URL`

#### Option B: External Database
- Use any PostgreSQL provider (Supabase, Railway, Neon, etc.)
- Add the connection string to `DATABASE_URL`

### 4. Run Database Migrations

After deployment, run:
```bash
npm run db:migrate
npm run db:seed
```

### 5. Image Storage

✅ **Fixed**: Images now use Vercel Blob storage instead of local filesystem
- Images are stored in Vercel's CDN
- Automatic optimization and resizing
- Global CDN for fast loading

## 🔧 Local Development

For local development, you can still use local storage:

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your database URL

# Run migrations
npm run db:migrate
npm run db:seed

# Start development server
npm run dev
```

## 📝 Production Checklist

- [ ] Environment variables set in Vercel
- [ ] Database connected and migrated
- [ ] Vercel Blob token configured
- [ ] Test image uploads
- [ ] Test blog post creation
- [ ] Verify images display correctly

## 🐛 Troubleshooting

### Images Not Loading
- Check Vercel Blob token is set correctly
- Verify `BLOB_READ_WRITE_TOKEN` environment variable
- Check browser console for errors

### Database Issues
- Verify `DATABASE_URL` is correct
- Run migrations: `npm run db:migrate`
- Check database connection in Vercel logs

### Build Errors
- Check all environment variables are set
- Verify all dependencies are installed
- Check Vercel build logs for specific errors
