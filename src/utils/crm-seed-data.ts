/**
 * CRM Seed Data Generator
 * 
 * This utility creates sample data for testing and demonstration purposes.
 * Call seedCRMData() once to populate the system with sample leads, users, and orders.
 */

import { 
  captureLead, 
  createUserAccount, 
  createOrder 
} from './crm-helpers';

/**
 * Generate sample leads across different sources and statuses
 */
async function seedLeads() {
  console.log("Seeding leads...");
  
  const leads = [
    {
      email: "sarah.chen@email.com",
      name: "Sarah Chen",
      phone: "+60123456789",
      source: "website-form" as const,
      roomType: "Living Room",
      budget: "RM 5,000 - RM 10,000",
      interests: ["modern", "minimalist"],
      notes: "Interested in modern furniture for new apartment",
    },
    {
      email: "john.tan@email.com",
      name: "John Tan",
      phone: "+60198765432",
      source: "chatbot" as const,
      roomType: "Bedroom",
      budget: "RM 3,000 - RM 5,000",
      interests: ["scandinavian", "cozy"],
    },
    {
      email: "michelle.wong@email.com",
      name: "Michelle Wong",
      source: "newsletter" as const,
    },
    {
      email: "david.lee@email.com",
      name: "David Lee",
      phone: "+60187654321",
      source: "consultation" as const,
      roomType: "Office",
      budget: "RM 10,000+",
      interests: ["professional", "ergonomic"],
      notes: "Looking for complete home office setup",
    },
    {
      email: "amy.lim@email.com",
      name: "Amy Lim",
      source: "questionnaire" as const,
      roomType: "Dining Room",
      budget: "RM 5,000 - RM 10,000",
      interests: ["traditional", "elegant"],
    },
    {
      email: "peter.ng@email.com",
      name: "Peter Ng",
      phone: "+60123334444",
      source: "website-form" as const,
      roomType: "Living Room",
      budget: "RM 10,000+",
      notes: "Saw the before/after demo, very interested",
    },
  ];

  for (const lead of leads) {
    await captureLead(lead);
  }

  console.log(`✓ Created ${leads.length} sample leads`);
}

/**
 * Generate sample users with various profiles
 */
async function seedUsers() {
  console.log("Seeding users...");
  
  const users = [
    {
      email: "alice.kumar@email.com",
      name: "Alice Kumar",
      phone: "+60123456001",
      address: {
        street: "123 Jalan Ampang",
        city: "Kuala Lumpur",
        state: "Wilayah Persekutuan",
        postalCode: "50450",
        country: "Malaysia",
      },
      preferences: {
        style: ["modern", "minimalist"],
        budget: "RM 5,000 - RM 10,000",
        roomTypes: ["Living Room", "Bedroom"],
        notifications: {
          email: true,
          sms: true,
          orderUpdates: true,
          promotions: false,
        },
      },
    },
    {
      email: "robert.chan@email.com",
      name: "Robert Chan",
      phone: "+60123456002",
      address: {
        street: "456 Jalan Sultan Ismail",
        city: "Kuala Lumpur",
        state: "Wilayah Persekutuan",
        postalCode: "50250",
        country: "Malaysia",
      },
      preferences: {
        style: ["industrial", "rustic"],
        budget: "RM 10,000+",
        roomTypes: ["Office", "Living Room"],
        notifications: {
          email: true,
          sms: false,
          orderUpdates: true,
          promotions: true,
        },
      },
    },
    {
      email: "jessica.tan@email.com",
      name: "Jessica Tan",
      phone: "+60123456003",
      address: {
        street: "789 Jalan Bukit Bintang",
        city: "Kuala Lumpur",
        state: "Wilayah Persekutuan",
        postalCode: "55100",
        country: "Malaysia",
      },
      preferences: {
        style: ["scandinavian", "cozy"],
        budget: "RM 3,000 - RM 5,000",
        roomTypes: ["Bedroom", "Dining Room"],
        notifications: {
          email: true,
          sms: true,
          orderUpdates: true,
          promotions: true,
        },
      },
    },
  ];

  const createdUsers = [];
  for (const user of users) {
    const result = await createUserAccount(user);
    if (result.success && result.userId) {
      createdUsers.push(result.userId);
    }
  }

  console.log(`✓ Created ${createdUsers.length} sample users`);
  return createdUsers;
}

/**
 * Generate sample orders for existing users
 */
