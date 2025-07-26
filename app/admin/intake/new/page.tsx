"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { addCourseIntake } from "@/action/courseIntake.action";
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
import { ArrowLeft, GraduationCap, Home } from "lucide-react";

const formSchema = z.object({
  course_id: z
    .string()
    .min(1, "Course ID is required")
    .max(3, "Max 3 characters"),
  acad_year: z.coerce.number().min(2000, "Enter a valid year"),
  intake: z.coerce.number().min(1, "Intake must be at least 1"),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewIntakePage() {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      course_id: "",
      acad_year: new Date().getFullYear(),
      intake: 60,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await addCourseIntake(values);
      toast.success("Course intake added successfully!");
      router.push("/admin/intake");
    } catch (error) {
      console.error("Error adding intake:", error);
      toast.error("Failed to add intake. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0c4da2] text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <GraduationCap className="h-6 w-6 mr-2" />
            <h1 className="text-xl font-bold">BPIT - Add New Course Intake</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/intake">
              <Button
                variant="outline"
                className="bg-white/10 text-white border-white/20 hover:bg-white hover:text-[#0c4da2] hover:border-white transition-all duration-200 backdrop-blur-sm font-medium">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Intake List
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
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Add Course Intake</CardTitle>
            <CardDescription>
              Specify course, academic year, and number of intakes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6">
                <FormField
                  control={form.control}
                  name="course_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course ID*</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., CS1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="acad_year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Academic Year*</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 2025"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="intake"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Intake Capacity*</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 60"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4">
                  <Link href="/admin/intake">
                    <Button variant="outline">Cancel</Button>
                  </Link>
                  <Button type="submit">Add Intake</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
