import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called store without authentication");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (user !== null) {
      if (
        user.name !== identity.name ||
        user.email !== identity.email ||
        user.imageUrl !== identity.pictureUrl
      ) {
        await ctx.db.patch(user._id, {
          name: identity.name,
          email: identity.email,
          imageUrl: identity.pictureUrl,
        });
      }
      return user._id;
    }

    return await ctx.db.insert("users", {
      tokenIdentifier: identity.tokenIdentifier,
      name: identity.name,
      email: identity.email,
      imageUrl: identity.pictureUrl,
      location: "Srinagar",
      crops: ["Apple", "Walnut", "Saffron", "Rice", "Tomato", "Potato"],
    });
  },
});

export const current = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
  },
});

export const updatePreferences = mutation({
  args: {
    location: v.optional(v.string()),
    crops: v.optional(v.array(v.string())),
    language: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) throw new Error("User not found");

    const updates: Record<string, unknown> = {};
    if (args.location !== undefined) updates.location = args.location;
    if (args.crops !== undefined) updates.crops = args.crops;
    if (args.language !== undefined) updates.language = args.language;

    await ctx.db.patch(user._id, updates);
    return user._id;
  },
});

export const completeOnboarding = mutation({
  args: {
    language: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      language: args.language,
      onboardingComplete: true,
    });
    return user._id;
  },
});
