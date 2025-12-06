# linusbiermann.com - Christmas Gift Website

A beautiful, simple Christmas gift website for Linus Biermann featuring the domain gift announcement.

## Features

- 🎄 Beautiful Christmas-themed design
- ❄️ Animated snowflakes and stars
- 🎁 No-scroll, centered layout
- ✨ Modern, responsive design
- 🚀 Optimized for Vercel deployment

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd helloworld
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will automatically detect Next.js and configure the project
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to link your project

### Connecting Your Domain

1. In your Vercel project dashboard, go to Settings → Domains
2. Add `linusbiermann.com` and `www.linusbiermann.com`
3. Update your domain's DNS records as instructed by Vercel:
   - Add an A record pointing to Vercel's IP (shown in dashboard)
   - Or add a CNAME record pointing to your Vercel deployment URL

## Project Structure

```
.
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Main page component
│   ├── page.module.css # Page styles
│   └── globals.css     # Global styles
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## Technologies Used

- Next.js 14
- React 18
- TypeScript
- CSS Modules

## License

Private project - Christmas gift for Linus Biermann

