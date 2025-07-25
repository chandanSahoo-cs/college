"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GraduationCap, Home, ArrowLeft } from "lucide-react"

const formSchema = z.object({
  course_id: z.string().min(1, "Course ID is required").max(3),
  course_name: z.string().min(1, "Course name is required").max(100),
  course_short_name: z.string().min(1, "Short name is required").max(20),
  prog_id: z.string().min(1, "Programme ID is required").max(10),
  semester_annual: z.enum(["1", "0"], {
    required_error: "System type is required",
  }),
  min_duration_in_years: z.coerce
    .string()
    .min(1, "Minimum duration is required")
    .refine((val) => Number(val) > 0 && Number(val) <= 99, "Duration must be between 1 and 99 years"),
  max_duration_in_years: z.coerce
    .string()
    .min(1, "Maximum duration is required")
    .refine((val) => Number(val) > 0 && Number(val) <= 99, "Duration must be between 1 and 99 years"),
  total_semester_annual: z.coerce
    .string()
    .min(1, "Total semesters/years is required")
    .refine((val) => Number(val) > 0 && Number(val) <= 99, "Must be between 1 and 99"),
})

type FormValues = z.infer<typeof formSchema>

export default function NewCoursePage() {
  const router = useRouter()

  const form = useForm<FormValues>({
    
    resolver: zodResolver(formSchema),
    defaultValues: {
      course_id: "",
      course_name: "",
      course_short_name: "",
      prog_id: "",
      semester_annual: undefined,
      min_duration_in_years: "1",
      max_duration_in_years: "1",
      total_semester_annual: "1",
    },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      // Here you would typically send the data to your backend
      console.log("Course data:", values)

      // Show success message and redirect
      alert("Course added successfully!")
      router.push("/admin/courses")
    } catch (error) {
      console.error("Error adding course:", error)
      alert("Error adding course. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0c4da2] text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <GraduationCap className="h-6 w-6 mr-2" />
            <h1 className="text-xl font-bold">BPIT - Add New Course</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/courses">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-[#0c4da2]">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Courses
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
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Add New Course</CardTitle>
            <CardDescription>Create a new course under an existing programme</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="course_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course ID*</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., CSE" {...field} />
                        </FormControl>
                        
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="course_short_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., CSE" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="course_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Computer Science and Engineering" {...field} />
                      </FormControl>
                        <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="prog_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Programme ID*</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select programme" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="BTECH001">BTECH001 - Bachelor of Technology</SelectItem>
                            <SelectItem value="MCA001">MCA001 - Master of Computer Applications</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="semester_annual"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>System Type*</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select system type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">Semester System</SelectItem>
                            <SelectItem value="0">Annual System</SelectItem>
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
                    name="min_duration_in_years"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Duration (Years)*</FormLabel>
                        <FormControl>
                          <Input type="string" placeholder="4" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="max_duration_in_years"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Duration (Years)*</FormLabel>
                        <FormControl>
                          <Input type="string" placeholder="6" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="total_semester_annual"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Semesters*</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="8" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Link href="/admin/courses">
                    <Button variant="outline">Cancel</Button>
                  </Link>
                  <Button type="submit">Add Course</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
