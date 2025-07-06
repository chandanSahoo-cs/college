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

// Define the form schema based on the SQL schema
const formSchema = z.object({
  is_applying: z.enum(["yes", "no"], {
    required_error: "Please select an option",
  }),
  Agency: z.enum(["State Govt", "Central Govt", "Private Body"]).optional(),
  Reimbursement_Amount: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Number.parseFloat(val)), { message: "Amount must be a number" })
    .refine((val) => !val || Number.parseFloat(val) >= 0, { message: "Amount must be greater than or equal to 0" })
    .transform((val) => (val ? Number.parseFloat(val) : undefined)),
})

type FormValues = z.infer<typeof formSchema>

interface FeeReimbursementFormProps {
  data: any
  updateData: (data: any) => void
}

export default function FeeReimbursementForm({ data, updateData }: FeeReimbursementFormProps) {
  // Initialize the form with default values or existing data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      is_applying: data?.is_applying || undefined,
      Agency: data?.Agency || undefined,
      Reimbursement_Amount: data?.Reimbursement_Amount ? data.Reimbursement_Amount.toString() : "",
    },
  })

  // Watch for changes in the is_applying field
  const isApplying = form.watch("is_applying")

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
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Fee Reimbursement</h3>
          <p className="text-sm text-muted-foreground">
            If you are eligible for fee reimbursement from any government agency or private body, please provide the
            details below.
          </p>
        </div>

        <FormField
          control={form.control}
          name="is_applying"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Are you applying for fee reimbursement?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="yes" />
                    </FormControl>
                    <FormLabel className="font-normal">Yes, I am applying for fee reimbursement</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="no" />
                    </FormControl>
                    <FormLabel className="font-normal">No, I am not applying for fee reimbursement</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isApplying === "yes" && (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="Agency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reimbursement Agency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select agency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="State Govt">State Government</SelectItem>
                      <SelectItem value="Central Govt">Central Government</SelectItem>
                      <SelectItem value="Private Body">Private Body</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Reimbursement_Amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reimbursement Amount</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter amount" {...field} />
                  </FormControl>
                  <FormDescription>Enter the amount in INR that you expect to be reimbursed</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <Button type="submit" className="hidden">
          Save
        </Button>
      </form>
    </Form>
  )
}
