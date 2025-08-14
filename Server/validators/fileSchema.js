import { z } from "zod/v4";

const shareViaEmailObject = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email address"),
  permission: z.string().min(1, "Premission is required"),
});

export const shareViaEmailSchema = z
  .array(shareViaEmailObject)
  .nonempty("Users array cannot be empty");
