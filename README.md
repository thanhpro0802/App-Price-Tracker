# Smart Price Tracker

A modern web application for tracking prices of different assets and products in real time — including crypto, currencies, precious metals, and consumer products.

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **TailwindCSS** for styling
- **Chart.js** (via react-chartjs-2) for price charts
- **React Router** for navigation
- **Axios** for API requests
- **Lucide React** for icons
- **Vite** for build tooling

### Backend
- **Node.js** with Express
- **TypeScript**
- **PostgreSQL** (with in-memory fallback for demo mode)
- **node-cron** for scheduled price updates

## Features

### 1. Asset Price Tracking
Track prices across multiple categories:
- **Crypto**: Bitcoin, Ethereum, Solana
- **Currency**: USD/VND, JPY/VND, EUR/VND
- **Precious Metals**: Gold, Silver
- **Products**: iPhone, MacBook, Gaming Laptop

Each asset shows current price, price change %, and last updated time.

### 2. Price Charts
Interactive Chart.js line charts with:
- Time period options: 24H, 7D, 30D, 1Y
- Gradient fill under the line
- Tooltips with price and date
- Period high/low stats

### 3. Watchlist
- Add/remove assets to personal watchlist
- Pin favorite assets to the dashboard
- Sorted view with pinned items first

### 4. Price Alerts
- Set alerts for price above/below a target
- Alerts are checked on each price update
- Triggered alerts generate notifications

### 5. Notifications
- Dashboard notification bell with unread count
- Mark notifications as read
- Dedicated notifications page

### 6. Search
- Search assets by name or symbol
- Category filter (All, Crypto, Currency, Precious Metals, Products)
- Real-time filtering

### 7. Dashboard
- Total tracked assets count
- Biggest gainer and biggest drop of the day
- Price heatmap (color-coded by change %)
- Pinned watchlist summary
- Recent notifications

### 8. Price Update Scheduler
- Backend runs a cron job every 5 minutes
- Simulates price updates with realistic random walk
- Seeds 48 hours of historical data on startup

### 9. Dark Mode
- Toggle between light and dark themes
- Persisted in localStorage

### 10. Mobile Responsive
- Collapsible sidebar navigation
- Responsive grid layouts
- Touch-friendly UI

### 11. Advanced Features
- **Price Prediction**: Simple linear regression for predicted prices
- **Price Heatmap**: Color-coded grid of all assets by change %
- **Price Comparison**: Compare multiple assets on the same chart

## Project Structure

```
├── backend/
│   └── src/
│       ├── config/         # Database & schema
│       ├── controllers/    # Route handlers
│       ├── middleware/      # Error handling, CORS
│       ├── models/         # TypeScript interfaces
│       ├── repositories/   # Data access layer
│       ├── routes/         # Express routes
│       ├── scheduler/      # Cron jobs
│       └── services/       # Business logic
├── frontend/
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── hooks/          # Custom React hooks
│       ├── pages/          # Page components
│       ├── services/       # API client & mock data
│       ├── types/          # TypeScript types
│       └── utils.ts        # Formatting utilities
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL (optional — app runs in demo mode without it)

### Backend Setup
```bash
cd backend
npm install
npm run build
npm start        # Production
# or
npm run dev      # Development with ts-node
```

The backend runs on `http://localhost:5000`.

### Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Development server on http://localhost:3000
# or
npm run build    # Production build
npm run preview  # Preview production build
```

### Environment Variables

Create `backend/.env`:
```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/price_tracker
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000
```

### Database Setup (Optional)

If using PostgreSQL, run the schema:
```bash
psql -d price_tracker -f backend/src/config/schema.sql
```

Without PostgreSQL, the app runs fully in demo mode with in-memory data.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/assets` | List all assets |
| GET | `/api/assets/:id` | Get asset by ID |
| GET | `/api/assets/search?q=` | Search assets |
| GET | `/api/prices/:assetId/latest` | Latest price |
| GET | `/api/prices/:assetId/history?period=` | Price history |
| GET | `/api/prices/:assetId/prediction?period=` | Price prediction |
| GET | `/api/dashboard` | Dashboard stats |
| GET | `/api/watchlist` | User watchlist |
| POST | `/api/watchlist` | Add to watchlist |
| DELETE | `/api/watchlist/:assetId` | Remove from watchlist |
| PATCH | `/api/watchlist/:assetId/pin` | Toggle pin |
| GET | `/api/alerts` | User alerts |
| POST | `/api/alerts` | Create alert |
| DELETE | `/api/alerts/:id` | Delete alert |
| GET | `/api/notifications` | User notifications |
| PATCH | `/api/notifications/:id/read` | Mark notification read |

## License

MIT