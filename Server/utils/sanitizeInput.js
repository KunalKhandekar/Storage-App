import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";
import CustomError from "./ErrorResponse.js";

const window = new JSDOM("").window;
const purify = DOMPurify(window);

export const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== "object") {
    throw new CustomError("Invalid request. Required parameters are missing.");
  }
  const cleanInput = Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      typeof value == "string" ? purify.sanitize(value) : value,
    ])
  );
  return cleanInput;
};

export const sanitizeInput = (value) => {
  return purify.sanitize(value);
};
