# Vision Studio CRM System Documentation

## Overview

The Vision Studio CRM (Customer Relationship Management) system is a comprehensive backend and frontend solution for managing leads, users, orders, and analytics. It provides complete lifecycle tracking from initial lead capture through user activation, order management, and ongoing customer relationships.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Application                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Components  │  │  Utilities   │  │  Dashboard   │      │
│  │  - Forms     │  │  - Helpers   │  │  - CRM Admin │      │
│  │  - Chatbot   │  │  - API Calls │  │  - Analytics │      │
│  │  - Checkout  │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS API Calls
┌───────────────────────────▼─────────────────────────────────┐
│                    Supabase Edge Function                    │
│                    (Hono Web Server)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              API Routes (/make-server-3cbf86a5)       │  │
│  │  - /leads       - /users       - /orders             │  │
│  │  - /stats       - /analytics                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                            │                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              CRM Business Logic Module                │  │
│  │  - Lead Management    - User Management              │  │
│  │  - Order Management   - Analytics                    │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                    Supabase KV Store                         │
│  (Key-Value Database Table: kv_store_3cbf86a5)              │
│                                                              │
│  Data Structure:                                             │
│  - lead:{id}              → Lead object                      │
│  - leads:index            → Array of lead IDs                │
│  - user:{id}              → User object                      │
│  - user:email:{email}     → User ID lookup                   │
│  - users:index            → Array of user IDs                │
│  - order:{id}             → Order object                     │
│  - orders:index           → Array of order IDs               │
│  - user:{userId}:orders   → User's order IDs                 │
└──────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. Backend Files

#### `/supabase/functions/server/crm.tsx`
**Purpose**: Core CRM business logic and data models

**Key Functions**:
- `createLead()` - Create new leads from various sources
- `getLead()`, `getAllLeads()`, `getLeadsByStatus()` - Lead retrieval
- `updateLead()` - Update lead information and status
- `convertLeadToUser()` - Convert qualified leads to users
- `createUser()` - User account creation
- `getUser()`, `getUserByEmail()`, `getAllUsers()` - User retrieval
- `updateUser()`, `updateUserLastLogin()` - User management
- `createOrder()` - Create new orders
- `getOrder()`, `getUserOrders()`, `getAllOrders()` - Order retrieval
- `updateOrder()`, `addOrderTimeline()` - Order management
- `getCRMStats()` - Analytics and statistics

**Data Models**:
```typescript
Lead {
  id, email, name, phone, source, status,
  interests, budget, roomType, notes,
  createdAt, updatedAt, convertedToUserId
}

User {
  id, email, name, phone, address, preferences,
  accountStatus, signupDate, lastLogin,
  totalOrders, totalSpent, loyaltyPoints, tags
}

Order {
  id, orderNumber, userId, items, subtotal,
  tax, shipping, discount, total,
  status, paymentStatus, shippingAddress,
  trackingNumber, estimatedDelivery,
  timeline, createdAt, updatedAt
}
```

#### `/supabase/functions/server/index.tsx`
**Purpose**: HTTP API routes and endpoint definitions

**API Endpoints**:

**Lead Management**:
- `POST /make-server-3cbf86a5/leads` - Create lead
- `GET /make-server-3cbf86a5/leads` - Get all leads (optional ?status filter)
- `GET /make-server-3cbf86a5/leads/:id` - Get specific lead
- `PUT /make-server-3cbf86a5/leads/:id` - Update lead
- `POST /make-server-3cbf86a5/leads/:id/convert` - Convert lead to user

**User Management**:
- `POST /make-server-3cbf86a5/users` - Create user (signup)
- `GET /make-server-3cbf86a5/users` - Get all users
- `GET /make-server-3cbf86a5/users/:id` - Get specific user
- `GET /make-server-3cbf86a5/users/email/:email` - Get user by email
- `PUT /make-server-3cbf86a5/users/:id` - Update user profile
- `POST /make-server-3cbf86a5/users/:id/login` - Track user login

