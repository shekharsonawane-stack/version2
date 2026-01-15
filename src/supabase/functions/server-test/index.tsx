import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";

const app = new Hono();

// Enable CORS
app.use("/*", cors({ origin: "*" }));

// Health check
app.get("/make-server-3cbf86a5/health", (c) => {
  return c.json({ status: "ok", message: "Server is running!" });
});

// Test endpoint
app.get("/make-server-3cbf86a5/test", (c) => {
  return c.json({ 
    success: true, 
    message: "Test endpoint working",
    timestamp: new Date().toISOString() 
  });
});

console.log("🚀 Test server starting...");
Deno.serve(app.fetch);
