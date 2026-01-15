# Vision Studio CRM - Dependencies & Data Flow Map

## 🗺️ System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         VISION STUDIO CRM                            │
│                      Customer Lifecycle Management                   │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   CAPTURE    │───▶│   ACTIVATE   │───▶│   ENGAGE     │───▶│   RETAIN     │
│    LEADS     │    │    USERS     │    │   ORDERS     │    │  LOYALTY     │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
```

---

## 📦 File Structure & Dependencies

### Backend Layer

```
/supabase/functions/server/
├── index.tsx                 ← HTTP Server & API Routes
│   ├── Imports: crm.tsx      ← Business logic
│   ├── Imports: kv_store.tsx ← Data persistence
│   └── Exports: REST API endpoints
│
├── crm.tsx                   ← CRM Business Logic
│   ├── Imports: kv_store.tsx ← Data operations
│   ├── Exports: Functions
│   │   ├── createLead()
│   │   ├── createUser()
│   │   ├── createOrder()
│   │   └── getCRMStats()
│   └── Defines: TypeScript interfaces
│
└── kv_store.tsx              ← Protected - DO NOT MODIFY
    └── Provides: KV database operations
```

### Frontend Layer

```
/components/
├── CRMDashboard.tsx          ← Admin Dashboard UI
│   ├── Imports: UI components
│   ├── Uses: API calls to server
│   └── Displays: Leads, Users, Orders, Analytics
│
└── AdminAccess.tsx           ← Admin Authentication
    ├── Wraps: CRMDashboard
    └── Provides: Password protection

/utils/
├── crm-helpers.ts            ← Frontend API Integration
│   ├── Imports: supabase/info.tsx
│   ├── Exports: Helper functions
│   │   ├── captureLead()
│   │   ├── createUserAccount()
│   │   ├── createOrder()
│   │   └── getCRMStats()
│   └── Used by: All components
│
└── crm-seed-data.ts          ← Sample Data Generator
    ├── Imports: crm-helpers.ts
    └── Exports: seedCRMData()
```

---

## 🔄 Data Flow Diagrams

### 1. Lead Capture Flow

```
┌─────────────────┐
│  User Actions   │
└────────┬────────┘
         │
    ┌────▼────┐  ┌──────────┐  ┌────────────┐  ┌─────────────┐
    │ Contact │  │ Chatbot  │  │ Newsletter │  │Questionnaire│
    │  Form   │  │          │  │   Signup   │  │             │
    └────┬────┘  └────┬─────┘  └─────┬──────┘  └──────┬──────┘
         │            │              │                 │
         └────────────┴──────────────┴─────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │  crm-helpers.ts   │
                    │  captureLead()    │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │   API Request     │
                    │ POST /leads       │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │  Server: crm.tsx  │
                    │  createLead()     │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │   KV Store        │
                    │  lead:{id}        │
                    │  leads:index      │
                    └───────────────────┘
```

### 2. User Activation Flow

```
┌──────────────┐
│ Sign Up Form │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ crm-helpers.ts   │
│createUserAccount│
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  POST /users     │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ crm.createUser() │
│ ├─ Generate ID   │
│ ├─ Set defaults  │
│ └─ Save to KV    │
└──────┬───────────┘
       │
       ▼
┌──────────────────────────┐
│    KV Store              │
│ ├─ user:{id}             │
│ ├─ users:index           │
│ └─ user:email:{email}    │
└──────────────────────────┘
       │
       ▼
┌──────────────────┐
│ Convert Lead     │
│ (if exists)      │
└──────────────────┘
```

### 3. Order Creation Flow

```
┌──────────────┐
│   Checkout   │
│   Complete   │
└──────┬───────┘
       │
       ▼
┌─────────────────┐
│ crm-helpers.ts  │
│  createOrder()  │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ POST /orders    │
└──────┬──────────┘
       │
       ▼
┌──────────────────────┐
│ crm.createOrder()    │
│ ├─ Generate ID       │
│ ├─ Generate #        │
│ ├─ Create timeline   │
│ └─ Update user stats │
└──────┬───────────────┘
       │
       ├─────────────────────┐
       │                     │
       ▼                     ▼
