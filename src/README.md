# 🛋️ Vision Studio - Furniture E-Commerce Platform

A modern, bilingual (English/Malay) furniture e-commerce platform built with React, TypeScript, and Supabase.

![Vision Studio](https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=400&fit=crop)

## ✨ Features

- 🌐 **Bilingual Support**: Full English and Malay translations
- 🛒 **Complete E-Commerce**: Product catalog, cart, 5-step checkout
- 💳 **Payment Methods**: BIBD Financing, FPX Online Banking, Bank Transfer
- 👤 **User Accounts**: Registration, login, profile management, order history
- 📊 **CRM System**: Lead capture, order management, analytics dashboard
- 📧 **Campaign Management**: Email and in-app popup campaigns
- 💝 **Wishlist/Favorites**: Save products for later
- 📱 **Responsive Design**: Desktop, tablet, and mobile optimized
- 🎨 **Design & Inspiration**: Style cards with product recommendations
- 🤖 **AI Chatbot**: Interactive design consultation
- 🏠 **Room Customization**: Interactive room planning
- 📈 **Analytics**: User journey tracking and conversion funnel

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **Motion (Framer Motion)** - Animations
- **Recharts** - Data visualization
- **Lucide React** - Icons

### Backend
- **Supabase** - Database, Auth, Storage
- **Supabase Edge Functions** - API (Deno/Hono)
- **Key-Value Store** - Data persistence

### Deployment
- **Vercel** - Frontend hosting
- **Supabase** - Backend & database hosting

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Run development server
npm run dev
```

See [QUICK_START.md](./QUICK_START.md) for detailed instructions.

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

See [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) for complete deployment guide.

## 📁 Project Structure

```
vision-studio/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── figma/          # Figma-specific components
│   ├── Header.tsx      # Navigation header
│   ├── Footer.tsx      # Site footer
│   ├── ProductCard.tsx # Product display
│   ├── CheckoutFlow.tsx # Checkout process
│   ├── CRMDashboard.tsx # Admin CRM
│   └── ...
├── contexts/           # React contexts
│   └── LanguageContext.tsx
├── utils/              # Utility functions
│   ├── supabase/       # Supabase client setup
│   ├── database-logger.ts
│   ├── journey-tracker.ts
│   └── crm-helpers.ts
├── supabase/
│   └── functions/      # Supabase Edge Functions (Deno)
│       └── server/     # API server
├── styles/
│   └── globals.css     # Global styles & Tailwind
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.html          # HTML template
```

## 🌍 Environment Variables

Required environment variables for Vercel deployment:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

For Supabase Edge Functions:

```env
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=your-resend-api-key (optional)
```

## 💰 Currency

All prices are in **Brunei Dollars (BND/B$)**.

## 🔐 Authentication

The app includes a complete authentication system:
- User registration
- Login/logout
- Password reset with 6-digit code
- Protected routes
- Session management

## 📊 Admin Features

Access the CRM Dashboard to:
- View and manage leads
- Track orders and fulfillment
- Monitor user analytics
- Create and send campaigns
- View conversion funnels
- Analyze user journeys

**Admin Access**: Password protected (default: contact admin)

## 🗄️ Database

Uses Supabase Postgres with a key-value store table:
- `kv_store_3cbf86a5` - Main data storage
- Organized with prefixes:
  - `user:*` - User accounts
  - `lead:*` - Leads/prospects
  - `order:*` - Orders
  - `journey:*` - Analytics events
  - `campaign:*` - Marketing campaigns

## 📱 Responsive Design

- **Desktop**: Full layout with sidebar navigation
- **Tablet**: Optimized two-column layout
- **Mobile**: Single column with bottom navigation (< 440px)

## 🎨 Design System

Built-in design system with:
- Modern furniture styles (Modern Minimalist, Scandinavian, etc.)
- Consistent color palette
- Typography system
- Reusable components
- Tailwind CSS utilities

## 🧪 Testing

The app includes connection diagnostics:
- Supabase connection status
- Database connectivity
- API endpoint testing
- Analytics verification

## 📈 Analytics & Tracking

Automatic tracking of:
- Page views
- Product views
- Add to cart events
- Checkout progress
- Cart abandonment
- Order completion
- Device types
- Session data

## 🤝 Contributing

This is a proprietary project for Vision Studio.

## 📄 License

All rights reserved. © 2024 Vision Studio

## 🆘 Support

For deployment help:
- [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)
- [QUICK_START.md](./QUICK_START.md)

For backend setup:
- [BACKEND_SETUP.md](./BACKEND_SETUP.md)
- [CRM_SYSTEM_DOCUMENTATION.md](./CRM_SYSTEM_DOCUMENTATION.md)

## 🎉 Credits

Built with ❤️ for Vision Studio Brunei
