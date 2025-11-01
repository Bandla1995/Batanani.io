# Component Documentation

## Overview
This document provides detailed information about all React components in the Batanani.io application.

---

## Voice Components

### Widget (`src/components/voice/Widget.tsx`)

**Purpose**: Main voice and text AI interaction interface

**Features**:
- Speech-to-text (STT) via Web Speech API
- Real-time chat interface
- Chrome built-in AI with Gemini fallback
- Text input support
- Conversation history
- Auto-scroll messages

**Props**: None (uses Clerk's `useUser` hook internally)

**State**:
```typescript
{
  callActive: boolean;        // Voice recognition active
  connecting: boolean;        // Transitioning state
  isSpeaking: boolean;        // AI processing indicator
  messages: Message[];        // Chat history
  callEnded: boolean;         // Call terminated flag
  textInput: string;          // Text input value
  partialAi: string | null;   // Live suggestion text
}
```

**Types**:
```typescript
type Message = {
  content: string;
  role: 'user' | 'assistant' | 'system';
  speaker?: string;
};
```

**Key Functions**:

#### startCall()
```typescript
const startCall = () => {
  setConnecting(true);
  setTimeout(() => {
    setCallActive(true);
    setConnecting(false);
    recognitionRef.current?.start();
  }, 1000);
};
```

#### endCall()
```typescript
const endCall = () => {
  setCallActive(false);
  setCallEnded(true);
  recognitionRef.current?.stop();
  destroyChromeAiSession();
};
```

#### handleSendMessage()
Processes text input through AI system:
1. Try Chrome built-in AI
2. Fallback to server API (`handleHybridAiFlow`)
3. Display response
4. Restart recognition if active

**Usage**:
```tsx
import Widget from '@/components/voice/Widget';

export default function VoicePage() {
  return <Widget />;
}
```

---

### WelcomeSection (`src/components/voice/WelcomeSection.tsx`)

**Purpose**: Welcome message and instructions for voice page

**Props**: None

**Features**:
- Greeting message
- Usage instructions
- Getting started tips

**Usage**:
```tsx
import WelcomeSection from '@/components/voice/WelcomeSection';

<WelcomeSection />
```

---

### FeatureCards (`src/components/voice/FeatureCards.tsx`)

**Purpose**: Display key features of voice assistant

**Props**: None

**Features**:
- Feature highlights
- Icon displays
- Responsive grid layout

**Usage**:
```tsx
import FeatureCards from '@/components/voice/FeatureCards';

<FeatureCards />
```

---

## Landing Components

### Header (`src/components/landing/Header.tsx`)

**Purpose**: Main navigation header with authentication

**Features**:
- Logo/brand
- Navigation links
- Sign In/Sign Up buttons (if not authenticated)
- User profile button (if authenticated)

**Props**: None (uses Clerk hooks)

**Usage**:
```tsx
import Header from '@/components/landing/Header';

<Header />
```

---

### Hero (`src/components/landing/Hero.tsx`)

**Purpose**: Hero section with main CTA

**Features**:
- Main headline
- Subheadline
- Primary CTA button
- Hero image/animation

**Props**: None

**Usage**:
```tsx
import Hero from '@/components/landing/Hero';

<Hero />
```

---

### HowItWorks (`src/components/landing/HowItWorks.tsx`)

**Purpose**: 3-step guide for using the platform

**Features**:
- Step-by-step instructions
- Visual icons
- Clear descriptions

**Steps**:
1. Sign up for free
2. Start voice conversation
3. Get instant AI assistance

**Usage**:
```tsx
import HowItWorks from '@/components/landing/HowItWorks';

<HowItWorks />
```

---

### WhatToAsk (`src/components/landing/WhatToAsk.tsx`)

**Purpose**: Example queries users can ask

**Features**:
- Example questions
- Use case demonstrations
- Interactive suggestions

**Example Questions**:
- "What hairstyle suits curly hair?"
- "How do I maintain box braids?"
- "Book appointment with a hairdresser"
- "What products for dry scalp?"

**Usage**:
```tsx
import WhatToAsk from '@/components/landing/WhatToAsk';

<WhatToAsk />
```

---

### PricingSection (`src/components/landing/PricingSection.tsx`)

**Purpose**: Display pricing tiers

**Features**:
- Multiple pricing plans
- Feature comparison
- CTA buttons

**Plans**:
- Free: Basic AI chat
- Pro: Unlimited conversations + priority support
- Business: Team accounts + API access

**Usage**:
```tsx
import PricingSection from '@/components/landing/PricingSection';

<PricingSection />
```

---

### CTA (`src/components/landing/CTA.tsx`)

**Purpose**: Final call-to-action section

**Features**:
- Compelling message
- Sign-up CTA
- Social proof

**Usage**:
```tsx
import CTA from '@/components/landing/CTA';

<CTA />
```

---

### Footer (`src/components/landing/Footer.tsx`)

**Purpose**: Site footer with links and info

**Features**:
- Company info
- Navigation links
- Social media links
- Copyright notice

**Usage**:
```tsx
import Footer from '@/components/landing/Footer';

<Footer />
```

---

## Admin Components

### AdminDashboardClient (`src/app/admin/AdminDashboardClient.tsx`)

**Purpose**: Main admin dashboard container

**Features**:
- Admin stats overview
- Hairdresser management
- Navigation tabs

**Props**: None (server-side checks admin email)

**Usage**:
```tsx
import AdminDashboardClient from './AdminDashboardClient';

<AdminDashboardClient />
```

---

### AdminStats (`src/components/admin/AdminStats.tsx`)

**Purpose**: Display platform statistics

**Features**:
- Total users count
- Total appointments
- Active hairdressers
- Revenue metrics

**Props**: None (fetches data via React Query)

**Data Display**:
```typescript
{
  totalUsers: number;
  totalAppointments: number;
  activeHairdressers: number;
  monthlyRevenue: number;
}
```

**Usage**:
```tsx
import AdminStats from '@/components/admin/AdminStats';

<AdminStats />
```

---

### HairdressersManagement (`src/components/admin/HairdressersManagement.tsx`)

**Purpose**: CRUD interface for hairdressers

**Features**:
- List all hairdressers
- Add new hairdresser
- Edit existing hairdresser
- Delete hairdresser
- Toggle active status
- Search/filter

**Props**: None

**State**:
```typescript
{
  hairdressers: HairDresser[];
  selectedHairdresser: HairDresser | null;
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
}
```

**Usage**:
```tsx
import HairdressersManagement from '@/components/admin/HairdressersManagement';

<HairdressersManagement />
```

---

### AddHairDresserDialog (`src/components/admin/AddHairDresserDialog.tsx`)

**Purpose**: Modal dialog for adding new hairdresser

**Props**:
```typescript
{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
```

**Form Fields**:
- Name (required)
- Email (required)
- Phone number
- Speciality
- Bio
- Gender (MALE/FEMALE)
- Image URL

**Validation**: React Hook Form + Zod schema

**Usage**:
```tsx
import AddHairDresserDialog from '@/components/admin/AddHairDresserDialog';

<AddHairDresserDialog 
  open={isOpen} 
  onOpenChange={setIsOpen} 
/>
```

---

### EditHairDresserDialog (`src/components/admin/EditHairDresserDialog.tsx`)

**Purpose**: Modal dialog for editing hairdresser

**Props**:
```typescript
{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hairdresser: HairDresser;
}
```

**Features**:
- Pre-filled form with existing data
- Update all fields
- Toggle active status
- Delete hairdresser

**Usage**:
```tsx
import EditHairDresserDialog from '@/components/admin/EditHairDresserDialog';

<EditHairDresserDialog 
  open={isOpen} 
  onOpenChange={setIsOpen}
  hairdresser={selectedHairdresser}
/>
```

---

## Utility Components

### Navbar (`src/components/Navbar.tsx`)

**Purpose**: Shared navigation component

**Features**:
- Logo/brand
- Navigation links
- User menu
- Responsive design

**Props**: None

**Usage**:
```tsx
import Navbar from '@/components/Navbar';

<Navbar />
```

---

### UserSync (`src/components/UserSync.tsx`)

**Purpose**: Sync Clerk users to Prisma database

**Features**:
- Automatic sync on auth
- Creates user record in PostgreSQL
- Updates user info

**Props**: None

**Trigger**: Runs automatically when user signs in

**Implementation**:
```tsx
'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

export default function UserSync() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      // Sync user to Prisma
      syncUserToPrisma(user);
    }
  }, [user, isLoaded]);

  return null; // No UI
}
```

**Usage** (in root layout):
```tsx
import UserSync from '@/components/UserSync';

<ClerkProvider>
  <UserSync />
  {children}
</ClerkProvider>
```

---

## Provider Components

### TanStackProvider (`src/components/providers/TanStackProvider.tsx`)

**Purpose**: React Query (TanStack Query) provider

**Features**:
- Global query client
- Cache management
- Refetch strategies

**Props**:
```typescript
{
  children: React.ReactNode;
}
```

**Configuration**:
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});
```

**Usage**:
```tsx
import TanStackProvider from '@/components/providers/TanStackProvider';

