# ExpenseTrackerINR

Modern, mobile-first Progressive Web App for tracking income and expenses in Indian Rupees. Works completely offline with localStorage.

## ✨ Features

- 📱 **Progressive Web App** - Install on your device, works offline
- 💰 **Income & Expense Tracking** - Track both credits and debits
- 📊 **Real-time Analytics** - Pie chart breakdown by category
- 🔍 **Smart Filtering** - Search and filter by category
- 📈 **Budget Management** - Set monthly budgets and track spending
- 📅 **Monthly Dashboard** - Navigate between months with detailed insights
- 📉 **Performance Metrics** - Savings rate, budget usage, daily averages, trends
- 🌓 **Auto Dark Mode** - Follows system preference automatically
- 🎨 **Mobile-First Design** - Optimized for touch and small screens
- 💾 **localStorage** - All data stored locally, no backend needed
- 🇮🇳 **INR Currency** - All amounts in Indian Rupees (₹)

## 🚀 Quick Start

1. **Install dependencies:**

```bash
npm install
```

2. **Run the dev server:**

```bash
npm run dev
```

3. **Build for production:**

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
- App works completely offline - no internet required
- All data cached locally using service workers and localStorage
- Install as PWA for native app experience

## 📊 Data Model

All data is stored in localStorage at key `expense_tracker_data`:

```typescript
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

## 🎨 Categories

**Expense Categories:**
- 🚗 Fuel
- ☕ Snacks  
- 📍 Trip
- ✈️ Travel
- 🍴 Food
- 🛒 Food Ordering
- 🛍️ Shopping
- 📄 Bills
- 🎉 Entertainment
- 📦 Others

## 📦 Tech Stack

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 7 (rolldown)
- **Styling:** Tailwind CSS 3
- **Charts:** Recharts
- **Icons:** Lucide React
- **PWA:** vite-plugin-pwa
- **Storage:** localStorage (browser-based)

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
