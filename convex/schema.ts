import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    location: v.optional(v.string()),
    crops: v.optional(v.array(v.string())),
    language: v.optional(v.string()),
    onboardingComplete: v.optional(v.boolean()),
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

  alerts: defineTable({
    category: v.union(
      v.literal("weather"),
      v.literal("highway"),
      v.literal("subsidy"),
      v.literal("pest"),
      v.literal("market")
    ),
    severity: v.union(
      v.literal("critical"),
      v.literal("warning"),
      v.literal("info")
    ),
    title: v.string(),
    titleLocal: v.optional(v.string()),
    body: v.string(),
    bodyLocal: v.optional(v.string()),
    bodyKashmiri: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
    timestamp: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_timestamp", ["timestamp"])
    .index("by_category_and_timestamp", ["category", "timestamp"]),

  briefings: defineTable({
    tokenIdentifier: v.string(),
    location: v.string(),
    crops: v.array(v.string()),
    smartContext: v.string(),
    voiceScript: v.string(),
    alerts: v.array(
      v.object({
        category: v.string(),
        severity: v.string(),
        title: v.string(),
        body: v.string(),
        titleKashmiri: v.optional(v.string()),
        bodyKashmiri: v.optional(v.string()),
        bodyHindi: v.optional(v.string()),
      })
    ),
    highway: v.optional(
      v.object({
        status: v.string(),
        detail: v.string(),
        advice: v.string(),
      })
    ),
    subsidies: v.optional(
      v.array(
        v.object({
          name: v.string(),
          deadline: v.optional(v.string()),
          detail: v.string(),
        })
      )
    ),
    timestamp: v.number(),
  })
    .index("by_user", ["tokenIdentifier"])
    .index("by_user_and_timestamp", ["tokenIdentifier", "timestamp"]),
});
