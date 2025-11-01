# API Documentation

## Overview
This document describes all API endpoints available in the Batanani.io application.

**Base URL**: `http://localhost:3000/api` (development)  
**Production URL**: `https://your-domain.com/api`

---

## Authentication

All API routes are protected by Clerk middleware. Authenticated requests must include Clerk session cookies.

**Authentication Headers** (handled automatically by Clerk):
```
Cookie: __clerk_session=...
```

---

## API Endpoints

### 1. Prompt API

**Endpoint**: `POST /api/prompt`

**Description**: Process user prompts through the AI system (Gemini API)

**Request Body**:
```json
{
  "prompt": "What hairstyle works best for curly hair?"
}
```

**Response**:
```json
{
  "response": "For curly hair, try layered cuts to add volume. Use sulfate-free shampoo and lightweight mousse to define curls without weighing them down."
}
```

**Status Codes**:
- `200`: Success
- `400`: Invalid request body
- `500`: Server error

**Example Usage**:
```typescript
const response = await fetch('/api/prompt', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'What hairstyle works best for curly hair?'
  })
});

const data = await response.json();
console.log(data.response);
```

---

### 2. Translation API

**Endpoint**: `POST /api/translate`

**Description**: Translate text to a target language

**Request Body**:
```json
{
  "text": "Hello, how can I help you today?",
  "targetLang": "tn"
}
```

**Supported Languages**:
- `en` - English
- `nr` - Ndebele
- `tn` - Setswana
- `es` - Spanish (legacy support)

**Response**:
```json
{
  "translated": "Dumelang, ke ka go thusa jang lehono?",
  "sourceLang": "en",
  "targetLang": "tn"
}
```

**Status Codes**:
- `200`: Success
- `400`: Invalid language code
- `500`: Translation service error

**Example Usage**:
```typescript
const response = await fetch('/api/translate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'Hello, how can I help you today?',
    targetLang: 'tn'
  })
});

const { translated } = await response.json();
```

---

### 3. Summarization API

**Endpoint**: `POST /api/summarize`

**Description**: Summarize long text into concise format

**Request Body**:
```json
{
  "text": "Long text content here that needs to be summarized...",
  "maxLength": 100
}
```

**Parameters**:
- `text` (required): Text to summarize
- `maxLength` (optional): Maximum summary length in characters (default: 150)

**Response**:
```json
{
  "summary": "Concise summary of the text...",
  "originalLength": 500,
  "summaryLength": 95
}
```

**Status Codes**:
- `200`: Success
- `400`: Missing or invalid text
- `500`: Summarization error

**Example Usage**:
```typescript
const response = await fetch('/api/summarize', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: longText,
    maxLength: 100
  })
});

const { summary } = await response.json();
```

---

### 4. Conversation Generator API

**Endpoint**: `POST /api/conversation`

**Description**: Generate multi-turn conversations for training or demonstration

**Request Body**:
```json
{
  "topic": "haircut techniques for fine, curly hair",
  "speakers": ["Alex", "Priya"],
  "turns": 6,
  "format": "json"
}
```

**Parameters**:
- `topic` (optional): Conversation topic (default: "haircut techniques for fine, curly hair")
- `speakers` (optional): Array of speaker names (default: ["Alex", "Priya"])
- `turns` (optional): Number of conversation turns, 2-12 (default: 6)
- `format` (optional): Output format, "json" or "labelled" (default: "json")

**Response (format: "json")**:
```json
{
  "conversation": [
    {
      "speaker": "Alex",
      "text": "I'm looking for advice on cutting fine curly hair."
    },
    {
      "speaker": "Priya",
      "text": "For fine curly hair, I recommend starting with wet cutting to see the natural curl pattern."
    },
    {
      "speaker": "Alex",
      "text": "Should I use thinning shears?"
    },
    {
      "speaker": "Priya",
      "text": "Avoid thinning shears on fine hair as they can create frizz. Use point cutting instead."
    }
  ],
  "raw": "..." // Original AI response
}
```

**Response (format: "labelled")**:
```json
{
  "conversation": [
    {
      "speaker": "Alex",
      "text": "I'm looking for advice on cutting fine curly hair."
    },
    {
      "speaker": "Priya",
      "text": "For fine curly hair, I recommend starting with wet cutting."
    }
  ],
  "raw": "Alex: I'm looking for advice on cutting fine curly hair.\nPriya: For fine curly hair, I recommend starting with wet cutting.\n..."
}
```

