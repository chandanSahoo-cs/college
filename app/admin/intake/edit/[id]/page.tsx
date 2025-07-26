"use client";

import {
  getCourseIntakeById,
  updateCourseIntake,
} from "@/action/courseIntake.action";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, GraduationCap, Home } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  course_id: z.string().min(1, "Course ID is required"),
  acad_year: z.coerce.number().min(2000, "Enter a valid academic year"),
  intake: z.coerce.number().min(1, "Intake must be at least 1"),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditIntakePage() {
  console.log("Intake");
  const params = useParams();
  const course_id = params.id;
  const searchParams = useSearchParams();
  const acad_year = searchParams.get("acad_year");
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      course_id: "",
      acad_year: 0,
      intake: 0,
    },
  });

  useEffect(() => {
    if (course_id && acad_year) handleFetchIntake();
  }, [course_id, acad_year]);

  const handleFetchIntake = async () => {
    try {
      const intake = await getCourseIntakeById(
        course_id as string,
        Number(acad_year)
      );

      console.log("intake: ", intake);
      if (intake) {
        form.reset({
          course_id: intake.course_id,
          acad_year: intake.acad_year,
          intake: intake.intake,
        });
      }
    } catch (error) {
      toast.error("Error fetching intake record");
      console.error("Fetch error:", error);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      await updateCourseIntake(course_id as string, Number(acad_year), {
        intake: values.intake,
      });
      toast.success("Intake updated successfully!");
      router.push("/admin/intake");
    } catch (error) {
      toast.error("Failed to update intake");
      console.error("Update error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#0c4da2] text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <GraduationCap className="h-6 w-6 mr-2" />
            <h1 className="text-xl font-bold">BPIT - Edit Intake</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/intake">
              <Button
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-[#0c4da2]">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Intake
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-[#0c4da2]">
                <Home className="h-4 w-4 mr-2" /> Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Edit Intake Record</CardTitle>
            <CardDescription>Update the intake for a course</CardDescription>
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
                      <FormLabel>Course ID</FormLabel>
                      <FormControl>
                        <Input disabled {...field} />
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
                      <FormLabel>Academic Year</FormLabel>
                      <FormControl>
                        <Input disabled {...field} />
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
                      <FormLabel>Intake*</FormLabel>
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
                  <Button type="submit">Update Intake</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
