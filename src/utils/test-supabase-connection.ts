import { projectId, publicAnonKey } from "./supabase/info";

/**
 * Test Supabase Connection
 * This utility tests the connection to the Supabase backend server
 */

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-3cbf86a5`;

export async function testSupabaseConnection() {
  console.log("🔍 Testing Supabase Connection...");
  console.log("Project ID:", projectId);
  console.log("API Base:", API_BASE);
  console.log("Public Anon Key:", publicAnonKey ? "✅ Present" : "❌ Missing");

  // Test 1: Health check endpoint
  try {
    console.log("\n📡 Test 1: Health Check Endpoint");
    const healthResponse = await fetch(`${API_BASE}/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });

    console.log("Status:", healthResponse.status);
    const healthData = await healthResponse.json();
    console.log("Response:", healthData);

    if (healthResponse.ok && healthData.status === "ok") {
      console.log("✅ Health check passed");
    } else {
      console.log("⚠️ Health check returned unexpected response");
    }
  } catch (error) {
    console.error("❌ Health check failed:", error);
    return {
      success: false,
      error: "Health check failed",
      details: error,
    };
  }

  // Test 2: Get CRM stats
  try {
    console.log("\n📡 Test 2: Get CRM Stats");
    const statsResponse = await fetch(`${API_BASE}/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });

    console.log("Status:", statsResponse.status);
    const statsData = await statsResponse.json();
    console.log("Response:", statsData);

    if (statsResponse.ok) {
      console.log("✅ Stats endpoint working");
    } else {
      console.log("⚠️ Stats endpoint returned error");
    }
  } catch (error) {
    console.error("❌ Stats check failed:", error);
  }

  // Test 3: Get all leads
  try {
    console.log("\n📡 Test 3: Get All Leads");
    const leadsResponse = await fetch(`${API_BASE}/leads`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });

    console.log("Status:", leadsResponse.status);
    const leadsData = await leadsResponse.json();
    console.log("Response:", leadsData);

    if (leadsResponse.ok) {
      console.log("✅ Leads endpoint working");
      console.log(`Found ${leadsData.leads?.length || 0} leads`);
    } else {
      console.log("⚠️ Leads endpoint returned error");
    }
  } catch (error) {
    console.error("❌ Leads check failed:", error);
  }

  // Test 4: Get all users
  try {
    console.log("\n📡 Test 4: Get All Users");
    const usersResponse = await fetch(`${API_BASE}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });

    console.log("Status:", usersResponse.status);
    const usersData = await usersResponse.json();
    console.log("Response:", usersData);

    if (usersResponse.ok) {
      console.log("✅ Users endpoint working");
      console.log(`Found ${usersData.users?.length || 0} users`);
    } else {
      console.log("⚠️ Users endpoint returned error");
    }
  } catch (error) {
    console.error("❌ Users check failed:", error);
  }

  // Test 5: Get all orders
  try {
    console.log("\n📡 Test 5: Get All Orders");
    const ordersResponse = await fetch(`${API_BASE}/orders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });

    console.log("Status:", ordersResponse.status);
    const ordersData = await ordersResponse.json();
    console.log("Response:", ordersData);

    if (ordersResponse.ok) {
      console.log("✅ Orders endpoint working");
      console.log(`Found ${ordersData.orders?.length || 0} orders`);
    } else {
      console.log("⚠️ Orders endpoint returned error");
    }
  } catch (error) {
    console.error("❌ Orders check failed:", error);
  }

  console.log("\n✅ Connection test completed");
  return {
    success: true,
    message: "All tests completed. Check console for detailed results.",
  };
}

// Quick connection check (just health endpoint)
export async function quickConnectionCheck(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
      // Add timeout - shorter for less waiting
      signal: AbortSignal.timeout(3000), // 3 second timeout
    });

    const data = await response.json();
    return response.ok && data.status === "ok";
  } catch (error) {
    // Silent fail - app works fine in offline mode
    // Backend not being deployed is expected, no need to warn
    return false;
  }
}