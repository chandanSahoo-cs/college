"use client";

import {
  getAllProgrammes,
  getCourseById,
  updateCourse,
} from "@/action/courses.action";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, BookOpen, Home } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Programme = {
  prog_id: string;
  prog_name: string;
};

const formSchema = z.object({
  course_id: z.string().min(1, "Course ID is required"),
  course_name: z.string().min(1, "Course name is required"),
  course_short_name: z.string().min(1, "Course short name is required"),
  prog_id: z.string().min(1, "Programme is required"),
  semester_annual: z.enum(["0", "1"], {
    required_error: "Please select whether the course is semester or annual",
  }),
  min_duration_in_years: z.coerce
    .number()
    .min(1, "Minimum duration is required")
    .max(10, "Duration must be between 1 and 10 years"),
  max_duration_in_years: z.coerce
    .number()
    .min(1, "Maximum duration is required")
    .max(10, "Duration must be between 1 and 10 years"),
  total_semester_annual: z.coerce
    .number()
    .min(1, "Total semesters/terms is required")
    .max(20, "Total semesters/terms must be between 1 and 20"),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditCoursePage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      course_id: "",
      course_name: "",
      course_short_name: "",
      prog_id: "",
      semester_annual: undefined,
      min_duration_in_years: 1,
      max_duration_in_years: 4,
      total_semester_annual: 8,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch course data
        const course = await getCourseById(id);
        if (course) {
          form.reset({
            course_id: course.course_id,
            course_name: course.course_name,
            course_short_name: course.course_short_name,
            prog_id: course.prog_id,
            semester_annual: course.semester_annual.toString() as "0" | "1",
            min_duration_in_years: course.min_duration_in_years,
            max_duration_in_years: course.max_duration_in_years,
            total_semester_annual: course.total_semester_annual,
          });
        }

        // Fetch programmes for dropdown
        const programmesData = await getAllProgrammes();
        setProgrammes(programmesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error loading course data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      const updateData = {
        ...values,
        semester_annual: Number(values.semester_annual),
      };

      await updateCourse(id, updateData);
      toast.success("Course updated successfully!");
      router.push("/admin/courses");
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Error updating course. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0c4da2] text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <BookOpen className="h-6 w-6 mr-2" />
            <h1 className="text-xl font-bold">BPIT - Edit Course</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/courses">
              <Button
                variant="outline"
                className="bg-white/10 text-white border-white/20 hover:bg-white hover:text-[#0c4da2] hover:border-white transition-all duration-200 backdrop-blur-sm font-medium">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Courses
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
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Edit Course</CardTitle>
            <CardDescription>Update the course details below</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="course_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course ID*</FormLabel>
                        <FormControl>
                          <Input
                            disabled
                            placeholder="e.g., CS101"
                            {...field}
                          />
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
                          <Input placeholder="e.g., Intro to CS" {...field} />
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
                      <FormLabel>Full Course Name*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Introduction to Computer Science"
                          {...field}
                        />
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
                        <FormLabel>Programme*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a programme" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {programmes.map((programme) => (
                              <SelectItem
                                key={programme.prog_id}
                                value={programme.prog_id}>
                                {programme.prog_name}
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
                    name="semester_annual"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Term Type*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select term type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0">Semester</SelectItem>
                            <SelectItem value="1">Annual</SelectItem>
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
                          <Input type="number" min={1} max={10} {...field} />
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
                          <Input type="number" min={1} max={10} {...field} />
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
                        <FormLabel>
                          {form.watch("semester_annual") === "0"
                            ? "Total Semesters"
                            : "Total Terms"}
                          *
                        </FormLabel>
                        <FormControl>
                          <Input type="number" min={1} max={20} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/courses")}>
                    Cancel
                  </Button>
                  <Button type="submit">Update Course</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
