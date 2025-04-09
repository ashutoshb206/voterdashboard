
import { supabaseService } from "./supabase-service";

// We don't need to actually create test users anymore since they're hardcoded
// in the supabase-service.ts file. This is just for backward compatibility.
export const createTestUser = async () => {
  console.log("Test users are available for login");
  console.log("Available test user IDs: VOT12345, VOT67890, VOT54321, VOT09876");
  return;
};
