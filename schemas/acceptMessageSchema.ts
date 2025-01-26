import { z } from "zod";

export const acceptMessageSchema = z.object({
  acceptMessages: z.boolean({
    required_error: "Accept messages must be a boolean",
    invalid_type_error: "Accept messages must be a boolean",
  }),
});