┌──────────────┐    ┌────────────────┐
│   KV Store   │    │  Update User   │
│ order:{id}   │    │ ├─ totalOrders │
│ orders:index │    │ ├─ totalSpent  │
│ user:{id}:   │    │ └─ loyalty pts │
│    orders    │    └────────────────┘
└──────────────┘
```

### 4. Analytics Aggregation Flow

```
┌─────────────────┐
│ CRM Dashboard   │
│ Analytics Tab   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ crm-helpers.ts  │
│  getCRMStats()  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  GET /stats     │
└────────┬────────┘
         │
         ▼
┌──────────────────────────┐
│ crm.getCRMStats()        │
│ ├─ getAllLeads()         │
│ ├─ getAllUsers()         │
│ ├─ getAllOrders()        │
│ └─ Calculate metrics     │
└────────┬─────────────────┘
         │
    ┌────┼────┐
    ▼    ▼    ▼
┌─────┐┌─────┐┌──────┐
│Leads││Users││Orders│
└─────┘└─────┘└──────┘
         │
         ▼
┌──────────────────────┐
│   Aggregated Stats   │
│ ├─ Conversion rate   │
│ ├─ Revenue           │
│ ├─ AOV               │
│ └─ Growth metrics    │
└──────────────────────┘
```

---

## 🔗 Integration Dependencies

### Component Integration Requirements

#### 1. ContactPage.tsx
**Status**: ⚠️ Needs Integration

**Dependencies**:
```typescript
import { captureContactFormLead } from '../utils/crm-helpers';
```

**Required Changes**:
- Add lead capture to form submission
- Call `captureContactFormLead()` on submit

---

#### 2. Footer.tsx (Newsletter)
**Status**: ⚠️ Needs Integration

**Dependencies**:
```typescript
import { captureNewsletterLead } from '../utils/crm-helpers';
```

**Required Changes**:
- Add newsletter lead capture
- Call `captureNewsletterLead()` on signup

---

#### 3. DesignChatbot.tsx
**Status**: ⚠️ Needs Integration

**Dependencies**:
```typescript
import { captureChatbotLead } from '../utils/crm-helpers';
```

**Required Changes**:
- Capture lead when user provides email
- Include chat preferences in lead data

---

#### 4. RoomQuestionnaire.tsx
**Status**: ⚠️ Needs Integration

**Dependencies**:
```typescript
import { captureQuestionnaireLead } from '../utils/crm-helpers';
```

**Required Changes**:
- Capture lead on questionnaire completion
- Include room preferences and budget

---

#### 5. SignInDialog.tsx
**Status**: ⚠️ Needs Integration

**Dependencies**:
```typescript
import { 
  createUserAccount, 
  getUserByEmail,
  trackUserLogin 
} from '../utils/crm-helpers';
```

**Required Changes**:
- Create user account on signup
- Track login events
- Link to existing leads if email matches

---

#### 6. CheckoutFlow.tsx
**Status**: ⚠️ Needs Integration

**Dependencies**:
```typescript
import { createOrder } from '../utils/crm-helpers';
```

**Required Changes**:
- Create order on checkout completion
- Include all order details and items
- Generate order number for confirmation

---

#### 7. AccountDashboard.tsx
**Status**: ⚠️ Needs Integration

**Dependencies**:
```typescript
import { 
  getUserOrders,
  updateUserProfile 
} from '../utils/crm-helpers';
```

**Required Changes**:
- Load user's order history
- Display order tracking
- Enable profile updates

---

#### 8. App.tsx
**Status**: ✅ Already Integrated

**Dependencies**:
```typescript
import { AdminAccess } from './components/AdminAccess';
import { seedCRMData } from './utils/crm-seed-data';
```

**Features Added**:
- Admin access button
- Seed data button
- Ready for testing

---

## 🎯 Integration Priority

### High Priority (Core Functionality)
1. **SignInDialog.tsx** - User activation
2. **CheckoutFlow.tsx** - Order creation
3. **AccountDashboard.tsx** - Order tracking

### Medium Priority (Lead Generation)
4. **ContactPage.tsx** - Contact form leads
5. **RoomQuestionnaire.tsx** - Questionnaire leads
6. **DesignChatbot.tsx** - Chatbot leads

### Low Priority (Marketing)
7. **Footer.tsx** - Newsletter leads

---

## 📊 Data Relationships

```
┌──────────┐         ┌──────────┐         ┌──────────┐
│   Lead   │         │   User   │         │  Order   │
├──────────┤         ├──────────┤         ├──────────┤
│ id       │    ┌───▶│ id       │◀───┐    │ id       │
│ email    │    │    │ email    │    │    │ userId   │──┐
│ source   │    │    │ name     │    │    │ items[]  │  │
│ status   │    │    │ phone    │    │    │ total    │  │
│ converted│────┘    │ address  │    │    │ status   │  │
│ ToUserId │         │ totalOrds│◀───┼────│ timeline │  │
└──────────┘         │ totalSpnt│    │    └──────────┘  │
                     │ loyaltyPt│    │                   │
                     └──────────┘    └───────────────────┘
                                    
