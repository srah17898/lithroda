import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const WHEEL_ITEMS = [
  { emoji: "🍦", name: "Sorvete", multiplier: 5 },
  { emoji: "🎈", name: "Balão", multiplier: 5 },
  { emoji: "🛟", name: "Boia", multiplier: 5 },
  { emoji: "👊", name: "Soco", multiplier: 5 },
  { emoji: "🧸", name: "Tedy", multiplier: 10 },
  { emoji: "👸", name: "Princesa", multiplier: 15 },
  { emoji: "📷", name: "Câmera", multiplier: 25 },
  { emoji: "👑", name: "Coroa", multiplier: 45 },
];

export const addSpin = mutation({
  args: { item: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Record the spin
    await ctx.db.insert("spins", {
      userId,
      item: args.item,
      timestamp: Date.now(),
    });

    // Generate predictions
    const recentSpins = await ctx.db
      .query("spins")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(100);

    // Simple pattern analysis
    const predictions = WHEEL_ITEMS.map(item => {
      let probability = 12.5; // Base probability
      
      // Adjust based on recent history
      if (recentSpins.length > 0) {
        const lastItem = args.item;
        const transitions = recentSpins.filter((spin, i) => 
          i < recentSpins.length - 1 && 
          spin.item === item.emoji && 
          recentSpins[i + 1].item === lastItem
        ).length;
        
        if (transitions > 0) {
          probability += (transitions / recentSpins.length) * 50;
        }
      }

      return {
        item: item.emoji,
        probability: Math.min(Math.max(probability, 5), 40)
      };
    });

    // Normalize probabilities to sum to 100
    const total = predictions.reduce((sum, p) => sum + p.probability, 0);
    predictions.forEach(p => p.probability = +(p.probability / total * 100).toFixed(1));

    // Sort by probability
    predictions.sort((a, b) => b.probability - a.probability);

    await ctx.db.insert("predictions", {
      userId,
      item: args.item,
      predictions,
      timestamp: Date.now(),
    });

    return predictions;
  },
});

export const getRecentSpins = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    
    return await ctx.db
      .query("spins")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(1000);
  },
});

export const getLatestPrediction = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    
    const predictions = await ctx.db
      .query("predictions")
      .withIndex("by_user_recent", (q) => q.eq("userId", userId))
      .order("desc")
      .take(1);

    return predictions[0] || null;
  },
});