**Status Codes**:
- `200`: Success
- `400`: Invalid parameters
- `500`: Generation error

**Example Usage**:
```typescript
const response = await fetch('/api/conversation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    topic: 'braiding techniques',
    speakers: ['Sarah', 'Mike'],
    turns: 8,
    format: 'json'
  })
});

const { conversation } = await response.json();

// Use conversation data
conversation.forEach(({ speaker, text }) => {
  console.log(`${speaker}: ${text}`);
});
```

---

## Server Actions (Prisma)

Server actions are located in `src/lib/actions/` and provide database operations.

### User Actions (`src/lib/actions/users.ts`)

#### Get User by Clerk ID
```typescript
import { getUserByClerkId } from '@/lib/actions/users';

const user = await getUserByClerkId(clerkId);
```

#### Create User
```typescript
import { createUser } from '@/lib/actions/users';

const user = await createUser({
  clerkId: 'user_123',
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe'
});
```

#### Update User
```typescript
import { updateUser } from '@/lib/actions/users';

const updatedUser = await updateUser(userId, {
  firstName: 'Jane',
  phoneNumber: '+27123456789'
});
```

---

### Hairdresser Actions (`src/lib/actions/hairdressers.ts`)

#### Get All Hairdressers
```typescript
import { getAllHairdressers } from '@/lib/actions/hairdressers';

const hairdressers = await getAllHairdressers();
```

#### Get Active Hairdressers
```typescript
import { getActiveHairdressers } from '@/lib/actions/hairdressers';

const activeHairdressers = await getActiveHairdressers();
```

#### Create Hairdresser
```typescript
import { createHairdresser } from '@/lib/actions/hairdressers';

const hairdresser = await createHairdresser({
  name: 'Sarah Johnson',
  email: 'sarah@example.com',
  phoneNumber: '+27123456789',
  speciality: 'Braiding & Extensions',
  bio: 'Expert in African braiding styles',
  gender: 'FEMALE',
  imageUrl: 'https://...'
});
```

#### Update Hairdresser
```typescript
import { updateHairdresser } from '@/lib/actions/hairdressers';

const updated = await updateHairdresser(hairdresserId, {
  speciality: 'Braiding, Extensions & Cornrows',
  isActive: true
});
```

#### Delete Hairdresser
```typescript
import { deleteHairdresser } from '@/lib/actions/hairdressers';

await deleteHairdresser(hairdresserId);
```

---

### Appointment Actions (`src/lib/actions/appointments.ts`)

#### Get User Appointments
```typescript
import { getUserAppointments } from '@/lib/actions/appointments';

const appointments = await getUserAppointments(userId);
```

#### Get Hairdresser Appointments
```typescript
import { getHairdresserAppointments } from '@/lib/actions/appointments';

const appointments = await getHairdresserAppointments(hairdresserId);
```

#### Create Appointment
```typescript
import { createAppointment } from '@/lib/actions/appointments';

const appointment = await createAppointment({
  userId: 'user_123',
  hairDresserId: 'dresser_456',
  date: new Date('2025-11-15'),
  time: '14:00',
  duration: 60,
  reason: 'Box braids',
  notes: 'Medium length, black extensions'
});
```

#### Update Appointment Status
```typescript
import { updateAppointmentStatus } from '@/lib/actions/appointments';

const updated = await updateAppointmentStatus(
  appointmentId, 
  'CONFIRMED'
);
```

#### Cancel Appointment
```typescript
import { cancelAppointment } from '@/lib/actions/appointments';

await cancelAppointment(appointmentId);
```

---

## AI Integration Functions

### Chrome Built-in AI (`src/lib/chromeAi.ts`)

#### Check Availability
```typescript
import { checkChromeAiAvailability } from '@/lib/chromeAi';

const isAvailable = await checkChromeAiAvailability();
if (isAvailable) {
  // Use Chrome AI
} else {
  // Fallback to server API
}
```

#### Create Session
```typescript
import { createChromeAiSession } from '@/lib/chromeAi';

const session = await createChromeAiSession();
// Session configured with:
// - Languages: en, nr, tn
// - Initial prompts (system message + example)
```

#### Prompt Chrome AI
```typescript
import { promptChromeAi } from '@/lib/chromeAi';

// Simple prompt
const response = await promptChromeAi('What hairstyle for curly hair?');

// With conversation history
const response = await promptChromeAi(
  'What about for straight hair?',
  [
    { role: 'user', content: 'What hairstyle for curly hair?' },
    { role: 'assistant', content: 'Try layered cuts...' }
  ]
);
```

