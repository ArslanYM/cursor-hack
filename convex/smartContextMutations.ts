import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const saveBriefing = internalMutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("briefings", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

export const saveAlert = internalMutation({
  args: {
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
    body: v.string(),
    bodyKashmiri: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("alerts", {
      category: args.category,
      severity: args.severity,
      title: args.title,
      body: args.body,
      bodyKashmiri: args.bodyKashmiri,
      timestamp: Date.now(),
    });
  },
});
