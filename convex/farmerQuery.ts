import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const getQueryById = query({
  args: { queryId: v.id("queries") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const doc = await ctx.db.get(args.queryId);
    if (!doc || doc.tokenIdentifier !== identity.tokenIdentifier) return null;
    return doc;
  },
});

export const getUserHistory = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return await ctx.db
      .query("queries")
      .withIndex("by_user_and_timestamp", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .order("desc")
      .take(50);
  },
});

export const createQuery = mutation({
  args: {
    status: v.union(
      v.literal("recording"),
      v.literal("transcribing"),
      v.literal("searching"),
      v.literal("complete"),
      v.literal("error")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    return await ctx.db.insert("queries", {
      tokenIdentifier: identity.tokenIdentifier,
      status: args.status,
      timestamp: Date.now(),
    });
  },
});

export const updateQuery = internalMutation({
  args: {
    queryId: v.id("queries"),
    status: v.optional(
      v.union(
        v.literal("recording"),
        v.literal("transcribing"),
        v.literal("searching"),
        v.literal("complete"),
        v.literal("error")
      )
    ),
    transcript: v.optional(v.string()),
    aiResponse: v.optional(v.string()),
    audioUrl: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { queryId, ...fields } = args;
    const updates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        updates[key] = value;
      }
    }
    await ctx.db.patch(queryId, updates);
  },
});
