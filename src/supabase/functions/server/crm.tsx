import * as kv from "./kv_store.tsx";

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface Lead {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  source: "website-form" | "chatbot" | "consultation" | "questionnaire" | "newsletter";
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
  interests?: string[];
  budget?: string;
  roomType?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  convertedToUserId?: string;
  assignedTo?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  password: string; // Hashed password
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  preferences?: {
    style?: string[];
    budget?: string;
    roomTypes?: string[];
    notifications?: {
      email: boolean;
      sms: boolean;
      orderUpdates: boolean;
      promotions: boolean;
    };
  };
  accountStatus: "active" | "inactive" | "suspended";
  signupDate: string;
  lastLogin?: string;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  tags?: string[];
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: "pending-payment" | "processing" | "ready-to-ship" | "in-transit" | "arriving" | "out-for-delivery" | "delivered" | "cancelled" | "refunded";
  completed: boolean; // True when order is delivered, cancelled, or refunded
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  timeline: OrderTimeline[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  sku?: string;
}

export interface OrderTimeline {
  status: string;
  description: string;
  date: string;
  completed: boolean;
  location?: string;
}

export interface CRMStats {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  convertedLeads: number;
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  conversionRate: number;
}

// ============================================
// LEAD MANAGEMENT
// ============================================

export async function createLead(lead: Omit<Lead, "id" | "createdAt" | "updatedAt">): Promise<Lead> {
  const id = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const newLead: Lead = {
    ...lead,
    id,
    status: lead.status || "new",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  await kv.set(`lead:${id}`, newLead);
  
  // Add to leads index
  const leadsIndex = await kv.get<string[]>("leads:index") || [];
  leadsIndex.unshift(id);
  await kv.set("leads:index", leadsIndex);
  
  return newLead;
}

export async function getLead(id: string): Promise<Lead | null> {
  return await kv.get<Lead>(`lead:${id}`);
}

export async function updateLead(id: string, updates: Partial<Lead>): Promise<Lead | null> {
  const lead = await getLead(id);
  if (!lead) return null;
  
  const updatedLead: Lead = {
    ...lead,
    ...updates,
    id: lead.id,
    createdAt: lead.createdAt,
    updatedAt: new Date().toISOString(),
  };
  
  await kv.set(`lead:${id}`, updatedLead);
  return updatedLead;
}

export async function getAllLeads(): Promise<Lead[]> {
  const leadsIndex = await kv.get<string[]>("leads:index") || [];
  const leads = await Promise.all(
    leadsIndex.map(id => kv.get<Lead>(`lead:${id}`))
  );
  return leads.filter((lead): lead is Lead => lead !== null);
}

export async function getLeadsByStatus(status: Lead["status"]): Promise<Lead[]> {
  const allLeads = await getAllLeads();
  return allLeads.filter(lead => lead.status === status);
}

export async function convertLeadToUser(leadId: string, userId: string): Promise<void> {
  await updateLead(leadId, {
    status: "converted",
    convertedToUserId: userId,
  });
}

// ============================================
// USER MANAGEMENT
// ============================================

export async function createUser(user: Omit<User, "id" | "signupDate" | "totalOrders" | "totalSpent" | "loyaltyPoints">): Promise<User> {
  const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const newUser: User = {
    ...user,
    id,
    accountStatus: user.accountStatus || "active",
    signupDate: new Date().toISOString(),
    totalOrders: 0,
    totalSpent: 0,
    loyaltyPoints: 0,
  };
  
  await kv.set(`user:${id}`, newUser);
  
  // Add to users index
  const usersIndex = await kv.get<string[]>("users:index") || [];
  usersIndex.unshift(id);
  await kv.set("users:index", usersIndex);
  
  // Index by email for quick lookup
  await kv.set(`user:email:${user.email}`, id);
  
  return newUser;
}

export async function getUser(id: string): Promise<User | null> {
  return await kv.get<User>(`user:${id}`);
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const userId = await kv.get<string>(`user:email:${email}`);
  if (!userId) return null;
  return await getUser(userId);
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  const user = await getUser(id);
  if (!user) return null;
  
  const updatedUser: User = {
    ...user,
    ...updates,
    id: user.id,
    signupDate: user.signupDate,
  };
  
  await kv.set(`user:${id}`, updatedUser);
  return updatedUser;
}

export async function getAllUsers(): Promise<User[]> {
  const usersIndex = await kv.get<string[]>("users:index") || [];
  const users = await Promise.all(
    usersIndex.map(id => kv.get<User>(`user:${id}`))
  );
  return users.filter((user): user is User => user !== null);
}

export async function updateUserLastLogin(id: string): Promise<void> {
  await updateUser(id, { lastLogin: new Date().toISOString() });
}

export async function deleteUser(id: string): Promise<boolean> {
  const user = await getUser(id);
  if (!user) return false;
  
  // Delete user data
  await kv.del(`user:${id}`);
  
  // Delete email index
  await kv.del(`user:email:${user.email}`);
  
  // Remove from users index
  const usersIndex = await kv.get<string[]>("users:index") || [];
  const updatedUsersIndex = usersIndex.filter(userId => userId !== id);
  await kv.set("users:index", updatedUsersIndex);
  
  // Delete user's orders index (orders themselves will remain)
  await kv.del(`user:${id}:orders`);
  
  return true;
}

// ============================================
// ORDER MANAGEMENT
// ============================================

export async function createOrder(order: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt">): Promise<Order> {
  const id = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const orderNumber = `VS-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
  
  const newOrder: Order = {
    ...order,
    id,
    orderNumber,
    status: order.status || "pending-payment",
    completed: order.completed !== undefined ? order.completed : false, // Initialize completed field
    paymentStatus: order.paymentStatus || "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  await kv.set(`order:${id}`, newOrder);
  
  // Add to orders index
  const ordersIndex = await kv.get<string[]>("orders:index") || [];
  ordersIndex.unshift(id);
  await kv.set("orders:index", ordersIndex);
  
  // Add to user's orders
  const userOrders = await kv.get<string[]>(`user:${order.userId}:orders`) || [];
  userOrders.unshift(id);
  await kv.set(`user:${order.userId}:orders`, userOrders);
  
  // Update user stats
  const user = await getUser(order.userId);
  if (user) {
    await updateUser(order.userId, {
      totalOrders: user.totalOrders + 1,
      totalSpent: user.totalSpent + order.total,
      loyaltyPoints: user.loyaltyPoints + Math.floor(order.total / 10),
    });
  }
  
  return newOrder;
}

export async function getOrder(id: string): Promise<Order | null> {
  return await kv.get<Order>(`order:${id}`);
}

export async function updateOrder(id: string, updates: Partial<Order>): Promise<Order | null> {
  const order = await getOrder(id);
  if (!order) return null;
  
  const updatedOrder: Order = {
    ...order,
    ...updates,
    id: order.id,
    orderNumber: order.orderNumber,
    createdAt: order.createdAt,
    updatedAt: new Date().toISOString(),
  };
  
  await kv.set(`order:${id}`, updatedOrder);
  return updatedOrder;
}

export async function getAllOrders(): Promise<Order[]> {
  const ordersIndex = await kv.get<string[]>("orders:index") || [];
  const orders = await Promise.all(
    ordersIndex.map(id => kv.get<Order>(`order:${id}`))
  );
  return orders.filter((order): order is Order => order !== null);
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const orderIds = await kv.get<string[]>(`user:${userId}:orders`) || [];
  const orders = await Promise.all(
    orderIds.map(id => kv.get<Order>(`order:${id}`))
  );
  return orders.filter((order): order is Order => order !== null);
}

export async function getOrdersByStatus(status: Order["status"]): Promise<Order[]> {
  const allOrders = await getAllOrders();
  return allOrders.filter(order => order.status === status);
}

export async function addOrderTimeline(orderId: string, timelineEntry: OrderTimeline): Promise<Order | null> {
  const order = await getOrder(orderId);
  if (!order) return null;
  
  const timeline = [...order.timeline, timelineEntry];
  return await updateOrder(orderId, { timeline });
}

export async function deleteOrder(id: string): Promise<boolean> {
  const order = await getOrder(id);
  if (!order) return false;
  
  // Delete order data
  await kv.del(`order:${id}`);
  
  // Remove from orders index
  const ordersIndex = await kv.get<string[]>("orders:index") || [];
  const updatedOrdersIndex = ordersIndex.filter(orderId => orderId !== id);
  await kv.set("orders:index", updatedOrdersIndex);
  
  // Remove from user's orders
  const userOrders = await kv.get<string[]>(`user:${order.userId}:orders`) || [];
  const updatedUserOrders = userOrders.filter(orderId => orderId !== id);
  await kv.set(`user:${order.userId}:orders`, updatedUserOrders);
  
  // Update user stats (subtract order value)
  const user = await getUser(order.userId);
  if (user) {
    await updateUser(order.userId, {
      totalOrders: Math.max(0, user.totalOrders - 1),
      totalSpent: Math.max(0, user.totalSpent - order.total),
      loyaltyPoints: Math.max(0, user.loyaltyPoints - Math.floor(order.total / 10)),
    });
  }
  
  return true;
}

// ============================================
// ANALYTICS & STATS
// ============================================

export async function getCRMStats(): Promise<CRMStats> {
  const [allLeads, allUsers, allOrders] = await Promise.all([
    getAllLeads(),
    getAllUsers(),
    getAllOrders(),
  ]);
  
  console.log("=== CRM STATS CALCULATION ===");
  console.log("Total orders:", allOrders.length);
  console.log("Order totals:", allOrders.map(o => ({ number: o.orderNumber, total: o.total, status: o.status })));
  
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const newLeads = allLeads.filter(l => l.status === "new").length;
  const qualifiedLeads = allLeads.filter(l => l.status === "qualified").length;
  const convertedLeads = allLeads.filter(l => l.status === "converted").length;
  
  const activeUsers = allUsers.filter(u => u.accountStatus === "active").length;
  const newUsersThisMonth = allUsers.filter(u => 
    new Date(u.signupDate) >= firstDayOfMonth
  ).length;
  
  const pendingOrders = allOrders.filter(o => 
    ["pending-payment", "processing"].includes(o.status)
  ).length;
  const deliveredOrders = allOrders.filter(o => o.status === "delivered").length;
  
  // Calculate total revenue from all orders except cancelled/refunded
  const totalRevenue = allOrders
    .filter(o => !["cancelled", "refunded"].includes(o.status))
    .reduce((sum, o) => sum + (o.total || 0), 0);
  
  console.log("💰 Total Revenue:", totalRevenue);
  console.log("Orders counted for revenue:", allOrders.filter(o => !["cancelled", "refunded"].includes(o.status)).length);
  
  const averageOrderValue = allOrders.length > 0 
    ? totalRevenue / allOrders.length 
    : 0;
  
  const conversionRate = allLeads.length > 0
    ? (convertedLeads / allLeads.length) * 100
    : 0;
  
  return {
    totalLeads: allLeads.length,
    newLeads,
    qualifiedLeads,
    convertedLeads,
    totalUsers: allUsers.length,
    activeUsers,
    newUsersThisMonth,
    totalOrders: allOrders.length,
    pendingOrders,
    deliveredOrders,
    totalRevenue,
    averageOrderValue,
    conversionRate,
  };
}