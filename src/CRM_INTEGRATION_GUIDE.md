# CRM Integration Quick Start Guide

## 🚀 Getting Started

### Step 1: Access the CRM Dashboard

1. Look for the **"Admin"** button in the bottom-right corner of the website
2. Click it to open the admin login dialog
3. Enter password: `visionstudio2025`
4. You'll be redirected to the CRM Dashboard

### Step 2: Seed Sample Data

1. Click the **"Seed Data"** button in the bottom-left corner
2. Wait for the success message
3. Refresh the CRM Dashboard to see:
   - 6 sample leads
   - 3 sample users
   - 3 sample orders
   - Complete analytics

### Step 3: Explore the CRM Dashboard

The dashboard has 4 main tabs:

#### 📋 Leads Tab
- View all captured leads
- Filter by status (new, contacted, qualified, converted, lost)
- Search by name or email
- Click the eye icon to view details and update status
- Send emails or make calls directly from lead details

#### 👥 Users Tab
- View all registered users
- See order history and lifetime value
- Check loyalty points
- Filter by account status
- View detailed user profiles

#### 📦 Orders Tab
- Track all orders
- Filter by order status
- Search by order number
- View order details and items
- Monitor order fulfillment

#### 📊 Analytics Tab
- Conversion funnel visualization
- Revenue metrics
- Average order value
- Lead-to-customer conversion rate
- Performance indicators

---

## 🔌 Integration Points

### 1. Contact Form Integration

Add to `/components/ContactPage.tsx`:

```typescript
import { captureContactFormLead } from '../utils/crm-helpers';

// In form submit handler:
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Capture lead
  await captureContactFormLead({
    email: formData.email,
    name: formData.name,
    phone: formData.phone,
    message: formData.message
  });
  
  // Show success message
  toast.success("Thank you! We'll contact you soon.");
};
```

### 2. Newsletter Signup Integration

Add to `/components/Footer.tsx`:

```typescript
import { captureNewsletterLead } from '../utils/crm-helpers';

// In newsletter signup:
const handleNewsletterSignup = async (email: string) => {
  const result = await captureNewsletterLead(email);
  
  if (result.success) {
    toast.success("Successfully subscribed!");
  }
};
```

### 3. Chatbot Lead Capture

Add to `/components/DesignChatbot.tsx`:

```typescript
import { captureChatbotLead } from '../utils/crm-helpers';

// When collecting user info in chat:
const captureUserFromChat = async () => {
  await captureChatbotLead({
    email: userEmail,
    name: userName,
    interests: chatPreferences.styles,
    budget: chatPreferences.budget,
    roomType: chatPreferences.roomType
  });
};
```

### 4. Questionnaire Lead Capture

Add to `/components/RoomQuestionnaire.tsx`:

```typescript
import { captureQuestionnaireLead } from '../utils/crm-helpers';

// After questionnaire completion:
const handleComplete = async (answers) => {
  // Save preferences
  onComplete(answers);
  
  // Capture as lead
  await captureQuestionnaireLead({
    email: answers.email,
    name: answers.name,
    phone: answers.phone,
    roomType: answers.roomType,
    budget: answers.budget,
    interests: answers.stylePreferences
  });
};
```

### 5. User Signup Integration

Add to `/components/SignInDialog.tsx`:

```typescript
import { createUserAccount, getUserByEmail } from '../utils/crm-helpers';

// Sign up flow:
const handleSignUp = async (userData) => {
  // Check if user exists
  const existing = await getUserByEmail(userData.email);
  
  if (!existing.success) {
    // Create new user
    const result = await createUserAccount({
      email: userData.email,
      name: userData.name,
      phone: userData.phone,
      accountStatus: "active"
    });
    
    if (result.success) {
      toast.success("Account created successfully!");
    }
  }
};

// Sign in flow:
const handleSignIn = async (email) => {
  const { user } = await getUserByEmail(email);
  
  if (user) {
    // Track login
    await trackUserLogin(user.id);
  }
};
```

### 6. Checkout Order Creation

Add to `/components/CheckoutFlow.tsx`:

```typescript
import { createOrder } from '../utils/crm-helpers';

// After payment confirmation:
const handleCheckoutComplete = async () => {
  const result = await createOrder({
    userId: currentUser.id,
    items: cartItems.map(item => ({
      productId: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      image: item.image
    })),
    subtotal: calculateSubtotal(),
    tax: calculateTax(),
    shipping: shippingCost,
    discount: appliedDiscount,
    total: grandTotal,
    shippingAddress: {
      name: shippingInfo.name,
      street: shippingInfo.address,
      city: shippingInfo.city,
      state: shippingInfo.state,
      postalCode: shippingInfo.postalCode,
      country: shippingInfo.country,
      phone: shippingInfo.phone
    },
    paymentMethod: selectedPaymentMethod
  });
  
  if (result.success) {
    toast.success(`Order created: ${result.orderNumber}`);
  }
};
```

### 7. Profile Management

Add to `/components/AccountDashboard.tsx`:

```typescript
import { updateUserProfile, getUserOrders } from '../utils/crm-helpers';

// Load user orders:
useEffect(() => {
  const loadOrders = async () => {
    const { orders } = await getUserOrders(currentUser.id);
    setOrders(orders);
  };
  
  loadOrders();
}, [currentUser.id]);

// Update profile:
const handleUpdateProfile = async (updates) => {
  const result = await updateUserProfile(currentUser.id, {
    name: updates.name,
    phone: updates.phone,
    address: updates.address,
    preferences: updates.preferences
  });
  
  if (result.success) {
    toast.success("Profile updated successfully!");
  }
};
```

---

## 📊 Available Helper Functions

