"use client"

import { useEffect } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

// Define the form schema based on the SQL schema
const formSchema = z.object({
  Student_ID: z.string().min(1, "Student ID is required").max(12),
  Name: z.string().min(1, "Name is required").max(100),
  Gender: z.enum(["M", "F"], {
    required_error: "Gender is required",
  }),
  Category: z.enum(["GEN", "SC", "ST", "OBC", "Kashmiri Migrant", "J&K PMSSS"], {
    required_error: "Category is required",
  }),
  Domicile: z.enum(["Delhi", "Outside Delhi"], {
    required_error: "Domicile is required",
  }),
  Parent_Income: z.enum(["<5L", "5L-7L", "7L-8L", ">8L"], {
    required_error: "Parent income is required",
  }),
  Date_of_Birth: z.date({
    required_error: "Date of birth is required",
  }),
  Place_of_Birth: z.string().max(50).optional(),
  Admission_Date: z.date({
    required_error: "Admission date is required",
  }),
  Mobile: z.string().min(10, "Mobile number must be at least 10 digits").max(15),
  Email: z.string().email("Invalid email address").max(100),
  Present_Address: z.string().max(255).optional(),
  Permanent_Address: z.string().max(255).optional(),
  Course_ID: z.string().min(1, "Course ID is required").max(3),
})

type FormValues = z.infer<typeof formSchema>

interface StudentDetailsFormProps {
  data: any
  updateData: (data: any) => void
}

export default function StudentDetailsForm({ data, updateData }: StudentDetailsFormProps) {
  // Initialize the form with default values or existing data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Student_ID: data?.Student_ID || "",
      Name: data?.Name || "",
      Gender: data?.Gender || undefined,
      Category: data?.Category || undefined,
      Domicile: data?.Domicile || undefined,
      Parent_Income: data?.Parent_Income || undefined,
      Date_of_Birth: data?.Date_of_Birth ? new Date(data.Date_of_Birth) : undefined,
      Place_of_Birth: data?.Place_of_Birth || "",
      Admission_Date: data?.Admission_Date ? new Date(data.Admission_Date) : new Date(),
      Mobile: data?.Mobile || "",
      Email: data?.Email || "",
      Present_Address: data?.Present_Address || "",
      Permanent_Address: data?.Permanent_Address || "",
      Course_ID: data?.Course_ID || "",
    },
  })

  // Update parent component when form values change
  const onSubmit = (values: FormValues) => {
    updateData(values)
  }

  // Auto-save form data when values change
  useEffect(() => {
    const subscription = form.watch((value) => {
      updateData(value)
    })
    return () => subscription.unsubscribe()
  }, [form, updateData])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="Student_ID"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student ID*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter student ID" {...field} />
                </FormControl>
                <FormDescription>Your unique student identification number.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender*</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="M" />
                      </FormControl>
                      <FormLabel className="font-normal">Male</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="F" />
                      </FormControl>
                      <FormLabel className="font-normal">Female</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="GEN">General</SelectItem>
                    <SelectItem value="SC">SC</SelectItem>
                    <SelectItem value="ST">ST</SelectItem>
                    <SelectItem value="OBC">OBC</SelectItem>
                    <SelectItem value="Kashmiri Migrant">Kashmiri Migrant</SelectItem>
                    <SelectItem value="J&K PMSSS">J&K PMSSS</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Domicile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Domicile*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select domicile" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Delhi">Delhi</SelectItem>
                    <SelectItem value="Outside Delhi">Outside Delhi</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Parent_Income"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Income*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select income range" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="<5L">Less than 5 Lakhs</SelectItem>
                    <SelectItem value="5L-7L">5 Lakhs - 7 Lakhs</SelectItem>
                    <SelectItem value="7L-8L">7 Lakhs - 8 Lakhs</SelectItem>
                    <SelectItem value=">8L">More than 8 Lakhs</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Date_of_Birth"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of Birth*</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                      >
                        {field.value ? format(field.value, "PPP") : "Pick a date"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
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
            name="Place_of_Birth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Place of Birth</FormLabel>
                <FormControl>
                  <Input placeholder="Enter place of birth" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Admission_Date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Admission Date*</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                      >
                        {field.value ? format(field.value, "PPP") : "Pick a date"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date()}
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
            name="Mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter mobile number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Course_ID"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course ID*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter course ID" {...field} />
                </FormControl>
                <FormDescription>3-character course code (e.g., CSE, ECE, ME)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="Present_Address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Present Address</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter your present address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="Permanent_Address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Permanent Address</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter your permanent address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="hidden">
          Save
        </Button>
      </form>
    </Form>
  )
}
