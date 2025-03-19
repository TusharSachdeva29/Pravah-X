import { z } from "zod"

export const schema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address"
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long"
  })
})

export type Credentials = z.infer<typeof schema>