<TanStackProvider>
  <App />
</TanStackProvider>
```

---

## UI Components (shadcn/ui)

Located in `src/components/ui/`. All components from shadcn/ui library.

### Button (`src/components/ui/button.tsx`)

**Variants**:
- `default`: Primary button
- `destructive`: Danger/delete action
- `outline`: Secondary action
- `ghost`: Minimal styling
- `link`: Text link style

**Sizes**:
- `default`: Standard size
- `sm`: Small
- `lg`: Large
- `icon`: Icon-only (square)

**Usage**:
```tsx
import { Button } from '@/components/ui/button';

<Button variant="default" size="lg">
  Click Me
</Button>

<Button variant="destructive" onClick={handleDelete}>
  Delete
</Button>
```

---

### Card (`src/components/ui/card.tsx`)

**Components**:
- `Card`: Container
- `CardHeader`: Top section
- `CardTitle`: Title text
- `CardDescription`: Subtitle
- `CardContent`: Main content
- `CardFooter`: Bottom section

**Usage**:
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content here</p>
  </CardContent>
</Card>
```

---

### Dialog (`src/components/ui/dialog.tsx`)

**Components**:
- `Dialog`: Root component
- `DialogTrigger`: Opens dialog
- `DialogContent`: Modal content
- `DialogHeader`: Title section
- `DialogTitle`: Dialog title
- `DialogDescription`: Description
- `DialogFooter`: Action buttons

