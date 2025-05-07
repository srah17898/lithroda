import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  spins: defineTable({
    userId: v.id("users"),
    item: v.string(),
    timestamp: v.number(),
  }).index("by_user", ["userId"]),
  predictions: defineTable({
    userId: v.id("users"),
    item: v.string(),
    predictions: v.array(v.object({
      item: v.string(),
      probability: v.number()
    })),
    timestamp: v.number(),
  }).index("by_user_recent", ["userId", "timestamp"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