### Lead Capture
- `captureLead(data)` - Generic lead capture
- `captureNewsletterLead(email)` - Newsletter signups
- `captureContactFormLead(data)` - Contact form submissions
- `captureChatbotLead(data)` - Chatbot interactions
- `captureQuestionnaireLead(data)` - Questionnaire submissions

### User Management
- `createUserAccount(data)` - Create new user
- `getUserByEmail(email)` - Retrieve user by email
- `updateUserProfile(userId, updates)` - Update user info
- `trackUserLogin(userId)` - Log user login

### Order Management
- `createOrder(data)` - Create new order
- `getUserOrders(userId)` - Get user's order history
- `getOrder(orderId)` - Get specific order
- `updateOrderStatus(orderId, status, timeline)` - Update order

### Analytics
- `getCRMStats()` - Get system statistics

---

## 🎯 Lead Sources

The system tracks leads from these sources:
- `website-form` - Contact forms
- `chatbot` - Design chatbot interactions
- `consultation` - Consultation bookings
- `questionnaire` - Room questionnaires
- `newsletter` - Newsletter signups

---

## 📈 Lead Status Flow

```
new (default)
  ↓
contacted (admin followed up)
  ↓
qualified (lead shows strong interest)
  ↓
converted (became a user)

Alternative: lost (not interested)
```

---

## 🛍️ Order Status Flow

```
pending-payment (just created)
  ↓
processing (payment confirmed)
  ↓
ready-to-ship (packed and ready)
  ↓
in-transit (shipped)
  ↓
arriving (near destination)
  ↓
out-for-delivery (final delivery)
  ↓
delivered (completed)

Alternatives:
- cancelled (order cancelled)
- refunded (refund processed)
```

---

## 🔐 Security Notes

1. **Admin Password**: The default password is `visionstudio2025` - change this in production
2. **API Authentication**: All API calls use the Supabase public anon key
3. **Data Privacy**: User data is stored securely in the KV store
4. **In Production**: Implement proper authentication (see Supabase Auth docs)

---

## 📝 Data Structure Examples

### Lead Object
```typescript
{
  id: "lead_1234...",
  email: "customer@example.com",
  name: "John Doe",
  phone: "+60123456789",
  source: "website-form",
  status: "new",
  interests: ["modern", "minimalist"],
  budget: "RM 5,000 - RM 10,000",
  roomType: "Living Room",
  notes: "Interested in sofa and coffee table",
  createdAt: "2025-01-07T...",
  updatedAt: "2025-01-07T..."
}
```

### User Object
```typescript
{
  id: "user_1234...",
  email: "customer@example.com",
  name: "John Doe",
  phone: "+60123456789",
  accountStatus: "active",
  signupDate: "2025-01-07T...",
  lastLogin: "2025-01-07T...",
  totalOrders: 5,
  totalSpent: 15000,
  loyaltyPoints: 1500,
  address: {
    street: "123 Main St",
    city: "Kuala Lumpur",
    state: "Wilayah Persekutuan",
    postalCode: "50450",
    country: "Malaysia"
  },
  preferences: {
    style: ["modern", "minimalist"],
    budget: "RM 5,000 - RM 10,000",
    notifications: {
      email: true,
      sms: true,
      orderUpdates: true,
      promotions: false
    }
  }
}
```

### Order Object
```typescript
{
  id: "order_1234...",
  orderNumber: "VS-2025-001234",
  userId: "user_1234...",
  status: "in-transit",
  paymentStatus: "paid",
  total: 5000,
  items: [
    {
      productId: "prod_001",
      name: "Modern Velvet Sofa",
      quantity: 1,
      price: 1299,
      image: "...",
      sku: "MVS-001"
    }
  ],
  shippingAddress: {
    name: "John Doe",
    street: "123 Main St",
    city: "Kuala Lumpur",
    state: "Wilayah Persekutuan",
    postalCode: "50450",
    country: "Malaysia",
    phone: "+60123456789"
  },
  timeline: [
    {
      status: "Order Confirmed",
      description: "Your order has been confirmed",
      date: "2025-01-07T...",
      completed: true
    }
  ],
  createdAt: "2025-01-07T...",
  updatedAt: "2025-01-07T..."
}
```

---

## 🐛 Troubleshooting

### Issue: "Seed Data" button not working
- **Solution**: Check browser console for errors. Ensure server is running.

### Issue: CRM Dashboard showing no data
- **Solution**: Click "Seed Data" button to populate sample data.

### Issue: Lead capture not working
- **Solution**: Verify API_BASE URL is correct in crm-helpers.ts

### Issue: Admin login not working
- **Solution**: Password is case-sensitive. Use: `visionstudio2025`

---

## 📚 Additional Resources

- **Full Documentation**: See `/CRM_SYSTEM_DOCUMENTATION.md`
- **API Endpoints**: Check `/supabase/functions/server/index.tsx`
- **Business Logic**: Review `/supabase/functions/server/crm.tsx`
- **Helper Functions**: See `/utils/crm-helpers.ts`

---

## ✅ Quick Checklist

Before going to production:

- [ ] Change admin password from default
- [ ] Implement proper authentication (Supabase Auth)
- [ ] Add email notification service
- [ ] Configure SMS notifications (optional)
- [ ] Set up automated lead follow-ups
- [ ] Add export functionality for reports
- [ ] Configure backup strategy for KV store
- [ ] Add rate limiting to API endpoints
- [ ] Set up monitoring and alerts
- [ ] Create user documentation

---

## 🎉 You're All Set!

The CRM system is fully functional and ready to track your customer journey from first contact to completed orders. Start by seeding data and exploring the dashboard!

**Need Help?**
- Check the full documentation in `CRM_SYSTEM_DOCUMENTATION.md`
- Review example implementations in the codebase
- Consult API endpoint definitions in server code
