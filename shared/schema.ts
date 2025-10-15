import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  policyType: text("policy_type").notNull(),
  coverageLevel: text("coverage_level"),
  message: text("message"),
  documents: text("documents").array(),
  submittedAt: timestamp("submitted_at").defaultNow(),
});

export const policyApplications = pgTable("policy_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicantName: text("applicant_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  policyType: text("policy_type").notNull(), // 'auto', 'home', 'life'
  preferredContactMethod: text("preferred_contact_method"), // 'phone', 'email', 'text'
  status: text("status").notNull().default("pending"), // 'pending', 'reviewed', 'approved', 'declined'
  coreDetails: text("core_details"), // JSON string for shared details
  autoDetails: text("auto_details"), // JSON string for auto-specific fields
  homeDetails: text("home_details"), // JSON string for home-specific fields
  lifeDetails: text("life_details"), // JSON string for life-specific fields
  documents: text("documents").array(), // Array of document URLs/keys
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  submittedAt: true,
});

export const insertPolicyApplicationSchema = createInsertSchema(policyApplications).omit({
  id: true,
  createdAt: true,
  status: true,
});

// Zod schemas for policy-specific details
export const autoDetailsSchema = z.object({
  driverCount: z.number().min(1),
  primaryVehicle: z.object({
    make: z.string(),
    model: z.string(),
    year: z.number().min(1900).max(new Date().getFullYear() + 1),
    vin: z.string().optional(),
  }),
  usageProfile: z.string(), // e.g., "commute", "pleasure", "business"
  desiredCoverages: z.array(z.string()), // e.g., ["liability", "collision", "comprehensive"]
  currentInsurer: z.string().optional(),
  policyExpiration: z.string().optional(),
  claimsHistory: z.string().optional(),
});

export const homeDetailsSchema = z.object({
  propertyAddress: z.string(),
  ownershipStatus: z.string(), // "own", "mortgage"
  dwellingType: z.string(), // "single-family", "condo", "townhome"
  constructionYear: z.number().min(1800),
  squareFootage: z.number().min(1),
  securityFeatures: z.array(z.string()).optional(), // e.g., ["alarm", "deadbolts", "cameras"]
  desiredCoverages: z.array(z.string()),
  currentInsurer: z.string().optional(),
  policyExpiration: z.string().optional(),
  claimsHistory: z.string().optional(),
});

export const lifeDetailsSchema = z.object({
  age: z.number().min(18).max(100),
  gender: z.string(),
  smokerStatus: z.boolean(),
  healthConditions: z.string().optional(),
  coverageGoal: z.string(), // e.g., "income replacement", "mortgage protection", "final expenses"
  desiredCoverageAmount: z.number().min(1000),
  beneficiariesCount: z.number().min(1),
  beneficiaryRelationships: z.string().optional(),
  existingPolicies: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertPolicyApplication = z.infer<typeof insertPolicyApplicationSchema>;
export type PolicyApplication = typeof policyApplications.$inferSelect;
export type AutoDetails = z.infer<typeof autoDetailsSchema>;
export type HomeDetails = z.infer<typeof homeDetailsSchema>;
export type LifeDetails = z.infer<typeof lifeDetailsSchema>;
