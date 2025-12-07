# ViewerQ Design Documentation

> **Purpose**: This document provides comprehensive design specifications for migrating the ViewerQ frontend prototype to a production-ready application with a functional backend.

---

## Table of Contents

1. [Application Overview](#1-application-overview)
2. [Component Inventory](#2-component-inventory)
3. [User Flows](#3-user-flows)
4. [Integration Points](#4-integration-points)
5. [Design System](#5-design-system)
6. [State Management Requirements](#6-state-management-requirements)
7. [Expected Functionality](#7-expected-functionality)
8. [Database Schema Recommendations](#8-database-schema-recommendations)

---

## 1. Application Overview

### 1.1 Purpose
ViewerQ is a queue management system for Twitch streamers who play games with their viewers. It automates:
- Queue management via Twitch chat commands
- Random/sequential viewer selection
- Discord voice channel creation and invite distribution

### 1.2 Tech Stack
| Layer | Technology |
|-------|------------|
| Framework | React 18.3.1 |
| Build Tool | Vite 5.4.0 |
| Styling | Tailwind CSS 3.4.4 |
| Animation | Framer Motion 11.0.0 |
| Icons | Lucide React 0.436.0 |
| Utilities | clsx, tailwind-merge |

### 1.3 File Structure
```
src/
├── main.jsx          # App entry point with hash-based routing
├── index.css         # Tailwind imports
├── LandingPage.jsx   # Marketing/landing page
├── Auth.jsx          # Authentication flow (signup/login/role selection)
├── StreamerSetup.jsx # 4-step streamer onboarding wizard
├── ViewerSetup.jsx   # Viewer account linking flow
└── Dashboard.jsx     # Main streamer dashboard
```

### 1.4 Current Routing
Hash-based client-side routing in `main.jsx`:

| Hash | View | Description |
|------|------|-------------|
| `#` (default) | `LandingPage` | Marketing page |
| `#auth`, `#signup`, `#login` | `Auth` | Authentication |
| `#streamer-setup` | `StreamerSetup` | Streamer onboarding |
| `#viewer-setup` | `ViewerSetup` | Viewer onboarding |
| `#dashboard` | `Dashboard` | Streamer dashboard |

---

## 2. Component Inventory

### 2.1 Entry Point: `main.jsx`

**Purpose**: Application root with routing logic

**State**:
- `view` (string): Current view name

**Hooks**:
- `useState`: Track current view
- `useEffect`: Listen for `hashchange` events

**Routing Logic**:
```javascript
function getViewFromHash() {
  const hash = window.location.hash;
  if (hash === '#dashboard') return 'dashboard';
  if (hash === '#streamer-setup') return 'streamer-setup';
  if (hash === '#viewer-setup') return 'viewer-setup';
  if (hash === '#auth' || hash === '#signup' || hash === '#login') return 'auth';
  return 'landing';
}
```

---

### 2.2 LandingPage.jsx

**Purpose**: Marketing landing page with product showcase

#### Components

| Component | Props | Description |
|-----------|-------|-------------|
| `FeatureCard` | `icon`, `title`, `description` | Feature showcase card |
| `Step` | `number`, `title`, `description` | How-it-works step |
| `LandingPage` | none | Main page component |

#### LandingPage State
| State | Type | Purpose |
|-------|------|---------|
| `scrolled` | boolean | Track scroll position for nav styling |

#### Hooks Used
- `useState`: Scroll state
- `useEffect`: Scroll event listener

#### Sections
1. **Navigation** - Fixed header with logo, nav links, auth buttons
2. **Hero** - Main headline, CTA buttons, social proof
3. **Dashboard Preview** - Interactive mockup of the dashboard
4. **Features** - 3 feature cards (Queue Management, Discord Integration, Security)
5. **How it Works** - 3-step process explanation
6. **Footer** - Logo, copyright, contact email

#### Navigation Links
| Link | Target | Action |
|------|--------|--------|
| Features | `#features` | Scroll to section |
| How it Works | `#how-it-works` | Scroll to section |
| Pricing | `#pricing` | Scroll to section (not implemented) |
| Log in | `#auth` | Navigate to auth |
| Start Free | `#auth` | Navigate to auth |
| Get Started | `#auth` | Navigate to auth |
| View Demo | `#dashboard` | Navigate to dashboard |

---

### 2.3 Auth.jsx

**Purpose**: User authentication and role selection

#### Components

| Component | Props | Description |
|-----------|-------|-------------|
| `AuthTabs` | `activeTab`, `onTabChange` | Toggle between signup/login |
| `Input` | `icon`, `type`, `placeholder`, `value`, `onChange`, `error` | Form input with icon |
| `Divider` | `text` | Horizontal divider with text |
| `RoleCard` | `role`, `icon`, `title`, `description`, `selected`, `onClick` | Role selection card |
| `SignUpForm` | `onSuccess` | Email/password signup form |
| `LogInForm` | `onSuccess` | Email/password login form |
| `TwitchAuthButton` | `onSuccess`, `label` | Twitch OAuth button |
| `RoleSelection` | `onSelect` | Role selection step |
| `Auth` | none | Main auth component |

#### Auth State
| State | Type | Purpose |
|-------|------|---------|
| `step` | `'auth'` \| `'role'` | Current auth step |
| `activeTab` | `'signup'` \| `'login'` | Active form tab |

#### SignUpForm State
| State | Type | Purpose |
|-------|------|---------|
| `username` | string | Username input |
| `email` | string | Email input |
| `password` | string | Password input |
| `loading` | boolean | Submit loading state |
| `errors` | object | Field validation errors |

#### LogInForm State
| State | Type | Purpose |
|-------|------|---------|
| `email` | string | Email input |
| `password` | string | Password input |
| `loading` | boolean | Submit loading state |
| `error` | string | General error message |

#### Input Component State
| State | Type | Purpose |
|-------|------|---------|
| `showPassword` | boolean | Toggle password visibility |

#### RoleSelection State
| State | Type | Purpose |
|-------|------|---------|
| `selectedRole` | `'streamer'` \| `'viewer'` \| `null` | Selected role |

#### Form Validation (SignUpForm)
```javascript
// Username: Required, non-empty
if (!username.trim()) newErrors.username = 'Username is required';

// Email: Required, valid format
if (!email.trim()) newErrors.email = 'Email is required';
else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';

// Password: Required, min 8 characters
if (!password) newErrors.password = 'Password is required';
else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
```

---

### 2.4 StreamerSetup.jsx

**Purpose**: 4-step streamer onboarding wizard

#### Components

| Component | Props | Description |
|-----------|-------|-------------|
| `StepIndicator` | `steps`, `currentStep` | Progress indicator |
| `StepCard` | `children`, `title`, `description` | Step container |
| `TwitchStep` | `onComplete` | Step 1: Connect Twitch |
| `DiscordStep` | `onComplete`, `onBack` | Step 2: Configure Discord |
| `BotStep` | `onComplete`, `onBack` | Step 3: Add bot |
| `ReadyStep` | none | Step 4: Completion |
| `StreamerSetup` | none | Main component |

#### Steps Configuration
```javascript
const STEPS = [
  { id: 'twitch', title: 'Connect Twitch', icon: Twitch },
  { id: 'discord', title: 'Configure Discord', icon: MessageSquare },
  { id: 'bot', title: 'Add Bot', icon: Bot },
  { id: 'ready', title: 'Ready to Go', icon: Zap },
];
```

#### StreamerSetup State
| State | Type | Purpose |
|-------|------|---------|
| `currentStep` | string | Current step ID |

#### TwitchStep State
| State | Type | Purpose |
|-------|------|---------|
| `loading` | boolean | OAuth loading state |
| `connected` | boolean | Connection status |

#### DiscordStep State
| State | Type | Purpose |
|-------|------|---------|
| `serverId` | string | Discord server ID input |
| `serverName` | string | Server name (optional) |
| `loading` | boolean | Save loading state |
| `saved` | boolean | Save success state |
| `error` | string | Validation error |

#### DiscordStep Validation
```javascript
// Server ID: Required, 17-19 digit number
if (!serverId.trim()) {
  setError('Please enter your Discord Server ID');
  return;
}
if (!/^\d{17,19}$/.test(serverId.trim())) {
  setError('Invalid Server ID format. It should be a 17-19 digit number.');
  return;
}
```

#### BotStep State
| State | Type | Purpose |
|-------|------|---------|
| `botAdded` | boolean | Bot detection status |
| `checking` | boolean | Check loading state |

---

### 2.5 ViewerSetup.jsx

**Purpose**: Viewer account linking (Twitch + Discord)

#### Components

| Component | Props | Description |
|-----------|-------|-------------|
| `ConnectionCard` | `platform`, `connected`, `username`, `onConnect`, `onDisconnect`, `loading` | Platform connection card |
| `StatusBanner` | `twitchConnected`, `discordConnected` | Connection status banner |
| `ReadyState` | none | Completion state with instructions |
| `ViewerSetup` | none | Main component |

#### ViewerSetup State
| State | Type | Purpose |
|-------|------|---------|
| `twitchConnected` | boolean | Twitch connection status |
| `discordConnected` | boolean | Discord connection status |
| `twitchLoading` | boolean | Twitch OAuth loading |
| `discordLoading` | boolean | Discord OAuth loading |
| `twitchUsername` | string | Connected Twitch username |
| `discordUsername` | string | Connected Discord username |

#### ConnectionCard Platform Config
```javascript
const config = {
  twitch: {
    name: 'Twitch',
    icon: Twitch,
    color: '#9146FF',
    bgColor: 'bg-[#9146FF]/20',
    hoverColor: 'hover:bg-[#9146FF]/30',
    borderColor: 'border-[#9146FF]/50',
    textColor: 'text-[#9146FF]',
  },
  discord: {
    name: 'Discord',
    icon: MessageSquare,
    color: '#5865F2',
    bgColor: 'bg-[#5865F2]/20',
    hoverColor: 'hover:bg-[#5865F2]/30',
    borderColor: 'border-[#5865F2]/50',
    textColor: 'text-[#5865F2]',
  },
};
```

---

### 2.6 Dashboard.jsx

**Purpose**: Main streamer dashboard for queue management

#### Components

| Component | Props | Description |
|-----------|-------|-------------|
| `Badge` | `type` | SUB/VIP badge |
| `StatusPill` | `active` | Queue active/inactive indicator |
| `ConnectionStatus` | `status` | Voice connection status |
| `QueueViewerRow` | `viewer`, `position` | Queue list item |
| `SessionParticipantRow` | `participant`, `onResendInvite`, `onKick` | Session participant row |
| `EmptyQueueState` | none | Empty queue placeholder |
| `ConfirmModal` | `isOpen`, `onClose`, `onConfirm`, `title`, `description`, `confirmText`, `variant` | Confirmation dialog |
| `Dashboard` | none | Main component |

#### Dashboard State
| State | Type | Default | Purpose |
|-------|------|---------|---------|
| `queueActive` | boolean | `true` | Queue on/off status |
| `partySize` | number | `4` | Number of viewers to pull |
| `selectionMode` | `'queue'` \| `'random'` | `'random'` | Selection algorithm |
| `queueViewers` | array | mock data | Viewers in queue |
| `sessionActive` | boolean | `true` | Active session status |
| `sessionParticipants` | array | mock data | Current session participants |
| `showClearConfirm` | boolean | `false` | Clear queue modal visibility |
| `showEndSessionConfirm` | boolean | `false` | End session modal visibility |
| `inviteCopied` | boolean | `false` | Copy feedback state |

#### Mock Data Structures

**Queue Viewer**:
```javascript
{
  id: number,
  username: string,
  badges: string[], // ['SUB', 'VIP']
  joinedAt: Date
}
```

**Session Participant**:
```javascript
{
  id: number,
  username: string,
  discordLinked: boolean,
  inVoice: boolean,
  discordUsername: string | null // e.g., 'User#1234'
}
```

#### Badge Types
| Type | Style | Icon |
|------|-------|------|
| `SUB` | Purple (Twitch) | Star |
| `VIP` | Amber | Crown |

#### Connection Status Types
| Status | Icon | Text | Color |
|--------|------|------|-------|
| `connected` | CheckCircle2 | "In Voice" | Emerald |
| `waiting` | Clock | "Waiting to Join" | Amber |
| `noDiscord` | XCircle | "No Discord Linked" | Red |

---

## 3. User Flows

### 3.1 New Streamer Flow

```
Landing Page
    │
    ├─► "Get Started" / "Start Free"
    │
    ▼
Auth Page (#auth)
    │
    ├─► Sign Up with Twitch (OAuth)
    │   OR
    ├─► Sign Up with Email/Password
    │
    ▼
Role Selection
    │
    ├─► Select "I'm a Streamer"
    │
    ▼
Streamer Setup (#streamer-setup)
    │
    ├─► Step 1: Connect Twitch (OAuth)
    │
    ├─► Step 2: Configure Discord Server
    │   - Enter Server ID (17-19 digits)
    │   - Optional: Enter Server Name
    │
    ├─► Step 3: Add ViewerQ Bot
    │   - Click "Add Bot to Discord" (external link)
    │   - Click "I've Added the Bot" to verify
    │
    ├─► Step 4: Ready!
    │   - View setup checklist
    │   - Click "Go to Dashboard"
    │
    ▼
Dashboard (#dashboard)
```

### 3.2 New Viewer Flow

```
Landing Page
    │
    ├─► "Get Started" / "Start Free"
    │
    ▼
Auth Page (#auth)
    │
    ├─► Sign Up with Twitch (OAuth)
    │   OR
    ├─► Sign Up with Email/Password
    │
    ▼
Role Selection
    │
    ├─► Select "I'm a Viewer"
    │
    ▼
Viewer Setup (#viewer-setup)
    │
    ├─► Connect Twitch (OAuth)
    │
    ├─► Connect Discord (OAuth)
    │
    ▼
Ready State
    │
    ├─► Instructions displayed:
    │   1. Find a stream using ViewerQ
    │   2. Type !join in chat
    │   3. Get Discord invite when selected
    │
    ├─► "Back to Home"
    │
    ▼
Landing Page
```

### 3.3 Returning User Login Flow

```
Landing Page
    │
    ├─► "Log in"
    │
    ▼
Auth Page (#auth)
    │
    ├─► Log In with Twitch (OAuth)
    │   OR
    ├─► Log In with Email/Password
    │
    ▼
Role Selection (if first login after signup)
    │   OR
    ▼
Dashboard (if streamer)
    │   OR
    ▼
Landing Page (if viewer)
```

### 3.4 Queue Management Flow (Streamer)

```
Dashboard
    │
    ├─► Queue Control
    │   ├─► Start Queue (if inactive)
    │   └─► Stop Queue (if active)
    │
    ├─► Pull Settings
    │   ├─► Set Party Size (2-6)
    │   └─► Set Selection Mode (First in Queue / Random)
    │
    ├─► Pull Viewers
    │   └─► Triggers Discord voice channel creation
    │
    ├─► Queue List
    │   ├─► View queued viewers
    │   ├─► Remove individual viewer (hover X)
    │   └─► Clear entire queue (confirm modal)
    │
    └─► Current Session
        ├─► View participants and voice status
        ├─► Copy Discord invite link
        ├─► Open Discord (external)
        ├─► Resend invite to participant
        ├─► Kick participant
        └─► End session (confirm modal)
```

### 3.5 Viewer Join Flow (External - Twitch Chat)

```
Twitch Chat
    │
    ├─► Viewer types "!join"
    │
    ▼
ViewerQ Bot
    │
    ├─► Validates viewer has linked accounts
    │
    ├─► Adds to queue
    │
    ▼
Streamer Dashboard
    │
    ├─► Viewer appears in queue list
    │
    ├─► Streamer clicks "Pull X Viewers"
    │
    ▼
Discord
    │
    ├─► Voice channel created
    │
    ├─► Selected viewers receive DM invite
    │
    ▼
Dashboard Session
    │
    └─► Shows participant status (waiting/connected)
```

---

## 4. Integration Points

### 4.1 Authentication

#### 4.1.1 Twitch OAuth
**Trigger**: "Sign up/Log in with Twitch" button

**Current Behavior**: Simulated with 1.5s timeout

**Required Backend**:
```
POST /api/auth/twitch/callback
  - Exchange OAuth code for tokens
  - Create/update user record
  - Return JWT session token

GET /api/auth/twitch
  - Redirect to Twitch OAuth URL
  - Scopes needed: user:read:email, channel:read:subscriptions
```

**Data Returned**:
- User ID
- Twitch username
- Twitch user ID
- Email (if permitted)
- Profile image URL

#### 4.1.2 Email/Password Auth
**SignUp Form Data**:
```javascript
{
  username: string,  // Required, non-empty
  email: string,     // Required, valid email format
  password: string   // Required, min 8 characters
}
```

**Required Backend**:
```
POST /api/auth/signup
  Body: { username, email, password }
  Response: { user, token }

POST /api/auth/login
  Body: { email, password }
  Response: { user, token }

POST /api/auth/forgot-password
  Body: { email }
  Response: { success }
```

#### 4.1.3 Discord OAuth (Viewer Setup)
**Trigger**: "Connect Discord" button in ViewerSetup

**Current Behavior**: Simulated with 1.5s timeout

**Required Backend**:
```
GET /api/auth/discord
  - Redirect to Discord OAuth URL
  - Scopes needed: identify, guilds

POST /api/auth/discord/callback
  - Exchange code for tokens
  - Link Discord to user account
  - Return Discord username
```

**Data Returned**:
- Discord user ID
- Discord username (with discriminator)
- Avatar URL

### 4.2 Forms & Data Collection

#### 4.2.1 Discord Server Configuration (StreamerSetup)
**Form Data**:
```javascript
{
  serverId: string,    // Required, 17-19 digit Discord server ID
  serverName: string   // Optional, display name
}
```

**Validation**:
- Server ID must be 17-19 digits
- Server ID must be a valid Discord guild

**Required Backend**:
```
POST /api/streamer/discord-server
  Body: { serverId, serverName }
  Actions:
    - Validate server ID exists
    - Check if bot is in server
    - Store server configuration
  Response: { success, serverInfo }
```

#### 4.2.2 Bot Verification (StreamerSetup)
**Trigger**: "I've Added the Bot" button

**Required Backend**:
```
POST /api/streamer/verify-bot
  Body: { serverId }
  Actions:
    - Check if ViewerQ bot is in the specified server
    - Verify bot has required permissions
  Response: { botPresent: boolean, permissions: object }
```

### 4.3 Dashboard Data Requirements

#### 4.3.1 Queue Data
**Polling/WebSocket Endpoint**:
```
GET /api/queue
  Response: {
    active: boolean,
    viewers: [
      {
        id: string,
        username: string,
        twitchId: string,
        badges: ['SUB', 'VIP'],
        joinedAt: ISO8601
      }
    ]
  }

WebSocket: ws://api/queue/live
  Events:
    - viewer_joined: { viewer }
    - viewer_left: { viewerId }
    - queue_cleared: {}
```

#### 4.3.2 Queue Actions
```
POST /api/queue/start
  Response: { success }

POST /api/queue/stop
  Response: { success }

POST /api/queue/clear
  Response: { success }

DELETE /api/queue/viewer/:id
  Response: { success }
```

#### 4.3.3 Pull Viewers
**Trigger**: "Pull X Viewers" button

**Request**:
```
POST /api/session/pull
  Body: {
    count: number,        // 2-6
    mode: 'queue' | 'random'
  }
  Actions:
    - Select viewers based on mode
    - Create Discord voice channel
    - Send Discord DM invites
    - Move viewers from queue to session
  Response: {
    sessionId: string,
    channelId: string,
    inviteUrl: string,
    participants: [...]
  }
```

#### 4.3.4 Session Management
```
GET /api/session/current
  Response: {
    active: boolean,
    channelId: string,
    inviteUrl: string,
    participants: [
      {
        id: string,
        username: string,
        discordId: string,
        discordUsername: string,
        inVoice: boolean
      }
    ]
  }

POST /api/session/:id/resend-invite/:participantId
  Response: { success }

DELETE /api/session/:id/participant/:participantId
  Actions:
    - Remove from voice channel
    - Update session
  Response: { success }

DELETE /api/session/:id
  Actions:
    - Delete voice channel
    - Clear session
  Response: { success }
```

### 4.4 Real-time Features

#### 4.4.1 Queue Updates
**Requirement**: Live queue updates without page refresh

**Options**:
1. **WebSocket** (Recommended)
   - Connection: `ws://api/queue/live`
   - Events: `viewer_joined`, `viewer_left`, `queue_cleared`

2. **Server-Sent Events**
   - Endpoint: `GET /api/queue/stream`

3. **Polling** (Fallback)
   - Endpoint: `GET /api/queue`
   - Interval: 5 seconds

#### 4.4.2 Session Voice Status
**Requirement**: Real-time voice channel status

**Implementation**:
- Discord bot monitors voice channel
- Updates sent via WebSocket
- Events: `participant_joined_voice`, `participant_left_voice`

### 4.5 Twitch Chat Integration

#### 4.5.1 Bot Commands
| Command | Action | Response |
|---------|--------|----------|
| `!join` | Add viewer to queue | "You've joined the queue! Position: X" |
| `!leave` | Remove from queue | "You've left the queue" |
| `!position` | Check queue position | "You're #X in queue" |

**Required Backend**:
- Twitch IRC bot connection
- Command parser
- Queue management integration

### 4.6 Discord Bot Integration

#### 4.6.1 Required Bot Permissions
- Create Channels
- Manage Channels
- Move Members
- Send Messages
- Create Instant Invite

#### 4.6.2 Bot Actions
| Action | Trigger | Implementation |
|--------|---------|----------------|
| Create voice channel | Pull viewers | Discord API: Create channel in category |
| Send invite DM | Pull viewers | Discord API: DM each selected viewer |
| Delete channel | End session | Discord API: Delete channel |
| Move user | Kick from session | Discord API: Disconnect user |

---

## 5. Design System

### 5.1 Color Palette

#### Brand Colors
| Name | Hex | Usage |
|------|-----|-------|
| Primary (Cyan) | `#06B6D4` | Primary CTAs, accents, logo |
| Primary Hover | `#0891B2` | Primary button hover |
| Twitch Purple | `#9146FF` | Twitch-related elements, SUB badges |
| Discord Blurple | `#5865F2` | Discord-related elements |

#### Neutral Colors
| Name | Hex | Tailwind | Usage |
|------|-----|----------|-------|
| Background | `#09090b` | zinc-950 | Page background |
| Surface | `#18181b` | zinc-900 | Cards, modals |
| Surface Highlight | `#27272a` | zinc-800 | Hover states, borders |
| Border | `#27272a` | zinc-800 | Borders |
| Text Main | `#fafafa` | zinc-50 | Primary text |
| Text Muted | `#a1a1aa` | zinc-400 | Secondary text |
| Text Subtle | `#71717a` | zinc-500 | Tertiary text |

#### Semantic Colors
| Name | Hex | Usage |
|------|-----|-------|
| Success | `#22c55e` (emerald-500) | Success states, connected |
| Warning | `#f59e0b` (amber-500) | Warnings, waiting states |
| Error | `#ef4444` (red-500) | Errors, destructive actions |

### 5.2 Typography

#### Font Families
```css
font-sans: 'Inter', sans-serif     /* Body text */
font-display: 'Outfit', sans-serif  /* Headings, logo */
```

#### Font Sizes (Tailwind)
| Class | Size | Usage |
|-------|------|-------|
| `text-xs` | 12px | Badges, timestamps |
| `text-sm` | 14px | Secondary text, labels |
| `text-base` | 16px | Body text |
| `text-lg` | 18px | Card titles |
| `text-xl` | 20px | Section headings |
| `text-2xl` | 24px | Page titles |
| `text-3xl` | 30px | Hero subheadings |
| `text-5xl` | 48px | Hero headings (mobile) |
| `text-7xl` | 72px | Hero headings (desktop) |

### 5.3 Spacing System

Uses Tailwind's default spacing scale (4px base):
- `gap-1` = 4px
- `gap-2` = 8px
- `gap-3` = 12px
- `gap-4` = 16px
- `gap-6` = 24px
- `gap-8` = 32px

Common patterns:
- Card padding: `p-6` (24px)
- Section padding: `py-32` (128px)
- Container max-width: `max-w-7xl` (80rem)

### 5.4 Border Radius
| Class | Radius | Usage |
|-------|--------|-------|
| `rounded` | 4px | Small elements |
| `rounded-lg` | 8px | Buttons, inputs |
| `rounded-xl` | 12px | Cards, modals |
| `rounded-2xl` | 16px | Large cards |
| `rounded-full` | 9999px | Pills, avatars |

### 5.5 Shadows & Effects

#### Background Glows
```css
/* Ambient glow */
bg-[#06B6D4]/10 rounded-full blur-[120px]

/* Button glow on hover */
hover:shadow-[0_0_20px_-5px_rgba(6,182,212,0.4)]
```

#### Backdrop Blur
```css
backdrop-blur-md  /* Navigation, modals */
backdrop-blur-sm  /* Cards */
```

### 5.6 Button Styles

#### Primary Button (Solid)
```css
bg-[#06B6D4] hover:bg-[#0891B2] text-white rounded-xl font-semibold
```

#### Primary Button (Subtle)
```css
bg-[#06B6D4]/25 text-[#06B6D4] border border-[#06B6D4]/50 
hover:bg-[#06B6D4]/35 hover:border-[#06B6D4]/70
```

#### Secondary Button
```css
bg-[#27272a] text-zinc-300 hover:bg-[#3f3f46] rounded-xl
```

#### Twitch Button
```css
bg-[#9146FF] hover:bg-[#7c3aed] text-white rounded-xl
```

#### Discord Button
```css
bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl
```

#### Danger Button
```css
bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30
```

#### Toggle Button (Selected)
```css
bg-white/10 text-white border-white/50
```

#### Toggle Button (Unselected)
```css
bg-[#27272a]/50 text-zinc-400 border-transparent hover:bg-[#27272a]
```

### 5.7 Card Styles

#### Standard Card
```css
p-6 rounded-2xl bg-[#18181b]/50 border border-[#27272a]
```

#### Interactive Card (Hover)
```css
hover:border-[#3f3f46] hover:bg-[#18181b] transition-all
```

#### Selected Card
```css
bg-[#06B6D4]/10 border-[#06B6D4]/50 ring-2 ring-[#06B6D4]/30
```

### 5.8 Input Styles

```css
w-full px-4 py-3 rounded-xl 
bg-[#27272a]/50 border border-[#3f3f46] 
text-white placeholder-zinc-500 
focus:outline-none focus:ring-2 focus:ring-[#06B6D4]
```

### 5.9 Badge Styles

#### SUB Badge
```css
bg-[#9146FF]/20 text-[#9146FF] border-[#9146FF]/30
```

#### VIP Badge
```css
bg-amber-500/20 text-amber-400 border-amber-500/30
```

### 5.10 Status Indicators

#### Active Status Pill
```css
bg-emerald-500/10 text-emerald-400 border-emerald-500/30
/* With pulsing dot */
<span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
```

#### Inactive Status Pill
```css
bg-zinc-800/50 text-zinc-500 border-zinc-700/50
```

### 5.11 Responsive Breakpoints

Uses Tailwind defaults:
| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| `sm` | 640px | Small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

Common patterns:
```css
/* Mobile-first responsive */
flex-col sm:flex-row
text-5xl md:text-7xl
grid-cols-1 lg:grid-cols-12
hidden md:flex
```

---

## 6. State Management Requirements

### 6.1 Global State (Recommended: Context or Zustand)

#### User State
```typescript
interface UserState {
  isAuthenticated: boolean;
  user: {
    id: string;
    username: string;
    email: string;
    role: 'streamer' | 'viewer';
    twitchId: string;
    twitchUsername: string;
    discordId?: string;
    discordUsername?: string;
    avatarUrl?: string;
  } | null;
  token: string | null;
}
```

#### Streamer Config State
```typescript
interface StreamerConfigState {
  discordServerId: string;
  discordServerName: string;
  botConnected: boolean;
  twitchConnected: boolean;
  setupComplete: boolean;
}
```

### 6.2 Dashboard State (Local)

```typescript
interface DashboardState {
  // Queue
  queueActive: boolean;
  queueViewers: QueueViewer[];
  
  // Pull Settings
  partySize: number; // 2-6
  selectionMode: 'queue' | 'random';
  
  // Session
  sessionActive: boolean;
  sessionParticipants: SessionParticipant[];
  inviteUrl: string;
  
  // UI
  showClearConfirm: boolean;
  showEndSessionConfirm: boolean;
  inviteCopied: boolean;
}
```

### 6.3 Data Fetching Patterns

#### Initial Load
```javascript
// On Dashboard mount
useEffect(() => {
  fetchQueueStatus();
  fetchCurrentSession();
  connectWebSocket();
  
  return () => disconnectWebSocket();
}, []);
```

#### Real-time Updates
```javascript
// WebSocket message handler
socket.on('viewer_joined', (viewer) => {
  setQueueViewers(prev => [...prev, viewer]);
});

socket.on('viewer_left', ({ viewerId }) => {
  setQueueViewers(prev => prev.filter(v => v.id !== viewerId));
});

socket.on('participant_voice_update', ({ participantId, inVoice }) => {
  setSessionParticipants(prev => 
    prev.map(p => p.id === participantId ? { ...p, inVoice } : p)
  );
});
```

### 6.4 Cache Requirements

| Data | Cache Strategy | TTL |
|------|----------------|-----|
| User profile | Persist in localStorage | Until logout |
| Streamer config | Persist in localStorage | Until changed |
| Queue data | Real-time, no cache | N/A |
| Session data | Real-time, no cache | N/A |

---

## 7. Expected Functionality

### 7.1 Authentication

#### Sign Up (Email)
| Action | Frontend | Backend | Database |
|--------|----------|---------|----------|
| Submit form | Validate fields, show loading | Hash password, create user | INSERT users |
| Success | Navigate to role selection | Return JWT | - |
| Error (email exists) | Show error message | Return 409 | - |
| Error (validation) | Show field errors | Return 400 | - |

#### Sign Up (Twitch OAuth)
| Action | Frontend | Backend | Database |
|--------|----------|---------|----------|
| Click button | Redirect to Twitch | Generate OAuth URL | - |
| OAuth callback | Handle redirect | Exchange code, get user info | UPSERT users |
| Success | Navigate to role selection | Return JWT | - |
| Error | Show error message | Return error | - |

#### Login
| Action | Frontend | Backend | Database |
|--------|----------|---------|----------|
| Submit form | Validate, show loading | Verify credentials | SELECT users |
| Success | Navigate to dashboard/home | Return JWT | - |
| Error (invalid) | Show error message | Return 401 | - |

### 7.2 Streamer Setup

#### Connect Twitch
| Action | Frontend | Backend | Database |
|--------|----------|---------|----------|
| Click connect | Redirect to Twitch OAuth | Generate OAuth URL | - |
| OAuth callback | Show success, enable continue | Store tokens | UPDATE users |

#### Configure Discord
| Action | Frontend | Backend | Database |
|--------|----------|---------|----------|
| Enter server ID | Validate format | Validate server exists | - |
| Save | Show loading | Store config | INSERT streamer_config |
| Success | Show success, enable continue | - | - |
| Error | Show error message | Return error | - |

#### Add Bot
| Action | Frontend | Backend | Database |
|--------|----------|---------|----------|
| Click "Add Bot" | Open Discord OAuth in new tab | - | - |
| Click "I've Added" | Show checking | Check bot in server | - |
| Bot found | Show success, enable continue | Return success | UPDATE streamer_config |
| Bot not found | Show error | Return error | - |

### 7.3 Queue Management

#### Start/Stop Queue
| Action | Frontend | Backend | Database |
|--------|----------|---------|----------|
| Toggle queue | Update UI immediately | Update queue status | UPDATE queues |
| Broadcast | - | Notify Twitch bot | - |

#### Pull Viewers
| Action | Frontend | Backend | Database |
|--------|----------|---------|----------|
| Click pull | Show loading | Select viewers | SELECT from queue |
| Create channel | - | Discord API: create channel | INSERT sessions |
| Send invites | - | Discord API: DM users | - |
| Success | Show session card | Return session data | UPDATE queue (remove pulled) |
| Error | Show error toast | Return error | - |

#### Clear Queue
| Action | Frontend | Backend | Database |
|--------|----------|---------|----------|
| Confirm clear | Close modal, clear list | Delete all queue entries | DELETE from queue |

### 7.4 Session Management

#### End Session
| Action | Frontend | Backend | Database |
|--------|----------|---------|----------|
| Confirm end | Close modal, hide session | Delete Discord channel | UPDATE sessions |
| Disconnect users | - | Discord API: disconnect | - |

#### Kick Participant
| Action | Frontend | Backend | Database |
|--------|----------|---------|----------|
| Click kick | Remove from list | Discord API: disconnect | DELETE from session_participants |

#### Resend Invite
| Action | Frontend | Backend | Database |
|--------|----------|---------|----------|
| Click resend | Show feedback | Discord API: DM user | - |

### 7.5 Viewer Flow

#### Join Queue (Twitch Chat)
| Action | Frontend | Backend | Database |
|--------|----------|---------|----------|
| Type !join | - | Validate user linked | SELECT users |
| Add to queue | - | Add to queue | INSERT queue |
| Respond | - | Send chat message | - |

#### Receive Invite
| Action | Frontend | Backend | Database |
|--------|----------|---------|----------|
| Get selected | - | Send Discord DM | - |
| Join voice | - | Detect via Discord | UPDATE session_participants |

---

## 8. Database Schema Recommendations

### 8.1 Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  role ENUM('streamer', 'viewer') NOT NULL,
  twitch_id VARCHAR(50) UNIQUE,
  twitch_username VARCHAR(50),
  twitch_access_token TEXT,
  twitch_refresh_token TEXT,
  discord_id VARCHAR(50) UNIQUE,
  discord_username VARCHAR(50),
  discord_access_token TEXT,
  discord_refresh_token TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 8.2 Streamer Config Table
```sql
CREATE TABLE streamer_configs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  discord_server_id VARCHAR(50) NOT NULL,
  discord_server_name VARCHAR(100),
  bot_connected BOOLEAN DEFAULT FALSE,
  setup_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 8.3 Queues Table
```sql
CREATE TABLE queues (
  id UUID PRIMARY KEY,
  streamer_id UUID REFERENCES users(id),
  active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 8.4 Queue Entries Table
```sql
CREATE TABLE queue_entries (
  id UUID PRIMARY KEY,
  queue_id UUID REFERENCES queues(id),
  viewer_id UUID REFERENCES users(id),
  position INTEGER,
  badges JSONB, -- ['SUB', 'VIP']
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(queue_id, viewer_id)
);
```

### 8.5 Sessions Table
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  streamer_id UUID REFERENCES users(id),
  discord_channel_id VARCHAR(50),
  invite_url TEXT,
  active BOOLEAN DEFAULT TRUE,
  selection_mode ENUM('queue', 'random'),
  party_size INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP
);
```

### 8.6 Session Participants Table
```sql
CREATE TABLE session_participants (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES sessions(id),
  viewer_id UUID REFERENCES users(id),
  in_voice BOOLEAN DEFAULT FALSE,
  invited_at TIMESTAMP DEFAULT NOW(),
  joined_voice_at TIMESTAMP,
  left_voice_at TIMESTAMP
);
```

---

## Appendix A: Animation Specifications

### Framer Motion Variants Used

#### Fade In Up
```javascript
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5 }}
```

#### Fade Out Up
```javascript
exit={{ opacity: 0, y: -20 }}
```

#### Scale In (Spring)
```javascript
initial={{ scale: 0 }}
animate={{ scale: 1 }}
transition={{ type: 'spring', duration: 0.5 }}
```

#### Staggered List
```javascript
// Parent
<AnimatePresence>
  {items.map((item, index) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ delay: index * 0.1 }}
    />
  ))}
</AnimatePresence>
```

---

## Appendix B: Icon Usage Reference

All icons from `lucide-react`:

| Icon | Usage |
|------|-------|
| `Gamepad2` | Logo, branding |
| `Twitch` | Twitch-related elements |
| `MessageSquare` | Discord-related elements |
| `Users` | Queue, viewers |
| `Play` / `Square` | Start/Stop queue |
| `Shuffle` / `ListOrdered` | Selection modes |
| `Settings` | Settings link |
| `ArrowRight` / `ArrowLeft` | Navigation |
| `CheckCircle2` | Success states |
| `AlertCircle` | Warnings |
| `XCircle` / `X` | Errors, close |
| `Loader2` | Loading spinners |
| `Copy` | Copy to clipboard |
| `ExternalLink` | External links |
| `RefreshCw` | Resend/refresh |
| `UserX` | Kick user |
| `Mic` / `MicOff` | Voice status |
| `Volume2` | Voice channel |
| `Clock` | Time/waiting |
| `Star` | SUB badge |
| `Crown` | VIP badge |
| `Bot` | Discord bot |
| `Link2` / `Unlink` | Connection status |
| `PartyPopper` | Celebration |
| `Zap` | Ready state |
| `Radio` | Streamer role |
| `Eye` / `EyeOff` | Password visibility |
| `Mail` / `Lock` / `User` | Form inputs |

---

*Document generated for ViewerQ frontend prototype migration.*
*Last updated: December 2024*
