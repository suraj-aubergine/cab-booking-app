import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/useToast"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useLocations } from "@/hooks/useLocations"

const bookingSchema = z.object({
  pickupId: z.string({
    required_error: "Pickup location is required",
  }).min(1, "Pickup location is required"),
  
  dropId: z.string({
    required_error: "Drop location is required",
  }).min(1, "Drop location is required"),
  
  date: z.date({
    required_error: "Date is required",
  }),
  
  time: z.string({
    required_error: "Time is required",
  }).min(1, "Time is required").regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  
  vehicleType: z.enum(["SEDAN", "SUV", "VAN"], {
    required_error: "Vehicle type is required",
  }),
  
  numberOfPassengers: z.number({
    required_error: "Number of passengers is required",
  }).int()
    .min(1, "Minimum 1 passenger required")
    .max(10, "Maximum 10 passengers allowed"),
  
  specialRequirements: z.string().optional(),
}).refine(
  (data) => {
    const scheduledDateTime = new Date(data.date);
    const [hours, minutes] = data.time.split(":");
    scheduledDateTime.setHours(parseInt(hours), parseInt(minutes));
    return scheduledDateTime > new Date();
  },
  {
    message: "Booking time must be in the future",
    path: ["time"],
  }
).refine(
  (data) => data.pickupId !== data.dropId,
  {
    message: "Pickup and drop locations cannot be the same",
    path: ["dropId"],
  }
);

type BookingForm = {
  pickupId: string;
  dropId: string;
  date: Date;
  time: string;
  vehicleType: "SEDAN" | "SUV" | "VAN";
  numberOfPassengers: number;
  specialRequirements?: string;
};

export function NewBooking() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: locations, isLoading: locationsLoading } = useLocations()

  const form = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      pickupId: "",
      dropId: "",
      vehicleType: "SEDAN",
      numberOfPassengers: 1,
      time: format(new Date(), "HH:mm"),
      specialRequirements: "",
    },
  })

  const createBooking = useMutation({
    mutationFn: async (data: BookingForm) => {
      try {
        const scheduledDateTime = new Date(data.date);
        const [hours, minutes] = data.time.split(":");
        scheduledDateTime.setHours(parseInt(hours), parseInt(minutes), 0);
        
        const formattedDateTime = format(scheduledDateTime, "yyyy-MM-dd HH:mm:ss");

        const requestData = {          
            pickupId: data.pickupId,
            dropId: data.dropId,
            scheduledTime: formattedDateTime,
            vehicleType: data.vehicleType,
            passengerCount: Number(data.numberOfPassengers),
            notes: data.specialRequirements          
        };

        console.log('Request payload:', requestData); // Debug log

        const response = await api.post("/bookings/create", requestData);
        
        if (!response.data.success) {
          throw new Error(response.data.error?.message || 'Failed to create booking');
        }
        
        return response.data;
      } catch (error: any) {
        console.error('Booking creation error:', error);
        throw new Error(error.response?.data?.error?.message || error.message);
      }
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Booking created successfully",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      navigate("/app/bookings");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  function onSubmit(data: BookingForm) {
    // Additional validation before submission
    const scheduledDateTime = new Date(data.date);
    const [hours, minutes] = data.time.split(":");
    scheduledDateTime.setHours(parseInt(hours), parseInt(minutes));

    if (scheduledDateTime <= new Date()) {
      toast({
        title: "Invalid Time",
        description: "Booking time must be in the future",
        variant: "destructive",
      });
      return;
    }

    if (!data.pickupId || !data.dropId) {
      toast({
        title: "Missing Locations",
        description: "Please select both pickup and drop locations",
        variant: "destructive",
      });
      return;
    }

    createBooking.mutate(data);
  }

  if (locationsLoading) {
    return <div>Loading locations...</div>
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">New Booking</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="pickupId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pickup Location</FormLabel>
                <Select 
                  defaultValue={field.value} 
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pickup location" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {locations?.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dropId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Drop Location</FormLabel>
                <Select 
                  defaultValue={field.value} 
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select drop location" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {locations?.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date > new Date(2025, 10, 1)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="vehicleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SEDAN">Sedan</SelectItem>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="VAN">Van</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numberOfPassengers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Passengers</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1} 
                      max={10} 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="specialRequirements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Requirements</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Any special requirements (optional)" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={createBooking.isPending}
          >
            {createBooking.isPending ? "Creating..." : "Create Booking"}
          </Button>
        </form>
      </Form>
    </div>
  )
} 