**Usage**:
```tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    <div>Dialog content</div>
    <DialogFooter>
      <Button onClick={() => setIsOpen(false)}>Close</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### Input (`src/components/ui/input.tsx`)

**Usage**:
```tsx
import { Input } from '@/components/ui/input';

<Input 
  type="text" 
  placeholder="Enter name"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

---

### Select (`src/components/ui/select.tsx`)

**Components**:
- `Select`: Root
- `SelectTrigger`: Dropdown trigger
- `SelectValue`: Selected value display
- `SelectContent`: Options container
- `SelectItem`: Individual option

**Usage**:
```tsx
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

---

### Form (`src/components/ui/form.tsx`)

**Integration with React Hook Form**

**Components**:
- `Form`: Root provider
- `FormField`: Field wrapper
- `FormItem`: Item container
- `FormLabel`: Label text
- `FormControl`: Input wrapper
- `FormDescription`: Help text
- `FormMessage`: Error message

**Usage**:
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '' },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

---

### Other UI Components

All located in `src/components/ui/`:

- **Accordion**: Collapsible content sections
- **Alert**: Notification/warning messages
- **AlertDialog**: Confirmation dialogs
- **Avatar**: User profile images
- **Badge**: Status indicators
- **Breadcrumb**: Navigation breadcrumbs
- **Calendar**: Date picker
- **Carousel**: Image/content slider
- **Chart**: Data visualization (recharts)
- **Checkbox**: Boolean input
- **Collapsible**: Show/hide content
- **Command**: Command palette (⌘K)
- **ContextMenu**: Right-click menu
- **DropdownMenu**: Dropdown actions
- **HoverCard**: Hover popover
- **InputOTP**: OTP code input
- **Label**: Form labels
- **Menubar**: Menu bar navigation
- **NavigationMenu**: Site navigation
- **Pagination**: Page navigation
- **Popover**: Floating content
- **Progress**: Progress bar
- **RadioGroup**: Radio button group
- **Resizable**: Resizable panels
- **ScrollArea**: Custom scrollbar
- **Separator**: Divider line
- **Sheet**: Side drawer
- **Sidebar**: Navigation sidebar
- **Skeleton**: Loading placeholder
- **Slider**: Range input
- **Sonner**: Toast notifications
- **Switch**: Toggle switch
- **Table**: Data tables
- **Tabs**: Tabbed content
- **Textarea**: Multi-line input
- **Toggle**: Toggle button
- **ToggleGroup**: Toggle button group
- **Tooltip**: Hover tooltip

**Documentation**: See [shadcn/ui docs](https://ui.shadcn.com/docs/components)

---

## Custom Hooks

### use-mobile (`src/hooks/use-mobile.ts`)

**Purpose**: Detect mobile screen size

**Returns**: `boolean`

**Usage**:
```tsx
import { useMobile } from '@/hooks/use-mobile';