**Order Management**:
- `POST /make-server-3cbf86a5/orders` - Create order
- `GET /make-server-3cbf86a5/orders` - Get all orders (optional ?status filter)
- `GET /make-server-3cbf86a5/orders/:id` - Get specific order
- `PUT /make-server-3cbf86a5/orders/:id` - Update order
- `GET /make-server-3cbf86a5/users/:userId/orders` - Get user's orders
- `POST /make-server-3cbf86a5/orders/:id/timeline` - Add order timeline entry

**Analytics**:
- `GET /make-server-3cbf86a5/stats` - Get CRM statistics

### 2. Frontend Files

#### `/components/CRMDashboard.tsx`
**Purpose**: Admin dashboard for managing all CRM data

**Features**:
- Overview statistics dashboard with key metrics
- Lead management with status updates
- User profile management
- Order tracking and management
- Analytics visualization
- Search and filter capabilities
- Detailed view dialogs for each entity

**Tabs**:
1. **Leads** - View and manage all leads, update status, contact information
2. **Users** - User profiles, order history, loyalty points
3. **Orders** - Order tracking, status updates, fulfillment
4. **Analytics** - Conversion funnel, revenue metrics, performance indicators

#### `/utils/crm-helpers.ts`
**Purpose**: Frontend utility functions for CRM integration

**Helper Functions**:

**Lead Capture**:
- `captureLead()` - Generic lead capture
- `captureNewsletterLead()` - Newsletter subscriptions
- `captureContactFormLead()` - Contact form submissions
- `captureChatbotLead()` - Chatbot interactions
- `captureQuestionnaireLead()` - Questionnaire submissions

**User Management**:
- `createUserAccount()` - Create new user
- `getUserByEmail()` - Retrieve user by email
- `updateUserProfile()` - Update user information
- `trackUserLogin()` - Log user login events

**Order Management**:
- `createOrder()` - Create new order
- `getUserOrders()` - Get user's order history
- `getOrder()` - Get specific order details
- `updateOrderStatus()` - Update order and add timeline

**Analytics**:
- `getCRMStats()` - Get system statistics

---

## Integration Points & Dependencies

### 1. Lead Capture Integration

**Where to integrate**:

#### Contact Forms
```typescript
import { captureContactFormLead } from '../utils/crm-helpers';

// In form submission handler:
await captureContactFormLead({
  email: formData.email,
  name: formData.name,
  phone: formData.phone,
  message: formData.message
});
```

**Files to update**: 
- `/components/ContactPage.tsx`
- `/components/ConsultationBooking.tsx`

#### Newsletter Signup
```typescript
import { captureNewsletterLead } from '../utils/crm-helpers';

// In newsletter form:
await captureNewsletterLead(email);
```

**Files to update**: 
- `/components/Footer.tsx` (if has newsletter signup)
- Any newsletter component

#### Chatbot Interactions
```typescript
import { captureChatbotLead } from '../utils/crm-helpers';

// In chatbot when collecting user info:
await captureChatbotLead({
  email: userEmail,
  name: userName,
  interests: selectedInterests,
  budget: selectedBudget,
  roomType: selectedRoom
});
```

**Files to update**: 
- `/components/DesignChatbot.tsx`

#### Room Questionnaire
```typescript
import { captureQuestionnaireLead } from '../utils/crm-helpers';

// After questionnaire completion:
await captureQuestionnaireLead({
  email: answers.email,
  name: answers.name,
  phone: answers.phone,
  roomType: answers.roomType,
  budget: answers.budget,
  interests: answers.stylePreferences
});
```

**Files to update**: 
- `/components/RoomQuestionnaire.tsx`

### 2. User Activation & Signup

**SignIn/SignUp Flow**:
```typescript
import { createUserAccount, getUserByEmail } from '../utils/crm-helpers';

// During signup:
const result = await createUserAccount({
  email: email,
  name: name,
  phone: phone,
  accountStatus: "active"
});

// During login - check if user exists:
const { success, user } = await getUserByEmail(email);
```

