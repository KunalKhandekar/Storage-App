import { z } from "zod";

// Register Validation
export const registerValidations = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(3, "Password should be at least 3 characters long"),
  otp: z
    .string()
    .length(4, "OTP must be exactly 4 digits")
    .regex(/^\d{4}$/, "OTP must contain only digits"),
});

// Login Validation
export const loginValidations = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(3, "Password should be at least 3 characters long"),
  otp: z
    .string()
    .length(4, "OTP must be exactly 4 digits")
    .regex(/^\d{4}$/, "OTP must contain only digits"),
});

// OTP Middleware Validation
export const otpMiddlewareValidation = z.object({
  email: z.string().email("Provide a valid email"),
  action: z.string().min(1, "Action type is required"),
});

// Verify OTP Validation
export const verifyOTPValidation = z.object({
  email: z.string().email("Provide a valid email"),
  otp: z
    .string()
    .length(4, "OTP must be exactly 4 digits")
    .regex(/^\d{4}$/, "OTP must contain only digits"),
});
