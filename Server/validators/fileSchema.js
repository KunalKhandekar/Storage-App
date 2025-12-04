import { z } from "zod/v4";

const shareViaEmailObject = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email address"),
  permission: z.string().min(1, "Premission is required"),
});

export const shareViaEmailSchema = z
  .array(shareViaEmailObject)
  .nonempty("Users array cannot be empty");

export const initiateFileUploadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  size: z.coerce.number().gt(1, "Size should be greater than 1 Byte."),
  contentType: z.string().min(1, "Content-Type is required"),
  parentDirId: z.string().optional(),
  isMultipart: z.boolean(),
});
