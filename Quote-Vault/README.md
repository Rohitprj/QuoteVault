# QuoteVault 📖✨

A beautiful React Native app for discovering, collecting, and sharing inspirational quotes. Built with Expo, Supabase, and TypeScript.

## Features

### ✅ Completed Features

- **🔐 Authentication & User Accounts**
  - Email/password sign up and login
  - Password reset flow
  - User profile management
  - Session persistence

- **📚 Quote Browsing & Discovery**
  - Home feed with paginated quotes
  - Browse by categories (Motivation, Love, Success, Wisdom, Humor)
  - Keyword and author search
  - Pull-to-refresh functionality
  - Infinite scroll loading

- **❤️ Favorites & Collections**
  - Save quotes to favorites
  - Create custom collections
  - Cloud sync across devices
  - Dedicated favorites screen

- **🔔 Daily Quote & Notifications**
  - Deterministic "Quote of the Day" algorithm
  - Local push notifications
  - Customizable notification time
  - In-app "Today" screen widget

- **📤 Sharing & Export**
  - Share quotes as text via system share sheet
  - Generate shareable quote cards (3 templates)
  - Save quote images to device gallery

- **🎨 Personalization & Settings**
  - Dark/Light/Auto themes
  - 5 accent colors (Blue, Purple, Teal, Red, Orange)
  - Adjustable font sizes
  - Settings sync with user profile

- **🏠 Widget Implementation**
  - In-app Today screen (`/today`)
  - Comprehensive native widget documentation
  - iOS WidgetKit and Android App Widget guides

- **🏗️ Code Quality & Architecture**
  - Clean project structure
  - Comprehensive error handling
  - TypeScript throughout
  - Centralized services and utilities

## Tech Stack

- **Frontend**: React Native, Expo, TypeScript
- **Backend**: Supabase (Auth, Database, Storage)
- **UI**: Custom components with theming
- **State Management**: React Context + AsyncStorage
- **Navigation**: Expo Router (file-based routing)

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- Supabase account

### 1. Clone and Install

```bash
git clone <repository-url>
cd QuoteVault
npm install
```

### 2. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to Settings > API and copy your project URL and anon key
3. Create a `.env` file in the root directory:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Schema

Run the SQL in `database/schema.sql` in your Supabase SQL Editor to create all required tables and policies.

### 4. Seed Database

Execute the seed script to populate quotes:

```bash
# In development, you can run this script
node database/seed.ts
```

Or import the quotes manually via Supabase Dashboard.

### 5. Start Development Server

```bash
npx expo start
```

Choose your preferred platform:
- `i` for iOS simulator
- `a` for Android emulator
- `w` for web
- Scan QR code with Expo Go app

## Project Structure

```
QuoteVault/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation
│   ├── sign-in.tsx        # Authentication
│   ├── today.tsx          # Today widget screen
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
│   ├── quote/            # Quote-related components
│   ├── ui/               # Generic UI components
│   └── navigation/       # Navigation components
├── contexts/             # React contexts
│   ├── AuthContext.tsx   # Authentication state
│   └── ThemeContext.tsx  # Theme and settings
├── services/             # API and business logic
│   ├── quoteService.ts   # Quote operations
│   ├── favoritesService.ts # Favorites management
│   ├── collectionsService.ts # Collections management
│   ├── notificationsService.ts # Push notifications
│   └── sharingService.ts # Sharing functionality
├── utils/                # Utilities
│   ├── supabase.ts       # Supabase client
│   └── errorHandler.ts   # Error handling
├── constants/            # App constants
├── database/             # Database schema and seeds
└── assets/               # Images and fonts
```

## Key Implementation Details

### Database Schema

- **quotes**: Stores all quote data with categories
- **user_favorites**: User-specific favorite quotes
- **collections**: User-created quote collections
- **collection_quotes**: Many-to-many relationship for collections
- **profiles**: User settings and preferences

### Authentication Flow

- Supabase Auth with email/password
- Automatic session management
- Profile creation on signup
- Settings sync across devices

### Quote of the Day Algorithm

```typescript
const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
const quoteIndex = dayIndex % totalQuotes;
// Fetches quote at this deterministic index
```

### Sharing System

- Text sharing via React Native Share API
- Image generation using react-native-view-shot
- 3 beautiful templates (Minimal, Elegant, Bold)
- Gallery saving with expo-media-library

### Theming System

- Context-based theme management
- 3 theme modes + 5 accent colors
- Persistent settings with AsyncStorage
- Server sync for logged-in users

## Widget Implementation

Due to Expo managed workflow limitations, native widgets require ejecting to bare workflow. The app includes:

1. **In-app Today Screen** (`/today`) - Mimics widget functionality
2. **Complete Documentation** (`WIDGET_IMPLEMENTATION.md`) with:
   - iOS WidgetKit implementation guide
   - Android App Widget implementation guide
   - API integration examples
   - Sample code for both platforms

## Testing

### Manual Testing Checklist

- [ ] Sign up with new account
- [ ] Login/logout functionality
- [ ] Password reset flow
- [ ] Browse quotes by category
- [ ] Search quotes by keyword/author
- [ ] Add/remove favorites
- [ ] Create/manage collections
- [ ] Share quotes (text and image)
- [ ] Change themes and settings
- [ ] Test notifications (if permissions granted)
- [ ] Test Today screen widget

### Build Testing

```bash
# Test production build
npx expo build:android
npx expo build:ios
```

## Deployment

### EAS Build

1. Install EAS CLI: `npm install -g @expo/eas-cli`
2. Login: `eas login`
3. Configure build: `eas build:configure`
4. Build: `eas build --platform android` or `eas build --platform ios`

### Environment Variables for Production

Ensure these are set in your EAS build environment:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

## Known Limitations

1. **Native Widgets**: Require bare workflow (documented in `WIDGET_IMPLEMENTATION.md`)
2. **Image Sharing**: Requires media library permissions
3. **Notifications**: iOS may require additional setup for production
4. **Offline Mode**: Limited offline functionality

## Contributing

1. Follow the existing code structure
2. Use TypeScript for all new code
3. Add error handling for network operations
4. Test on both iOS and Android
5. Update documentation for new features

## License

This project is for educational/hiring assessment purposes.

---

Built with ❤️ using React Native, Expo, and Supabase
