import { z } from "zod/v4";

export const nameSchema = z
  .string("Please enter a valid string")
  .max(90, "Name can be of maximum 90 characters.");

export const emailSchema = z.string().email("Enter a valid email address");

export const permissionSchema = z.enum(["viewer", "editor"], {
  required_error: "Permission is required",
  invalid_type_error: "Invalid permission",
});

export const enabledSchema = z.coerce.boolean(
  "Enabled must be a boolean value"
);

export const passwordSchema = z
  .string()
  .min(3, "Password should be at least 3 characters long");

export const roleSchema = z.enum(["User", "Manager", "Admin", "SuperAdmin"], {
  required_error: "role is required",
  invalid_type_error: "Invalid role",
});