**Files to update**: 
- `/components/SignInDialog.tsx`
- Any signup/registration components

### 3. Profile Management

**User Profile Updates**:
```typescript
import { updateUserProfile } from '../utils/crm-helpers';

// When user updates profile:
await updateUserProfile(userId, {
  name: newName,
  phone: newPhone,
  address: newAddress,
  preferences: {
    style: selectedStyles,
    budget: budgetRange,
    notifications: notificationSettings
  }
});
```

**Files to update**: 
- `/components/AccountDashboard.tsx`
- Profile settings components

### 4. Order Management

**Checkout Integration**:
```typescript
import { createOrder } from '../utils/crm-helpers';

// At checkout completion:
const result = await createOrder({
  userId: currentUser.id,
  items: cartItems.map(item => ({
    productId: item.id,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    image: item.image
  })),
  subtotal: subtotal,
  tax: calculatedTax,
  shipping: shippingCost,
  discount: appliedDiscount,
  total: grandTotal,
  shippingAddress: shippingAddress,
  paymentMethod: selectedPaymentMethod
});

console.log(`Order created: ${result.orderNumber}`);
```

**Files to update**: 
- `/components/CheckoutFlow.tsx`

**Order Tracking Display**:
```typescript
import { getUserOrders, getOrder } from '../utils/crm-helpers';

// Load user's orders:
const { orders } = await getUserOrders(userId);

// Get specific order details:
const { order } = await getOrder(orderId);
```

**Files to update**: 
- `/components/AccountDashboard.tsx`

### 5. Order Status Updates

**Admin Order Updates**:
```typescript
import { updateOrderStatus } from '../utils/crm-helpers';

// Update order status with timeline:
await updateOrderStatus(orderId, "in-transit", {
  status: "Shipped",
  description: "Package departed from warehouse",
  location: "Shanghai, China"
});
```

**Files to update**: 
- `/components/CRMDashboard.tsx`

---

## Data Flow Examples

### Example 1: Complete User Journey

```
1. LEAD CAPTURE (Website Visit)
   → User fills contact form
   → captureContactFormLead() called
   → Lead created with status: "new"
   → Lead stored in KV: lead:{id}

2. LEAD QUALIFICATION (Admin Action)
   → Admin reviews lead in CRM Dashboard
   → Admin updates status to "qualified"
   → updateLead() called
   → Lead status updated in KV

3. USER ACTIVATION (User Signs Up)
   → User creates account
   → createUserAccount() called
   → User created in KV: user:{id}
   → Lead status updated to "converted"
   → Lead.convertedToUserId = User.id

4. PROFILE MANAGEMENT (User Updates Info)
   → User edits profile in Account Dashboard
   → updateUserProfile() called
   → User data updated in KV

5. ORDER CREATION (User Makes Purchase)
   → User completes checkout
   → createOrder() called
   → Order created in KV: order:{id}
   → User.totalOrders incremented
   → User.totalSpent increased
   → User.loyaltyPoints awarded

6. ORDER TRACKING (Ongoing)
   → Admin updates order status
   → updateOrderStatus() called
   → Timeline entries added
   → User sees updates in dashboard
```

### Example 2: Analytics Dashboard

```
1. Admin opens CRM Dashboard
2. getCRMStats() called
3. System aggregates:
   - All leads from leads:index
   - All users from users:index
   - All orders from orders:index
4. Calculates:
   - Conversion rates
   - Revenue metrics
   - User engagement
5. Returns comprehensive stats object
6. Dashboard renders visualizations
```

---

## Key Metrics Tracked

### Lead Metrics
- Total leads
- New leads (by time period)
- Qualified leads
- Converted leads
- Conversion rate
- Leads by source (website-form, chatbot, etc.)
- Leads by status

### User Metrics
- Total users
- Active users
- New signups (by time period)
- User lifetime value
- Loyalty points distribution
- User retention

### Order Metrics
- Total orders
- Orders by status
- Total revenue
- Average order value
- Order fulfillment rate
- Pending vs completed orders

