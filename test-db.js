const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function testConnection() {
  try {
    console.log("Testing Supabase connection...");
    console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log(
      "Key:",
      process.env.SUPABASE_SERVICE_ROLE_KEY ? "Present" : "Missing",
    );

    // Try a simple query to test connection
    const { data, error } = await supabase
      .from("health_check")
      .select("*")
      .limit(1);

    if (error) {
      console.log("Query error:", error.message);
      console.log("Error code:", error.code);
      if (error.code === "PGRST116") {
        console.log("Table does not exist - this is expected for health check");
        console.log("Connection is working!");
      } else {
        console.log("Connection failed");
      }
    } else {
      console.log("Query successful:", data);
    }
  } catch (err) {
    console.error("Test failed:", err.message);
  }
}

testConnection();
