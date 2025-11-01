# Batanani.io Documentation

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Routes](#api-routes)
- [AI Integration](#ai-integration)
- [Authentication & Authorization](#authentication--authorization)
- [Components](#components)
- [Deployment](#deployment)
- [Development Guide](#development-guide)

---

## Overview

**Batanani.io** is an AI-powered hairstyling and braiding assistance platform that provides 24/7 support through voice and text interactions. The application helps users get instant hairstyling advice, book appointments with hairdressers, and manage their hair care journey.

### Key Features
- 🎤 **Voice AI Assistant**: Real-time voice interaction with AI (speech-to-text)
- 💬 **Text Chat Interface**: Type-based conversations with AI assistant
- 🌍 **Multilingual Support**: English, Ndebele (nr), and Setswana (tn)
- 🤖 **Hybrid AI System**: Chrome built-in AI with Gemini API fallback
- 📅 **Appointment Booking**: Schedule sessions with professional hairdressers
- 👨‍💼 **Admin Dashboard**: Manage hairdressers, appointments, and users
- 🔐 **Secure Authentication**: Clerk-based user management
- 📊 **Analytics & Insights**: Track user interactions and appointments

---

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Landing    │  │  Dashboard   │  │    Admin     │     │
│  │     Page     │  │     Page     │  │    Panel     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           Voice Widget (AI Interaction)             │   │
│  │  • Speech Recognition (STT)                         │   │
│  │  • Chrome Built-in AI / Gemini Fallback            │   │
│  │  • Real-time Chat Interface                         │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      API Layer (Next.js)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   /api/      │  │   /api/      │  │   /api/      │     │
│  │  prompt      │  │  translate   │  │ summarize    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐                                           │
│  │   /api/      │  Server Actions (Prisma CRUD)            │
│  │ conversation │                                           │
│  └──────────────┘                                           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     Service Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Hybrid AI   │  │  Chrome AI   │  │  Gemini API  │     │
│  │ Orchestrator │  │   (Client)   │  │   (Server)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Firebase    │  │   Prisma     │  │    Clerk     │     │
│  │  (Firestore) │  │  (Postgres)  │  │    Auth      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Interaction** → Voice/Text Input
2. **Client Processing** → Try Chrome Built-in AI first
3. **Fallback** → If Chrome AI unavailable, call server API
4. **Server Processing** → Hybrid AI Flow (Gemini + Translation + Summarization)
5. **Data Persistence** → Save to Firebase Firestore & PostgreSQL (via Prisma)
6. **Response** → Display AI response to user

---

## Tech Stack

### Frontend
- **Framework**: Next.js 15.5.0 (App Router)
- **UI Framework**: React 19.1.0
- **Styling**: Tailwind CSS 4.0
- **Component Library**: Radix UI (shadcn/ui)
- **State Management**: React Query (TanStack Query)
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **Animations**: tw-animate-css

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes (App Router)
- **Database ORM**: Prisma 6.16.2
- **Database**: PostgreSQL
- **Authentication**: Clerk 6.33.2
- **File Storage**: Firebase Storage
- **NoSQL Store**: Firebase Firestore

### AI & ML
- **Primary AI**: Google Gemini API (@google/genai)
- **Client AI**: Chrome Built-in AI (Prompt API - Experimental)
- **Speech Recognition**: Web Speech API (SpeechRecognition)
- **Languages**: English (en), Ndebele (nr), Setswana (tn)

### DevOps
- **Build Tool**: Turbopack (Next.js)
- **Package Manager**: npm
- **TypeScript**: 5.x
- **Linting**: ESLint 9
- **Version Control**: Git

---

## Project Structure

```
batanani/
├── prisma/
│   └── schema.prisma              # Database schema (PostgreSQL)
├── public/                        # Static assets
│   ├── file.svg
│   ├── globe.svg
│   └── ...
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── layout.tsx             # Root layout (Clerk + Providers)
│   │   ├── page.tsx               # Landing page
│   │   ├── dashboard/
│   │   │   └── page.tsx           # User dashboard
│   │   ├── admin/
│   │   │   ├── page.tsx           # Admin page (protected)
│   │   │   └── AdminDashboardClient.tsx
│   │   ├── voice/
│   │   │   └── page.tsx           # Voice AI page
│   │   ├── pro/
│   │   │   └── page.tsx           # Premium features
│   │   └── api/                   # API routes
│   │       ├── prompt/route.ts
│   │       ├── translate/route.ts
│   │       ├── summarize/route.ts
│   │       └── conversation/route.ts
│   ├── components/
│   │   ├── landing/               # Landing page components
│   │   │   ├── Hero.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── WhatToAsk.tsx
│   │   │   ├── PricingSection.tsx
│   │   │   ├── CTA.tsx
│   │   │   └── Footer.tsx
│   │   ├── voice/                 # Voice AI widget
│   │   │   ├── Widget.tsx         # Main voice/chat interface
│   │   │   ├── WelcomeSection.tsx
│   │   │   └── FeatureCards.tsx
│   │   ├── admin/                 # Admin components
│   │   │   ├── AdminStats.tsx
│   │   │   ├── HairdressersManagement.tsx
│   │   │   ├── AddHairDresserDialog.tsx
│   │   │   └── EditHairDresserDialog.tsx
│   │   ├── ui/                    # Reusable UI components (shadcn)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   └── ... (30+ components)
│   │   ├── providers/
│   │   │   └── TanStackProvider.tsx
│   │   ├── Navbar.tsx
│   │   └── UserSync.tsx           # Clerk → Prisma user sync
│   ├── lib/
│   │   ├── chromeAi.ts            # Chrome built-in AI helper
│   │   ├── geminiApi.ts           # Gemini API wrapper
│   │   ├── hybridAi.ts            # AI orchestrator
│   │   ├── promptApi.ts           # Prompt processing
│   │   ├── translatorApi.ts       # Translation service
│   │   ├── summarizerApi.ts       # Text summarization
│   │   ├── firebase.ts            # Firebase config & helpers
│   │   ├── prisma.ts              # Prisma client singleton
│   │   ├── utils.ts               # Utility functions (cn, etc.)
│   │   └── actions/               # Server actions
│   │       ├── users.ts
│   │       ├── hairdressers.ts
│   │       └── appointments.ts
│   ├── hooks/
│   │   ├── use-mobile.ts
│   │   ├── use-appointment.ts
│   │   └── use-hairdressers.ts
│   └── middleware.ts              # Clerk middleware
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
└── components.json                # shadcn/ui config
```

---

## Features

### 1. Voice AI Assistant
**Location**: `/voice` page, `Widget.tsx` component

- **Speech-to-Text (STT)**: Uses Web Speech API for continuous voice recognition
- **AI Processing**: 
  - Primary: Chrome Built-in AI (on-device, experimental)
  - Fallback: Gemini API (server-side)
- **Multilingual**: Supports English, Ndebele, and Setswana
- **Real-time Responses**: Instant text replies (TTS removed)
- **Conversation History**: Persistent message display
- **Smart Suggestions**: Auto-complete suggestions as you type

**Key Functions**:
```typescript
// Check if Chrome AI is available
await checkChromeAiAvailability()

// Create AI session with language config
await createChromeAiSession()

// Send prompt to Chrome AI
await promptChromeAi(message, conversationHistory?)

// Cleanup
destroyChromeAiSession()
```

### 2. Hybrid AI System
**Location**: `src/lib/hybridAi.ts`

Orchestrates multiple AI services:
1. **Prompt Processing**: Sends user query to Gemini
2. **Translation**: Translates response to target language
3. **Summarization**: Creates concise summary
4. **Persistence**: Saves to Firebase Firestore

```typescript
const result = await handleHybridAiFlow(userId, prompt, targetLang);
// Returns: { aiResponse, translated, summary }
```

### 3. Appointment System
**Database Models**: User, HairDresser, Appointment

- Book appointments with available hairdressers
- View appointment history
- Status tracking (PENDING, CONFIRMED, CANCELLED, COMPLETED)
- Duration and notes management

### 4. Admin Dashboard
**Location**: `/admin` page (protected)

**Access Control**: 
- Email-based admin verification
- Environment variable: `ADMIN_EMAIL`

**Features**:
- View platform statistics
- Manage hairdressers (CRUD operations)
- View all appointments
- User management

### 5. Conversation Generator
**API Endpoint**: `POST /api/conversation`

Generates multi-turn conversations for training/testing:

```typescript
POST /api/conversation
{
  "topic": "haircut techniques",
  "speakers": ["Alex", "Priya"],
  "turns": 6,
  "format": "json" // or "labelled"
}

// Response
{
  "conversation": [
    { "speaker": "Alex", "text": "..." },
    { "speaker": "Priya", "text": "..." }
  ],
  "raw": "..."
}
```

---

## Setup & Installation

### Prerequisites
- Node.js 20+ 
- PostgreSQL database
- Firebase project
- Clerk account
- Google AI API key (Gemini)

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/Bandla1995/Batanani.io.git
cd Batanani.io/batanani
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create `.env` or `.env.local`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/batanani"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."

# Google Gemini AI
GEMINI_API_KEY="..."

# Admin
ADMIN_EMAIL="admin@example.com"
```

4. **Set up database**
```bash
npx prisma generate
npx prisma db push
# OR for migrations
npx prisma migrate dev --name init
```

5. **Run development server**
```bash
npm run dev
```

6. **Open browser**
```
http://localhost:3000
```

### Build for Production
```bash
npm run build
npm start
```

---

## Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ | `postgresql://...` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | ✅ | `pk_test_...` |
| `CLERK_SECRET_KEY` | Clerk secret key | ✅ | `sk_test_...` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key | ✅ | `AIza...` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID | ✅ | `batanani-...` |
| `GEMINI_API_KEY` | Google Gemini API key | ✅ | `AIza...` |
| `ADMIN_EMAIL` | Admin user email | ✅ | `admin@example.com` |

---

## Database Schema

### User Model
```prisma
model User {
  id          String   @id @default(cuid())
  clerkId     String   @unique
  email       String   @unique
  firstName   String?
  lastName    String?
  phoneNumber String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  appointments Appointment[]
}
```

### HairDresser Model
```prisma
model HairDresser {
  id          String   @id @default(cuid())
  name        String
  email       String   @unique
  phoneNumber String?
  speciality  String?
  bio         String?
  imageUrl    String?
  gender      Gender
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  appointments Appointment[]
}
```

### Appointment Model
```prisma
model Appointment {
  id        String            @id @default(cuid())
  date      DateTime
  time      String
  duration  Int               @default(30) // minutes
  status    AppointmentStatus @default(PENDING)
  notes     String?
  reason    String?
  userId        String
  hairDresserId String
  user        User        @relation(...)
  hairDresser HairDresser @relation(...)
}
```

### Enums
```prisma
enum Gender {
  MALE
  FEMALE
}

enum AppointmentStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}
```

---

## API Routes

### 1. POST `/api/prompt`
**Purpose**: Process AI prompts via Gemini

**Request**:
```typescript
{
  "prompt": "What hairstyle for curly hair?"
}
```

**Response**:
```typescript
{
  "response": "Try layered cuts with lightweight products..."
}
```

### 2. POST `/api/translate`
**Purpose**: Translate text to target language

**Request**:
```typescript
{
  "text": "Hello",
  "targetLang": "tn" // Setswana
}
```

**Response**:
```typescript
{
  "translated": "Dumelang"
}
```

### 3. POST `/api/summarize`
**Purpose**: Summarize long text

**Request**:
```typescript
{
  "text": "Long text here..."
}
```

**Response**:
```typescript
{
  "summary": "Concise summary..."
}
```

### 4. POST `/api/conversation`
**Purpose**: Generate multi-turn conversations

**Request**:
```typescript
{
  "topic": "haircut techniques",
  "speakers": ["Alex", "Priya"],
  "turns": 6,
  "format": "json"
}
```

**Response**:
```typescript
{
  "conversation": [
    { "speaker": "Alex", "text": "..." },
    { "speaker": "Priya", "text": "..." }
  ],
  "raw": "..."
}
```

---

## AI Integration

### Chrome Built-in AI (Experimental)

**Browser Requirements**:
- Chrome Canary or Chrome Dev
- Enable flag: `chrome://flags/#optimization-guide-on-device-model`
- Set to: **Enabled BypassPerfRequirement**
- Restart browser

**Features**:
- On-device inference (privacy-friendly)
- No API costs
- Fast responses
- Offline capable (after model download)

**Implementation** (`src/lib/chromeAi.ts`):

```typescript
// Type declarations
interface Window {
  ai?: {
    languageModel?: {
      availability: () => Promise<'readily' | 'after-download' | 'no'>;
      create: (options) => Promise<AILanguageModel>;
    };
  };
}

// Check availability
const isAvailable = await checkChromeAiAvailability();

// Create session
const session = await window.ai.languageModel.create({
  expectedInputs: [
    { type: 'text', languages: ['en', 'nr', 'tn'] }
  ],
  expectedOutputs: [
    { type: 'text', languages: ['nr', 'tn', 'en'] }
  ],
  initialPrompts: [
    { role: 'system', content: 'You are Bata AI...' },
    { role: 'user', content: 'Example question' },
    { role: 'assistant', content: 'Example answer' }
  ]
});

// Prompt
const response = await session.prompt("User message");
```

### Gemini API (Fallback)

**Implementation** (`src/lib/geminiApi.ts`):

```typescript
async function getGeminiResponse(prompt: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text;
}
```

### Hybrid AI Flow

**Orchestrator** (`src/lib/hybridAi.ts`):

```typescript
async function handleHybridAiFlow(
  userId: string, 
  prompt: string, 
  targetLang?: string
) {
  // 1. Save prompt to Firebase
  await savePrompt(userId, prompt);
  
  // 2. Get AI response from Gemini
  const aiResponse = await getPromptResponse(prompt);
  
  // 3. Translate if needed
  let translated = aiResponse;
  if (targetLang) {
    translated = await translateText(aiResponse, targetLang);
  }
  
  // 4. Summarize
  const summary = await summarizeText(translated);
  
  // 5. Save results to Firebase
  await saveResult(userId, { prompt, aiResponse, translated, summary });
  
  return { aiResponse, translated, summary };
}
```

---

## Authentication & Authorization

### Clerk Integration

**Setup** (`src/app/layout.tsx`):
```tsx
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html>
        <body>
          <UserSync /> {/* Syncs Clerk user to Prisma */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
```

**Middleware** (`src/middleware.ts`):
```typescript
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!_next|.*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

**User Sync** (`src/components/UserSync.tsx`):
```typescript
// Automatically syncs Clerk user to Prisma database
// Runs on every page load when user is authenticated
```

### Admin Protection

**Admin Page** (`src/app/admin/page.tsx`):
```typescript
async function AdminPage() {
  const user = await currentUser();
  if (!user) redirect("/");
  
  const adminEmail = process.env.ADMIN_EMAIL;
  const userEmail = user.emailAddresses[0]?.emailAddress;
  
  if (userEmail !== adminEmail) redirect("/dashboard");
  
  return <AdminDashboardClient />
}
```

---

## Components

### Voice Widget (`src/components/voice/Widget.tsx`)

**Main Component**: Handles voice and text AI interactions

**State Management**:
```typescript
const [callActive, setCallActive] = useState(false);
const [messages, setMessages] = useState<Message[]>([]);
const [textInput, setTextInput] = useState("");
const [isSpeaking, setIsSpeaking] = useState(false);
```

**Speech Recognition Setup**:
```typescript
useEffect(() => {
  recognitionRef.current = new SpeechRecognition();
  recognitionRef.current.continuous = true;
  recognitionRef.current.interimResults = false;
  recognitionRef.current.lang = 'en-US';
  
  recognitionRef.current.onresult = async (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript;
    // Process with AI...
  };
}, []);
```

**AI Processing Flow**:
1. Try Chrome built-in AI
2. If unavailable, fallback to server API
3. Display response
4. Restart recognition

### Landing Components

**Structure**:
```
Landing Page
├── Header (navigation + auth buttons)
├── Hero (main CTA)
├── HowItWorks (3-step guide)
├── WhatToAsk (example queries)
├── PricingSection (plans)
├── CTA (final call-to-action)
└── Footer (links + social)
```

### Admin Components

**AdminStats**: Display platform metrics
- Total users
- Total appointments
- Active hairdressers
- Revenue stats

**HairdressersManagement**: CRUD for hairdressers
- Add new hairdresser
- Edit existing
- Toggle active status
- Delete hairdresser

---

## Deployment

### Vercel (Recommended)

1. **Connect GitHub repo** to Vercel
2. **Add environment variables** in Vercel dashboard
3. **Deploy**:
```bash
vercel --prod
```

### Environment Setup
- Set `DATABASE_URL` to production PostgreSQL
- Add all `NEXT_PUBLIC_*` variables
- Set `ADMIN_EMAIL`
- Configure Firebase for production

### Database Migration
```bash
npx prisma migrate deploy
```

### Build Command
```bash
npm run build
```

### Start Command
```bash
npm start
```

---

## Development Guide

### Adding New Features

1. **Create component** in `src/components/`
2. **Add route** in `src/app/` (if needed)
3. **Add API endpoint** in `src/app/api/` (if needed)
4. **Update database schema** in `prisma/schema.prisma`
5. **Run migration**:
```bash
npx prisma migrate dev --name feature_name
```

### Code Style

**TypeScript**:
- Use explicit types
- Avoid `any` (use `unknown` if needed)
- Enable strict mode

**React**:
- Functional components
- Use hooks (useState, useEffect, etc.)
- Client components: `"use client"` directive
- Server components: default (no directive)

**File Naming**:
- Components: PascalCase (e.g., `UserProfile.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- API routes: `route.ts`

### Testing Voice AI

1. **Enable Chrome AI**:
   - Install Chrome Canary
   - Go to `chrome://flags/#optimization-guide-on-device-model`
   - Enable: **Enabled BypassPerfRequirement**
   - Restart browser

2. **Test Speech Recognition**:
   - Allow microphone permissions
   - Click "Start Call" in voice widget
   - Speak clearly
   - Check console for errors

3. **Fallback Testing**:
   - Disable Chrome AI
   - Verify Gemini API fallback works
   - Check API logs

### Debugging

**Enable verbose logging**:
```typescript
// In widget or API routes
console.log('AI Response:', response);
console.error('Error details:', error);
```

**Check databases**:
```bash
# Prisma Studio (PostgreSQL)
npx prisma studio

# Firebase Console (Firestore)
# Visit https://console.firebase.google.com
```

**Inspect Network**:
- Open DevTools → Network tab
- Filter: Fetch/XHR
- Check API responses

---

## Troubleshooting

### Common Issues

**1. Chrome AI not available**
- ✅ Use Chrome Canary/Dev (not stable)
- ✅ Enable flag: `chrome://flags/#optimization-guide-on-device-model`
- ✅ Restart browser after enabling flag

**2. Speech recognition not working**
- ✅ Grant microphone permissions
- ✅ Use HTTPS (or localhost)
- ✅ Check browser compatibility (Chrome, Edge)

**3. Database connection errors**
- ✅ Verify `DATABASE_URL` in `.env`
- ✅ Run `npx prisma generate`
- ✅ Check PostgreSQL is running

**4. Clerk authentication issues**
- ✅ Verify Clerk keys in `.env`
- ✅ Check domain settings in Clerk dashboard
- ✅ Clear browser cookies/cache

**5. Firebase errors**
- ✅ Verify all `NEXT_PUBLIC_FIREBASE_*` vars
- ✅ Check Firebase project settings
- ✅ Enable Firestore in Firebase console

**6. API rate limits**
- ✅ Monitor Gemini API usage
- ✅ Implement caching for repeated queries
- ✅ Use Chrome AI to reduce server calls

---

## Performance Optimization

### Client-Side
- Use Chrome built-in AI (reduces API calls)
- Lazy load components
- Image optimization (Next.js Image component)
- Code splitting (automatic with Next.js)

### Server-Side
- Edge functions for API routes
- Database query optimization (Prisma)
- Caching strategies (React Query)
- CDN for static assets

### AI Optimization
- Keep prompts concise
- Use streaming responses (future feature)
- Implement prompt caching
- Batch requests where possible

---

## Security Best Practices

1. **Never expose secrets** in client code
2. **Use environment variables** for API keys
3. **Validate user input** (Zod schemas)
4. **Sanitize AI responses** before rendering
5. **Rate limit API routes** (future feature)
6. **Implement CORS** properly
7. **Use HTTPS** in production
8. **Regular dependency updates** (`npm audit`)

---

## Roadmap

### Planned Features
- [ ] Real-time appointment notifications
- [ ] Video consultations with hairdressers
- [ ] AI-generated hairstyle recommendations with images
- [ ] Payment integration (Stripe/PayPal)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language UI (not just AI responses)
- [ ] Hairdresser rating system
- [ ] Loyalty program
- [ ] AI voice responses (TTS)

---

## Contributing

### How to Contribute
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Code Review Process
- All PRs require review
- Must pass CI/CD checks
- Follow existing code style
- Add tests for new features

---

## License

This project is proprietary software owned by Batanani.io.

---

## Support

For issues or questions:
- **GitHub Issues**: [Batanani.io/issues](https://github.com/Bandla1995/Batanani.io/issues)
- **Email**: support@batanani.io
- **Documentation**: This file

---

## Changelog

### v0.1.0 (Current)
- Initial release
- Voice AI assistant (STT)
- Chrome built-in AI integration
- Gemini API fallback
- Appointment booking system
- Admin dashboard
- Multilingual support (en, nr, tn)
- Clerk authentication
- Prisma + PostgreSQL
- Firebase integration

---

**Last Updated**: October 31, 2025  
**Version**: 0.1.0  
**Maintained by**: Batanani.io Team