async function seedOrders(userIds: string[]) {
  if (userIds.length === 0) {
    console.log("⚠ No users available, skipping order seeding");
    return;
  }

  console.log("Seeding orders...");
  
  const sampleOrders = [
    {
      userId: userIds[0],
      items: [
        {
          productId: "prod_001",
          name: "Modern Velvet Sofa",
          quantity: 1,
          price: 1299,
          image: "https://images.unsplash.com/photo-1603192399946-8bbb0703cfc4?w=400",
          sku: "MVS-001",
        },
        {
          productId: "prod_002",
          name: "Oak Coffee Table",
          quantity: 1,
          price: 499,
          image: "https://images.unsplash.com/photo-1658367754793-1200cee7b3d6?w=400",
          sku: "OCT-001",
        },
      ],
      subtotal: 1798,
      tax: 107.88,
      shipping: 150,
      discount: 0,
      total: 2055.88,
      shippingAddress: {
        name: "Alice Kumar",
        street: "123 Jalan Ampang",
        city: "Kuala Lumpur",
        state: "Wilayah Persekutuan",
        postalCode: "50450",
        country: "Malaysia",
        phone: "+60123456001",
      },
      paymentMethod: "Credit Card",
    },
    {
      userId: userIds[1] || userIds[0],
      items: [
        {
          productId: "prod_003",
          name: "Ergonomic Office Chair",
          quantity: 2,
          price: 899,
          image: "https://images.unsplash.com/photo-1606520852935-dd83a97464ae?w=400",
          sku: "EOC-001",
        },
        {
          productId: "prod_004",
          name: "Standing Desk",
          quantity: 1,
          price: 1499,
          image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=400",
          sku: "STD-001",
        },
      ],
      subtotal: 3297,
      tax: 197.82,
      shipping: 200,
      discount: 150,
      total: 3544.82,
      shippingAddress: {
        name: "Robert Chan",
        street: "456 Jalan Sultan Ismail",
        city: "Kuala Lumpur",
        state: "Wilayah Persekutuan",
        postalCode: "50250",
        country: "Malaysia",
        phone: "+60123456002",
      },
      paymentMethod: "Online Banking",
    },
    {
      userId: userIds[2] || userIds[0],
      items: [
        {
          productId: "prod_005",
          name: "Scandinavian Bed Frame",
          quantity: 1,
          price: 1899,
          image: "https://images.unsplash.com/photo-1586885991550-d0ec31bb2ad9?w=400",
          sku: "SBF-001",
        },
        {
          productId: "prod_006",
          name: "Bedside Table Set",
          quantity: 2,
          price: 299,
          image: "https://images.unsplash.com/photo-1595428773613-2d4cd8a5c95b?w=400",
          sku: "BTS-001",
        },
      ],
      subtotal: 2497,
      tax: 149.82,
      shipping: 180,
      discount: 100,
      total: 2726.82,
      shippingAddress: {
        name: "Jessica Tan",
        street: "789 Jalan Bukit Bintang",
        city: "Kuala Lumpur",
        state: "Wilayah Persekutuan",
        postalCode: "55100",
        country: "Malaysia",
        phone: "+60123456003",
      },
      paymentMethod: "Credit Card",
    },
  ];

  for (const order of sampleOrders) {
    await createOrder(order);
  }

  console.log(`✓ Created ${sampleOrders.length} sample orders`);
}

/**
 * Main function to seed all CRM data
 * Call this once to populate the system with sample data
 */
export async function seedCRMData() {
  console.log("🌱 Starting CRM data seeding...\n");
  
  try {
    // Seed in sequence to handle dependencies
    await seedLeads();
    const userIds = await seedUsers();
    await seedOrders(userIds);
    
    console.log("\n✅ CRM seeding completed successfully!");
    console.log("\nYou can now:");
    console.log("- View leads in CRM Dashboard > Leads tab");
    console.log("- View users in CRM Dashboard > Users tab");
    console.log("- View orders in CRM Dashboard > Orders tab");
    console.log("- Check analytics in CRM Dashboard > Analytics tab");
    
    return { success: true };
  } catch (error) {
    console.error("\n❌ Error seeding CRM data:", error);
    return { success: false, error };
  }
}

/**
 * Helper to check if seed data already exists
 */
export async function checkSeedDataExists(): Promise<boolean> {
  try {
    const { getCRMStats } = await import('./crm-helpers');
    const { stats } = await getCRMStats();
    return stats && (stats.totalLeads > 0 || stats.totalUsers > 0);
  } catch {
    return false;
  }
}
