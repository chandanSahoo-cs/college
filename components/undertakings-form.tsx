"use client"

import { useEffect } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Define the form schema based on the SQL schema
const formSchema = z.object({
  AntiRagging_RefNo: z.string().min(1, "Anti-ragging reference number is required").max(50),
  Agreement_Date: z.date({
    required_error: "Agreement date is required",
  }),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
})

type FormValues = z.infer<typeof formSchema>

interface UndertakingsFormProps {
  data: any
  updateData: (data: any) => void
}

export default function UndertakingsForm({ data, updateData }: UndertakingsFormProps) {
  // Initialize the form with default values or existing data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      AntiRagging_RefNo: data?.AntiRagging_RefNo || "",
      Agreement_Date: data?.Agreement_Date ? new Date(data.Agreement_Date) : new Date(),
      acceptTerms: data?.acceptTerms || false,
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
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Undertakings</h3>
          <p className="text-sm text-muted-foreground">
            Please provide the required undertakings to complete your registration.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h4 className="font-medium">Anti-Ragging Undertaking</h4>
              <p className="text-sm text-muted-foreground">
                As per UGC regulations, it is mandatory to submit an anti-ragging undertaking. Please visit the
                <a
                  href="https://www.antiragging.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline ml-1"
                >
                  Anti-Ragging Portal
                </a>{" "}
                to generate your reference number.
              </p>
            </div>
          </CardContent>
        </Card>

        <FormField
          control={form.control}
          name="AntiRagging_RefNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Anti-Ragging Reference Number*</FormLabel>
              <FormControl>
                <Input placeholder="Enter reference number" {...field} />
              </FormControl>
              <FormDescription>
                Enter the reference number received after submitting the anti-ragging undertaking
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="Agreement_Date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Agreement Date*</FormLabel>
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

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h4 className="font-medium">Terms and Conditions</h4>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  By submitting this form, I hereby declare that all the information provided by me in this application
                  is true and correct to the best of my knowledge and belief.
                </p>
                <p>
                  I understand that providing any false information or suppression of any factual information would
                  render me liable to disciplinary action as may be deemed fit by the Institute.
                </p>
                <p>
                  I have read and understood all the rules and regulations of the Institute and agree to abide by them
                  during my course of study.
                </p>
                <p>
                  I also undertake to pay all the fees and other dues as prescribed by the Institute from time to time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <FormField
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>I accept the terms and conditions*</FormLabel>
                <FormDescription>You must accept the terms and conditions to proceed</FormDescription>
                <FormMessage />
              </div>
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
