"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GraduationCap, Home, ArrowLeft } from "lucide-react"

const formSchema = z.object({
  Paper_ID: z.string().min(1, "Paper ID is required").max(6),
  Scheme_ID: z.string().min(1, "Scheme ID is required").max(12),
  Paper_Code: z.string().min(1, "Paper code is required").max(10),
  Paper_Name: z.string().min(1, "Paper name is required").max(100),
  Credits: z
    .string()
    .min(1, "Credits is required")
    .transform((val) => Number.parseInt(val))
    .refine((val) => val >= 0 && val <= 9, "Credits must be between 0 and 9"),
  Type: z.enum(["1", "0"], {
    required_error: "Type is required",
  }),
  Exam: z.enum(["1", "0"], {
    required_error: "Exam type is required",
  }),
  Mode: z.enum(["1", "0"], {
    required_error: "Mode is required",
  }),
  Paper_Group: z.string().max(5).optional(),
  Paper_Sub_Group: z.string().max(5).optional(),
  Kind: z.enum(["1", "0"], {
    required_error: "Kind is required",
  }),
  Minor_Max_Marks: z
    .string()
    .min(1, "Minor max marks is required")
    .transform((val) => Number.parseInt(val))
    .refine((val) => val >= 0 && val <= 999, "Marks must be between 0 and 999"),
  Major_Max_Marks: z
    .string()
    .min(1, "Major max marks is required")
    .transform((val) => Number.parseInt(val))
    .refine((val) => val >= 0 && val <= 999, "Marks must be between 0 and 999"),
  Pass_Marks: z
    .string()
    .min(1, "Pass marks is required")
    .transform((val) => Number.parseInt(val))
    .refine((val) => val >= 0 && val <= 999, "Marks must be between 0 and 999"),
})

type FormValues = z.infer<typeof formSchema>

export default function NewSubjectPage() {
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Paper_ID: "",
      Scheme_ID: "",
      Paper_Code: "",
      Paper_Name: "",
      Credits: "",
      Type: undefined,
      Exam: undefined,
      Mode: undefined,
      Paper_Group: "",
      Paper_Sub_Group: "",
      Kind: undefined,
      Minor_Max_Marks: "",
      Major_Max_Marks: "",
      Pass_Marks: "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      // Calculate total marks
      const totalMarks = values.Minor_Max_Marks + values.Major_Max_Marks

      // Validate pass marks against total marks
      if (values.Pass_Marks > totalMarks) {
        form.setError("Pass_Marks", {
          message: "Pass marks cannot exceed total marks",
        })
        return
      }

      const subjectData = {
        ...values,
        Total_Max_Marks: totalMarks,
      }

      // Here you would typically send the data to your backend
      console.log("Subject data:", subjectData)

      // Show success message and redirect
      alert("Subject added successfully!")
      router.push("/admin/subjects")
    } catch (error) {
      console.error("Error adding subject:", error)
      alert("Error adding subject. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0c4da2] text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <GraduationCap className="h-6 w-6 mr-2" />
            <h1 className="text-xl font-bold">BPIT - Add New Subject</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/subjects">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-[#0c4da2]">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Subjects
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-[#0c4da2]">
                <Home className="h-4 w-4 mr-2" /> Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Add New Subject</CardTitle>
            <CardDescription>Create a new subject in the subject master</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="Paper_ID"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Paper ID*</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., CS101" {...field} />
                        </FormControl>
                        <FormDescription>Unique paper identifier (max 6 chars)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="Paper_Code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Paper Code*</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., CS101" {...field} />
                        </FormControl>
                        <FormDescription>Official paper code</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="Scheme_ID"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Scheme ID*</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select scheme" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CSE2023001">CSE2023001 - CSE Scheme 2023</SelectItem>
                            <SelectItem value="ECE2023001">ECE2023001 - ECE Scheme 2023</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="Paper_Name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paper Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Programming Fundamentals" {...field} />
                      </FormControl>
                      <FormDescription>Full name of the subject</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <FormField
                    control={form.control}
                    name="Credits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Credits*</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="4" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="Type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type*</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">Theory</SelectItem>
                            <SelectItem value="0">Practical</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="Exam"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exam*</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select exam" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">UES</SelectItem>
                            <SelectItem value="0">NUES</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="Mode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mode*</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select mode" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">Compulsory</SelectItem>
                            <SelectItem value="0">Elective</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="Paper_Group"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Paper Group</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., CORE" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="Paper_Sub_Group"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Paper Sub Group</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., CS" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="Kind"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kind*</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select kind" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">Mandatory</SelectItem>
                            <SelectItem value="0">Droppable</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <FormField
                    control={form.control}
                    name="Minor_Max_Marks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minor Max Marks*</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="30" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="Major_Max_Marks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Major Max Marks*</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="70" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="Pass_Marks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pass Marks*</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="40" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-end">
                    <div className="text-sm text-gray-600">
                      <div className="font-medium">Total Marks</div>
                      <div className="text-lg">
                        {Number.parseInt(form.watch("Minor_Max_Marks") || "0") +
                          Number.parseInt(form.watch("Major_Max_Marks") || "0") || "0"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Link href="/admin/subjects">
                    <Button variant="outline">Cancel</Button>
                  </Link>
                  <Button type="submit">Add Subject</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
