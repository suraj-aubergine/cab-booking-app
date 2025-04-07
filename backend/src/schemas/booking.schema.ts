import { z } from "zod";

export const createBookingSchema = z.object({
  pickupId: z.string().min(1, "Pickup location is required"),
  dropId: z.string().min(1, "Drop location is required"),
  scheduledTime: z.string()
    .regex(
      /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]) ([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/,
      "Invalid datetime format. Expected: YYYY-MM-DD HH:mm:ss"
    )
    .refine((value) => {
      try {
        const [datePart, timePart] = value.split(' ');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hour, minute, second] = timePart.split(':').map(Number);
        
        const date = new Date(year, month - 1, day, hour, minute, second);
        
        // Check if it's a valid date and in the future
        return !isNaN(date.getTime()) && date > new Date();
      } catch (error) {
        return false;
      }
    }, "Invalid datetime or must be in the future"),
  vehicleType: z.enum(["SEDAN", "SUV", "VAN"]),
  passengerCount: z.number().int().min(1).max(10),
  notes: z.string().optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>; 