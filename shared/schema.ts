import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Normalized contact record — one row per unique email address
export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

// S3 document references linked to a contact_submission
export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  submissionId: varchar("submission_id").notNull(),
  fileName: text("file_name"),
  s3Bucket: text("s3_bucket"),
  s3Key: text("s3_key"),
  fileType: text("file_type"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// contact_submissions — one row per form/bot submission, linked to contacts by contact_id
export const contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contactId: varchar("contact_id").notNull(),   // FK → contacts.id
  policyType: text("policy_type").notNull(),
  coverageLevel: text("coverage_level"),
  message: text("message"),
  submittedAt: timestamp("submitted_at").defaultNow(),
});

export const policyApplications = pgTable("policy_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicantName: text("applicant_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  policyType: text("policy_type").notNull(), // 'auto', 'home', 'life', 'commercial'
  preferredContactMethod: text("preferred_contact_method"),
  status: text("status").notNull().default("pending"),
  coreDetails: text("core_details"),
  autoDetails: text("auto_details"),
  homeDetails: text("home_details"),
  lifeDetails: text("life_details"),
  commercialDetails: text("commercial_details"),
  documents: text("documents").array(), // Array of document URLs/keys
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const featureRequests = pgTable("feature_requests", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  title: text("title").notNull(),
  description: text("description"),
  priority: text("priority").notNull().default("medium"),
  status: text("status").notNull().default("open"),
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

export const insertFeatureRequestSchema = createInsertSchema(featureRequests).omit({
  id: true,
  createdAt: true,
  status: true,
});

// Sub-schemas for individual vehicles and drivers
export const vehicleSchema = z.object({
  vehicleYear: z.string().optional(),
  vehicleMake: z.string().optional(),
  vehicleModel: z.string().optional(),
  vehicleVin: z.string().optional(),
  primaryUse: z.string().optional(),
  ownershipStatus: z.string().optional(),
});

export const driverSchema = z.object({
  driverDob: z.string().optional(),
  maritalStatus: z.string().optional(),
  licenseState: z.string().optional(),
  licenseNumber: z.string().optional(),
  hasViolations: z.string().optional(),
});

// Zod schemas for policy-specific details (aligned with quote modal fields)
export const autoDetailsSchema = z.object({
  garagingZip: z.string().optional(),
  vehicles: z.array(vehicleSchema).optional(),
  drivers: z.array(driverSchema).optional(),
  currentlyInsured: z.string().optional(),
  currentCarrier: z.string().optional(),
  currentLimits: z.string().optional(),
  // Deprecated flat fields kept for backward compatibility
  vehicleYear: z.string().optional(),
  vehicleMake: z.string().optional(),
  vehicleModel: z.string().optional(),
  vehicleVin: z.string().optional(),
  primaryUse: z.string().optional(),
  ownershipStatus: z.string().optional(),
  driverDob: z.string().optional(),
  maritalStatus: z.string().optional(),
  licenseState: z.string().optional(),
  licenseNumber: z.string().optional(),
  hasViolations: z.string().optional(),
});

export const homeDetailsSchema = z.object({
  propertyAddress: z.string().optional(),
  propertyCity: z.string().optional(),
  propertyState: z.string().optional(),
  propertyZip: z.string().optional(),
  propertyType: z.string().optional(),
  yearBuilt: z.string().optional(),
  squareFootage: z.string().optional(),
  roofYear: z.string().optional(),
  systemsUpdated: z.string().optional(),
  isPrimaryResidence: z.string().optional(),
  hasPool: z.string().optional(),
});

export const lifeDetailsSchema = z.object({
  lifeDob: z.string().optional(),
  gender: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  usesTobacco: z.string().optional(),
  hasMedicalConditions: z.string().optional(),
  lifeType: z.string().optional(),
  coverageAmount: z.string().optional(),
  termLength: z.string().optional(),
});

export const commercialDetailsSchema = z.object({
  businessName: z.string().optional(),
  industryDescription: z.string().optional(),
  yearsInBusiness: z.string().optional(),
  annualRevenue: z.string().optional(),
  fullTimeEmployees: z.string().optional(),
  partTimeEmployees: z.string().optional(),
  needsGeneralLiability: z.string().optional(),
  needsWorkersComp: z.string().optional(),
  needsProfessionalLiability: z.string().optional(),
  needsCyber: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertPolicyApplication = z.infer<typeof insertPolicyApplicationSchema>;
export type PolicyApplication = typeof policyApplications.$inferSelect;
export type InsertFeatureRequest = z.infer<typeof insertFeatureRequestSchema>;
export type FeatureRequest = typeof featureRequests.$inferSelect;
export type VehicleInfo = z.infer<typeof vehicleSchema>;
export type DriverInfo = z.infer<typeof driverSchema>;
export type AutoDetails = z.infer<typeof autoDetailsSchema>;
export type HomeDetails = z.infer<typeof homeDetailsSchema>;
export type LifeDetails = z.infer<typeof lifeDetailsSchema>;
export type CommercialDetails = z.infer<typeof commercialDetailsSchema>;
