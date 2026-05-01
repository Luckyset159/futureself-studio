# FutureSelf Studio

A deployable luxury-styled Next.js web app for generating anime-realism inspirational portraits from an uploaded photo.

## What's included
- Premium branded UI
- Upload a person photo
- Pick a preset: Fitness, Style, Grooming, Founder / Leader, Spiritual, Editorial
- Fine-tune the result with toggles and sliders
- Generate the image through OpenAI
- Download the generated result
- Before / after comparison slider

## Tech stack
- Next.js 14
- TypeScript
- Plain CSS
- OpenAI Images Edit API
- Ready for Vercel deployment

---

## Run locally

### 1. Install dependencies
```bash
npm install
```

### 2. Create your env file
Copy `.env.example` into `.env.local`.

Mac / Linux:
```bash
cp .env.example .env.local
```

Then put your API key into `.env.local`:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Start the app
```bash
npm run dev
```

Open:
```text
http://localhost:3000
```

---

## Deploy on Vercel

### Option A — easiest method

#### Step 1: put the project on GitHub
```bash
git init
git add .
git commit -m "Initial FutureSelf Studio app"
```

Create a new repository on GitHub, then connect it:
```bash
git remote add origin YOUR_GITHUB_REPO_URL
git branch -M main
git push -u origin main
```

#### Step 2: import into Vercel
1. Go to https://vercel.com
2. Log in
3. Click **Add New Project**
4. Import your GitHub repository
5. Vercel will auto-detect **Next.js**
6. Add the environment variable:
   - `OPENAI_API_KEY` = your real API key
7. Click **Deploy**

#### Step 3: test the live app
- open your Vercel URL
- upload a test image
- choose a preset
- click **Generate Avatar**
- use the before / after slider

---

## Important files
- `app/page.tsx` → main luxury UI and compare slider
- `app/api/generate/route.ts` → backend image generation route
- `lib/prompt.ts` → transformation prompt builder
- `app/globals.css` → luxury styling
- `public/icon.svg` → app icon
