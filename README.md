# ExpenseTrackerINR

Modern, mobile-first expense tracker optimized for Android devices. Track income and expenses in Indian Rupees with real-time analytics and offline support.

## ✨ Features

- 📱 **Progressive Web App** - Install on your device, works offline
- 💰 **Income & Expense Tracking** - Track both credits and debits
- 📊 **Real-time Analytics** - Pie chart breakdown by category
- 🔍 **Smart Filtering** - Search and filter by category
- 📈 **Budget Management** - Set monthly budgets and track spending
- 🎨 **Mobile-First Design** - Optimized for touch and small screens
- 💾 **Dual Data Mode** - Choose between Firebase or localStorage
- 🇮🇳 **INR Currency** - All amounts in Indian Rupees (₹)

## 🚀 Quick Start

1. **Install dependencies:**

```bash
npm install
```

2. **Configure data storage:**

For **localStorage mode** (offline-first, no backend needed):
```bash
# Create .env.local
echo "VITE_USE_LOCAL_STORAGE=true" > .env.local
echo "VITE_APP_ID=ExpenseTrackerINR" >> .env.local
```

For **Firebase mode** (cloud sync):
```bash
# Copy template and add your Firebase credentials
cp .env.example .env.local
# Edit .env.local with your Firebase project settings
```

3. **Run the dev server:**

```bash
npm run dev
```

4. **Build for production:**

```bash
npm run build
npm run preview  # Test production build
```

## 📱 PWA Installation

### On Android:
1. Open the app in Chrome/Edge
2. Tap the three-dot menu → "Install app" or "Add to Home screen"
3. App will install like a native app with its own icon

### On Desktop:
1. Look for the install icon in the address bar
2. Click "Install" when prompted
3. App opens in its own window

### Offline Support:
- Once installed, the app works completely offline in localStorage mode
- All data is cached locally using service workers
- Automatic updates when online

## 📊 Data Models

### localStorage Mode
```typescript
// Stored at key: expense_tracker_data
{
  budget: number,
  income: number,
  transactions: Array<{
    id: string,
    amount: number,
    type: 'income' | 'expense',
    category: 'Fuel' | 'Snacks' | 'Trip' | 'Travel' | 'Food' | 'Shopping' | 'Bills' | 'Entertainment' | 'Others',
    description: string,
    date: string (ISO)
  }>
}
```

### Firebase Mode
- **Path**: `artifacts/{VITE_APP_ID}/users/{firebaseUserId}/expenses_data`
- **Documents**:
  - `summary`: `{ targetBudget: number, totalIncome: number }`
  - `transaction_{timestamp}`: `{ amount: number, type: 'income'|'expense', tag: string, date: ISOString, description?: string }`

Real-time sync with `onSnapshot` for instant updates across devices.

## 🔐 Authentication

### localStorage Mode
No authentication required - data stored locally in browser.

### Firebase Mode
- Custom token auth: Set `window.__initial_auth_token` before app loads
- Fallback: Anonymous Firebase Auth

## 🎨 Categories

**Expense Categories:**
- 🚗 Fuel
- 🍿 Snacks  
- 🗺️ Trip
- ✈️ Travel
- 🍔 Food
- 🛍️ Shopping
- 📄 Bills
- 🎬 Entertainment
- 📦 Others

## 📦 Tech Stack

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 7 (rolldown)
- **Styling:** Tailwind CSS 3
- **Charts:** Recharts
- **Icons:** Lucide React
- **PWA:** vite-plugin-pwa
- **Backend:** Firebase (optional) or localStorage

## 🛠️ Available Scripts

- `npm run dev` – Start dev server with HMR
- `npm run build` – Type-check and build for production
- `npm run preview` – Preview production build locally

## 📝 Notes

- All amounts formatted in INR (₹) using `en-IN` locale
- Mobile-optimized with 44px+ touch targets
- Responsive design: 2-column on mobile, 4-column on desktop
- Category icons with color coding for quick scanning
- Swipe-friendly transaction list with delete controls