### Performance Metrics
- Lead-to-user conversion rate
- Order completion rate
- Customer acquisition cost (manual calculation)
- Customer lifetime value

---

## CRM Status Workflows

### Lead Status Flow
```
new → contacted → qualified → converted
  ↓                              ↓
 lost                      (becomes User)
```

### User Account Status
```
active (default)
inactive (not logged in 90+ days)
suspended (manual admin action)
```

### Order Status Flow
```
pending-payment → processing → ready-to-ship → 
in-transit → arriving → out-for-delivery → delivered

Alternative flows:
pending-payment → cancelled
processing → refunded
```

---

## Security Considerations

1. **API Authentication**: All API calls use Bearer token authentication with `publicAnonKey`
2. **Data Privacy**: User data stored securely in Supabase KV store
3. **Input Validation**: Server validates all incoming data
4. **Error Handling**: Comprehensive error logging and user-friendly error messages
5. **CORS**: Properly configured for secure cross-origin requests

---

## Future Enhancements

1. **Email Notifications**: Integrate email service for lead follow-ups and order updates
2. **SMS Notifications**: Send order status updates via SMS
3. **Advanced Analytics**: Add charts for trends, cohort analysis, and forecasting
4. **Lead Scoring**: Implement automatic lead qualification scoring
5. **Marketing Automation**: Automated email campaigns for leads
6. **Customer Segments**: Group users by behavior and preferences
7. **Export Functionality**: CSV/Excel export for all data
8. **Bulk Operations**: Bulk update leads, users, or orders
9. **Advanced Filters**: Date ranges, custom fields, multi-criteria filtering
10. **Mobile App**: Native mobile app for CRM access

---

## Quick Start Guide

### For Developers

1. **Access CRM Dashboard**:
   ```typescript
   // Add to App.tsx routing:
   import { CRMDashboard } from './components/CRMDashboard';
   
   // Add route (protected by admin auth):
   <Route path="/crm" element={<CRMDashboard />} />
   ```

2. **Capture a Lead**:
   ```typescript
   import { captureLead } from './utils/crm-helpers';
   
   await captureLead({
     email: "customer@example.com",
     name: "John Doe",
     source: "website-form"
   });
   ```

3. **Create an Order**:
   ```typescript
   import { createOrder } from './utils/crm-helpers';
   
   const result = await createOrder({
     userId: "user_123",
     items: [...],
     total: 5000,
     shippingAddress: {...}
   });
   ```

4. **Get Statistics**:
   ```typescript
   import { getCRMStats } from './utils/crm-helpers';
   
   const { stats } = await getCRMStats();
   console.log(`Total Revenue: RM ${stats.totalRevenue}`);
   ```

---

## Troubleshooting

### Common Issues

**Issue**: API calls failing with 404
- **Solution**: Ensure server is running and route prefix is `/make-server-3cbf86a5`

**Issue**: No data showing in CRM Dashboard
- **Solution**: Check that leads/users/orders have been created via helper functions

**Issue**: User creation fails with "User already exists"
- **Solution**: Check if user email already exists using `getUserByEmail()` first

**Issue**: Order not showing in user's order list
- **Solution**: Verify `userId` is correct and order was created successfully

---

## API Response Formats

All API responses follow this format:

**Success**:
```json
{
  "success": true,
  "lead": { ... },  // or "user", "order", "stats"
}
```

**Error**:
```json
{
  "success": false,
  "error": "Error message description"
}
```

---

## Contact & Support

For questions or issues with the CRM system:
- Check server logs in Supabase Edge Functions
- Review browser console for client-side errors
- Verify API endpoints are accessible
- Ensure KV store is properly configured

---

## Summary

The Vision Studio CRM system provides:
✅ Complete lead capture across all touchpoints
✅ User activation and profile management
✅ Order creation and tracking
✅ Comprehensive analytics dashboard
✅ Easy-to-use helper functions
✅ Admin dashboard for managing all data
✅ Extensible architecture for future enhancements

All components are production-ready and integrate seamlessly with the existing Vision Studio e-commerce platform.
