"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { getAllCourses } from "@/action/courses.action";
import { addScheme } from "@/action/scheme.action";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, GraduationCap, Home } from "lucide-react";
import { useEffect, useState } from "react";

const formSchema = z.object({
  scheme_id: z.string().min(1, "Scheme ID is required"),
  course_id: z.string().length(3, "Course ID must be 3 characters"),
  acad_year: z.coerce.number().int().min(2000, "Invalid year"),
  semester_annual: z.enum(["0", "1"]),
  min_duration_in_years: z.coerce.number().min(1).max(20),
  max_duration_in_years: z.coerce.number().min(1).max(20),
  total_semester_annual: z.coerce.number().min(1).max(20),
  min_credits: z.coerce.number().min(1).max(300),
  max_credits: z.coerce.number().min(1).max(300),
  regulatory_body_name: z.string().optional(),
  regulatory_body_shortname: z.string().optional(),
  university_school: z.string().min(1, "University/School is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewSchemePage() {
  const router = useRouter();

  const [courses, setCourses] = useState<
    { course_id: string; course_name: string }[]
  >([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { courses, total } = await getAllCourses();
        if (courses) {
          setCourses(courses);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        toast.error("Failed to load course options");
      }
    };

    fetchCourses();
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scheme_id: "",
      course_id: "",
      acad_year: new Date().getFullYear(),
      semester_annual: "1",
      min_duration_in_years: 0,
      max_duration_in_years: 0,
      total_semester_annual: 0,
      min_credits: 0,
      max_credits: 0,
      regulatory_body_name: "",
      regulatory_body_shortname: "",
      university_school: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const formatted = {
        ...values,
        semester_annual: Number(values.semester_annual),
      };
      await addScheme(formatted);
      toast.success("Scheme added successfully");
      router.push("/admin/schemes");
    } catch (err) {
      console.error("Error adding scheme:", err);
      toast.error("Failed to add scheme");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0c4da2] text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <GraduationCap className="h-6 w-6 mr-2" />
            <h1 className="text-xl font-bold">BPIT - Add New Scheme</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/schemes">
              <Button
                variant="outline"
                className="bg-white/10 text-white border-white/20 hover:bg-white hover:text-[#0c4da2] hover:border-white transition-all duration-200 backdrop-blur-sm font-medium">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Schemes
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                className="bg-white/10 text-white border-white/20 hover:bg-white hover:text-[#0c4da2] hover:border-white transition-all duration-200 backdrop-blur-sm font-medium">
                <Home className="h-4 w-4 mr-2" /> Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Add New Course Scheme</CardTitle>
            <CardDescription>
              Define a new academic scheme under a course
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="scheme_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Scheme ID*</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., SCHM2024" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="course_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course ID*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select programme" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {courses.map((course) => (
                              <SelectItem
                                key={course.course_id}
                                value={course.course_id}>
                                {`${course.course_id} - ${course.course_name}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="acad_year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Academic Year*</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 2025" {...field} />
                        </FormControl>
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
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">Semester</SelectItem>
                            <SelectItem value="0">Annual</SelectItem>
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
                          <Input placeholder="e.g., 4" {...field} />
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
                          <Input placeholder="e.g., 6" {...field} />
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
                        <FormLabel>Total Semesters/Annuals*</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 8" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="min_credits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Credits*</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 160" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="max_credits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Credits*</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 200" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="regulatory_body_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Regulatory Body Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., AICTE" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="regulatory_body_shortname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Regulatory Body Short Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., AICTE" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="university_school"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>University/School*</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., GGSIPU" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4">
                  <Link href="/admin/schemes">
                    <Button variant="outline">Cancel</Button>
                  </Link>
                  <Button type="submit">Add Scheme</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
