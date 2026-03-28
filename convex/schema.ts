import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  }).index("by_token", ["tokenIdentifier"]),

  queries: defineTable({
    tokenIdentifier: v.string(),
    audioUrl: v.optional(v.string()),
    transcript: v.optional(v.string()),
    aiResponse: v.optional(v.string()),
    status: v.union(
      v.literal("recording"),
      v.literal("transcribing"),
      v.literal("searching"),
      v.literal("complete"),
      v.literal("error")
    ),
    errorMessage: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_user", ["tokenIdentifier"])
    .index("by_timestamp", ["timestamp"])
    .index("by_user_and_timestamp", ["tokenIdentifier", "timestamp"]),
});
