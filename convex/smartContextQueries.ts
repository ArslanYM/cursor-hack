import { query } from "./_generated/server";
import { v } from "convex/values";

export const getLatestBriefing = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("briefings")
      .withIndex("by_user_and_timestamp", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .order("desc")
      .first();
  },
});

export const getActiveAlerts = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

    const alerts = await ctx.db
      .query("alerts")
      .withIndex("by_timestamp")
      .order("desc")
      .take(20);

    return alerts.filter(
      (a) =>
        a.timestamp > oneDayAgo &&
        (!a.expiresAt || a.expiresAt > Date.now())
    );
  },
});

export const getCriticalAlerts = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const alerts = await ctx.db
      .query("alerts")
      .withIndex("by_timestamp")
      .order("desc")
      .take(10);

    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return alerts.filter(
      (a) =>
        a.timestamp > oneDayAgo &&
        (a.severity === "critical" || a.severity === "warning")
    );
  },
});
