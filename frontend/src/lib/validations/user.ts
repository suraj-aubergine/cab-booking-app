import * as z from "zod";
import { UserRole, Gender } from "@/types/auth";

export const userFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum([UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE, UserRole.DRIVER], {
    required_error: "Please select a role",
  }),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
    required_error: "Please select a gender",
  }),
  department: z.string().min(2, "Department is required"),
});

export type UserFormValues = z.infer<typeof userFormSchema>; 