#### Cleanup
```typescript
import { destroyChromeAiSession } from '@/lib/chromeAi';

// Call on component unmount
useEffect(() => {
  return () => {
    destroyChromeAiSession();
  };
}, []);
```

---

### Hybrid AI Flow (`src/lib/hybridAi.ts`)

**Orchestrates**: Prompt → Translation → Summarization → Firebase Storage

```typescript
import { handleHybridAiFlow } from '@/lib/hybridAi';

const result = await handleHybridAiFlow(
  userId,
  'What hairstyle for curly hair?',
  'tn' // Target language (optional)
);

console.log(result.aiResponse);   // Original AI response
console.log(result.translated);   // Translated response
console.log(result.summary);      // Summarized response
```

**Returns**:
```typescript
{
  aiResponse: string;   // Original Gemini response
  translated: string;   // Translated to target language
  summary: string;      // Concise summary
}
```

---

### Gemini API (`src/lib/geminiApi.ts`)

**Direct Gemini API call** (server-side only):

```typescript
import { getGeminiResponse } from '@/lib/geminiApi';

const response = await getGeminiResponse('Your prompt here');
```

**Note**: This function requires `GEMINI_API_KEY` environment variable.

---

## Firebase Functions (`src/lib/firebase.ts`)

### Save Prompt
```typescript
import { savePrompt } from '@/lib/firebase';

await savePrompt(userId, 'User prompt text');
// Saves to: prompts/{userId}/history/{timestamp}
```

### Save Result
```typescript
import { saveResult } from '@/lib/firebase';

await saveResult(userId, {
  prompt: 'Original prompt',
  aiResponse: 'AI response',
  translated: 'Translated response',
  summary: 'Summary'
});
// Saves to: results/{userId}/responses/{timestamp}
```

---

## Error Handling

All API routes follow this error response format:

```json
{
  "error": "Error message description",
  "code": "ERROR_CODE",
  "details": {} // Optional additional info
}
```

**Common Error Codes**:
- `INVALID_REQUEST`: Missing or malformed request body
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `RATE_LIMIT`: Too many requests
- `SERVER_ERROR`: Internal server error
- `AI_ERROR`: AI service unavailable
- `DATABASE_ERROR`: Database operation failed

**Example Error Response**:
```json
{
  "error": "Invalid prompt format",
  "code": "INVALID_REQUEST",
  "status": 400
}
```

---

## Rate Limiting

**Current Status**: Not implemented

**Planned Limits**:
- Prompt API: 100 requests/hour per user
- Translation API: 200 requests/hour per user
- Conversation Generator: 20 requests/hour per user

---

## Webhooks

### Clerk Webhooks

**Endpoint**: `/api/webhooks/clerk`

**Events**:
- `user.created`: Sync new user to Prisma
- `user.updated`: Update user in Prisma
- `user.deleted`: Delete user from Prisma

**Webhook Signature Verification**:
```typescript
import { Webhook } from 'svix';

const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
const payload = webhook.verify(body, headers);
```

---

## Testing

### Manual Testing with cURL

**Test Prompt API**:
```bash
curl -X POST http://localhost:3000/api/prompt \
  -H "Content-Type: application/json" \
  -d '{"prompt":"What hairstyle for curly hair?"}'
```

**Test Translation API**:
```bash
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello","targetLang":"tn"}'
```

**Test Conversation API**:
```bash
curl -X POST http://localhost:3000/api/conversation \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "braiding techniques",
    "speakers": ["Sarah", "Mike"],
    "turns": 4,
    "format": "json"
  }'
```

### Testing with Postman

1. Import collection (create from examples above)
2. Set base URL: `http://localhost:3000`
3. Add Clerk session cookie for authenticated routes
4. Test each endpoint

---

## API Best Practices

1. **Always validate input** on server side
2. **Use TypeScript types** for type safety
3. **Handle errors gracefully** with proper status codes
4. **Log errors** for debugging (don't expose to client)
5. **Sanitize AI responses** before returning
6. **Implement rate limiting** (future)
7. **Cache frequent requests** (future)
8. **Monitor API usage** for quota management

---

## Support

For API-related issues:
- Check server logs: `npm run dev` output
- Verify environment variables: `.env.local`
- Test with minimal example
- Open GitHub issue with reproduction steps

---

**Last Updated**: October 31, 2025  
**API Version**: 1.0.0