function MyComponent() {
  const isMobile = useMobile();
  
  return (
    <div>
      {isMobile ? <MobileView /> : <DesktopView />}
    </div>
  );
}
```

---

### use-appointment (`src/hooks/use-appointment.ts`)

**Purpose**: Manage appointment data with React Query

**Functions**:
- `useAppointments(userId)`: Fetch user appointments
- `useCreateAppointment()`: Create appointment mutation
- `useUpdateAppointment()`: Update appointment mutation
- `useCancelAppointment()`: Cancel appointment mutation

**Usage**:
```tsx
import { useAppointments, useCreateAppointment } from '@/hooks/use-appointment';

function AppointmentList() {
  const { data: appointments, isLoading } = useAppointments(userId);
  const createMutation = useCreateAppointment();

  const handleCreate = (data) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Appointment created!');
      },
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {appointments.map(apt => (
        <AppointmentCard key={apt.id} appointment={apt} />
      ))}
    </div>
  );
}
```

---

### use-hairdressers (`src/hooks/use-hairdressers.ts`)

**Purpose**: Manage hairdresser data with React Query

**Functions**:
- `useHairdressers()`: Fetch all hairdressers
- `useActiveHairdressers()`: Fetch active only
- `useCreateHairdresser()`: Create mutation
- `useUpdateHairdresser()`: Update mutation
- `useDeleteHairdresser()`: Delete mutation

**Usage**:
```tsx
import { useHairdressers, useCreateHairdresser } from '@/hooks/use-hairdressers';

function HairdresserList() {
  const { data: hairdressers, isLoading } = useHairdressers();
  const createMutation = useCreateHairdresser();

  if (isLoading) return <Skeleton />;

  return (
    <div>
      {hairdressers.map(dresser => (
        <HairdresserCard key={dresser.id} dresser={dresser} />
      ))}
    </div>
  );
}
```

---

## Component Best Practices

### 1. File Organization
```
component-name/
├── ComponentName.tsx       # Main component
├── ComponentName.test.tsx  # Tests (future)
└── index.ts               # Export (optional)
```

### 2. Component Structure
```tsx
'use client'; // If client component

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  title: string;
  onAction?: () => void;
}

export default function MyComponent({ title, onAction }: Props) {
  const [state, setState] = useState('');

  const handleClick = () => {
    // Logic here
    onAction?.();
  };

  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={handleClick}>Click</Button>
    </div>
  );
}
```

### 3. Naming Conventions
- Components: PascalCase (`UserProfile.tsx`)
- Props interfaces: `ComponentNameProps` or inline
- Handlers: `handle*` prefix (`handleClick`)
- State setters: `set*` prefix (`setIsOpen`)

### 4. Props Guidelines
- Use TypeScript interfaces for props
- Provide default values when appropriate
- Use optional chaining for optional callbacks
- Document complex props with JSDoc

### 5. State Management
- Use `useState` for local state
- Use React Query for server state
- Use Clerk hooks for auth state
- Avoid prop drilling (use context if needed)

---

## Testing (Future)

### Unit Tests
```typescript
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders title', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

---

**Last Updated**: October 31, 2025  
**Component Version**: 1.0.0