┌─────────────────────────────────────────────────┐
│             KV Store Structure                  │
├─────────────────────────────────────────────────┤
│ lead:{id}             → Lead object             │
│ leads:index           → [lead_ids...]           │
│                                                 │
│ user:{id}             → User object             │
│ user:email:{email}    → user_id                 │
│ users:index           → [user_ids...]           │
│                                                 │
│ order:{id}            → Order object            │
│ orders:index          → [order_ids...]          │
│ user:{userId}:orders  → [order_ids...]          │
└─────────────────────────────────────────────────┘
```

---

## 🔐 Security & Access Control

```
┌────────────────────────────────────────┐
│         Access Levels                  │
├────────────────────────────────────────┤
│                                        │
│ PUBLIC (No Auth)                       │
│ ├─ captureLead()                       │
│ ├─ createUserAccount()                 │
│ └─ createOrder()                       │
│                                        │
│ ADMIN (Password Protected)             │
│ ├─ CRM Dashboard                       │
│ ├─ View all leads                      │
│ ├─ View all users                      │
│ ├─ View all orders                     │
│ ├─ Update lead status                  │
│ └─ View analytics                      │
│                                        │
│ Protected Password: visionstudio2025   │
│ (Change in production!)                │
└────────────────────────────────────────┘
```

---

## 🚀 Deployment Checklist

### Before Production

**Backend**:
- [x] CRM module created (`/supabase/functions/server/crm.tsx`)
- [x] API routes defined (`/supabase/functions/server/index.tsx`)
- [x] KV store integration verified
- [ ] Rate limiting added
- [ ] Error logging configured

**Frontend**:
- [x] CRM Dashboard created
- [x] Admin access implemented
- [x] Helper functions created
- [ ] All components integrated
- [ ] Error handling added

**Security**:
- [ ] Change default admin password
- [ ] Implement proper authentication
- [ ] Add API key rotation
- [ ] Set up CORS properly
- [ ] Enable request validation

**Features**:
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Export functionality
- [ ] Automated workflows
- [ ] Backup strategy

---

## 📈 Success Metrics

Track these KPIs in the CRM:

1. **Lead Metrics**
   - Lead capture rate
   - Lead source distribution
   - Lead-to-customer conversion rate

2. **User Metrics**
   - User activation rate
   - User retention rate
   - Average customer lifetime value

3. **Order Metrics**
   - Order completion rate
   - Average order value
   - Order fulfillment time

4. **Revenue Metrics**
   - Total revenue
   - Revenue per user
   - Revenue growth rate

---

## 🎓 Learning Resources

- **KV Store Docs**: `/supabase/functions/server/kv_store.tsx`
- **API Reference**: `/supabase/functions/server/index.tsx`
- **Type Definitions**: `/supabase/functions/server/crm.tsx`
- **Helper Functions**: `/utils/crm-helpers.ts`
- **Full Guide**: `/CRM_SYSTEM_DOCUMENTATION.md`
- **Quick Start**: `/CRM_INTEGRATION_GUIDE.md`

---

## ✅ System Status

```
┌─────────────────────────────────────────┐
│     CRM System Components               │
├─────────────────────────────────────────┤
│ ✅ Backend API                          │
│ ✅ Business Logic                       │
│ ✅ Data Models                          │
│ ✅ CRM Dashboard                        │
│ ✅ Admin Access                         │
│ ✅ Helper Functions                     │
│ ✅ Seed Data Generator                  │
│ ✅ Documentation                        │
│                                         │
│ ⚠️  Component Integration (pending)    │
│ ⚠️  Email Notifications (pending)      │
│ ⚠️  Production Auth (pending)          │
└─────────────────────────────────────────┘

Status: Ready for Integration & Testing
```

---

**Next Steps**: 
1. Click "Seed Data" to populate sample data
2. Access CRM Dashboard via "Admin" button
3. Begin integrating components one by one
4. Test complete user journey
5. Deploy to production

**Questions?** Refer to the full documentation in `/CRM_SYSTEM_DOCUMENTATION.md`
