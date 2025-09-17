import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    tokenIdentifier: v.string(),
    imageUrl: v.optional(v.string()),

    plan: v.union(v.literal("free"), v.literal("pro")),

    //usage tracking for plan limits
    projectsUsed: v.number(), //current project count
    exportsThisMonth: v.number(), //monthly export limit tracking

    createdAt: v.number(),
    lastActiveAt: v.number(),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"]),

  projects: defineTable({
    title: v.string(),
    userId: v.id("users"),

    //canvas dimensions ans state
    canvasState: v.any(), //fabric.js canvas json (objects, layers, etc)
    width: v.number(), //canvas width in pixels
    height: v.number(),

    //image pipeline - tracks image transformations
    originalImageUrl: v.optional(v.string()), //initial uploaded image
    currentImageUrl: v.optional(v.string()), //current processed image
    thumbnailUrl: v.optional(v.string()), //small preview for dashboard

    //IMagekit transformation state
    activeTransforamations: v.optional(v.string()), //current imagekit url params

    //ai features state - tracks what ai processsing has been applied
    backgroundRemoved: v.optional(v.boolean()), //has background been removed

    //organizations
    folderId: v.optional(v.id("folders")), //option folder organnizations

    //timestams
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_updated", ["userId", "updatedAt"])
    .index("by_folder", ["folderId"]),

  folders: defineTable({
    name: v.string(), //folder name
    userId: v.id("users"), //owner
    createdAt: v.number(),
  }).index("by_user", ["userId"]), //users folder
});
