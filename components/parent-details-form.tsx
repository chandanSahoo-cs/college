"use client"

import { useEffect } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// Define the form schema based on the SQL schema
const formSchema = z.object({
  Father_Name: z.string().max(100).optional(),
  Father_Occupation: z.string().max(100).optional(),
  Father_Qualification: z.string().max(50).optional(),
  Father_Mobile: z.string().max(15).optional(),
  Father_Email: z.string().email("Invalid email address").max(100).optional().or(z.literal("")),
  Father_Office_Address: z.string().max(255).optional(),

  Mother_Name: z.string().max(100).optional(),
  Mother_Occupation: z.string().max(100).optional(),
  Mother_Qualification: z.string().max(50).optional(),
  Mother_Mobile: z.string().max(15).optional(),
  Mother_Email: z.string().email("Invalid email address").max(100).optional().or(z.literal("")),
  Mother_Office_Address: z.string().max(255).optional(),
})

type FormValues = z.infer<typeof formSchema>

interface ParentDetailsFormProps {
  data: any
  updateData: (data: any) => void
}

export default function ParentDetailsForm({ data, updateData }: ParentDetailsFormProps) {
  // Initialize the form with default values or existing data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Father_Name: data?.Father_Name || "",
      Father_Occupation: data?.Father_Occupation || "",
      Father_Qualification: data?.Father_Qualification || "",
      Father_Mobile: data?.Father_Mobile || "",
      Father_Email: data?.Father_Email || "",
      Father_Office_Address: data?.Father_Office_Address || "",

      Mother_Name: data?.Mother_Name || "",
      Mother_Occupation: data?.Mother_Occupation || "",
      Mother_Qualification: data?.Mother_Qualification || "",
      Mother_Mobile: data?.Mother_Mobile || "",
      Mother_Email: data?.Mother_Email || "",
      Mother_Office_Address: data?.Mother_Office_Address || "",
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Father's Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="Father_Name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Father's Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter father's name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Father_Occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Father's Occupation</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter father's occupation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Father_Qualification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Father's Qualification</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter father's qualification" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Father_Mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Father's Mobile</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter father's mobile number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Father_Email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Father's Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter father's email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="Father_Office_Address"
            render={({ field }) => (
              <FormItem className="mt-6">
                <FormLabel>Father's Office Address</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter father's office address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Mother's Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="Mother_Name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mother's Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter mother's name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Mother_Occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mother's Occupation</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter mother's occupation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Mother_Qualification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mother's Qualification</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter mother's qualification" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Mother_Mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mother's Mobile</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter mother's mobile number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Mother_Email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mother's Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter mother's email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="Mother_Office_Address"
            render={({ field }) => (
              <FormItem className="mt-6">
                <FormLabel>Mother's Office Address</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter mother's office address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="hidden">
          Save
        </Button>
      </form>
    </Form>
  )
}
