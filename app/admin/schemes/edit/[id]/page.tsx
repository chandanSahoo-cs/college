"use client";

import { getSchemeById, updateSchemeById } from "@/action/scheme.action";
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
import { ArrowLeft, GraduationCap, Home } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  course_id: z.string().min(1, "Course ID is required"),
  acad_year: z.coerce.number().min(2000, "Year must be valid"),
  semester_annual: z.enum(["0", "1"]),
  total_semester_annual: z.coerce.number().min(1),
  min_duration_in_years: z.coerce.number().min(1),
  max_duration_in_years: z.coerce.number().min(1),
  min_credits: z.coerce.number().min(1),
  max_credits: z.coerce.number().min(1),
  university_school: z.string().min(1),
  regulatory_body_name: z.string().optional(),
  regulatory_body_shortname: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditSchemePage() {
  const { id } = useParams();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      course_id: "",
      acad_year: 2024,
      semester_annual: "1",
      total_semester_annual: 8,
      min_duration_in_years: 4,
      max_duration_in_years: 6,
      min_credits: 160,
      max_credits: 200,
      university_school: "",
      regulatory_body_name: "",
      regulatory_body_shortname: "",
    },
  });

  useEffect(() => {
    const fetchScheme = async () => {
      try {
        const scheme = await getSchemeById(id as string);
        if (scheme) {
          form.reset({
            course_id: scheme.course_id,
            acad_year: scheme.acad_year,
            semester_annual: scheme.semester_annual.toString() as "0" | "1",
            total_semester_annual: scheme.total_semester_annual,
            min_duration_in_years: scheme.min_duration_in_years,
            max_duration_in_years: scheme.max_duration_in_years,
            min_credits: scheme.min_credits,
            max_credits: scheme.max_credits,
            university_school: scheme.university_school,
            regulatory_body_name: scheme.regulatory_body_name || "",
            regulatory_body_shortname: scheme.regulatory_body_shortname || "",
          });
        }
      } catch (error) {
        toast.error("Failed to load scheme.");
        console.error(error);
      }
    };

    fetchScheme();
  }, [id, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      const updateData = {
        ...values,
        semester_annual: Number(values.semester_annual),
      };
      await updateSchemeById(id as string, updateData);
      toast.success("Scheme updated successfully.");
      router.push("/admin/schemes");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update scheme.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#0c4da2] text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <GraduationCap className="h-6 w-6 mr-2" />
            <h1 className="text-xl font-bold">BPIT - Edit Course Scheme</h1>
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
            <CardTitle>Edit Course Scheme</CardTitle>
            <CardDescription>
              Modify course scheme details below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6">
                {/* Course ID and Academic Year */}
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
                    name="acad_year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Academic Year*</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 2024" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Duration & System */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="min_duration_in_years"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Duration*</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
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
                        <FormLabel>Max Duration*</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
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
                        <FormLabel>System*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}>
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

                {/* Semesters and Credits */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="total_semester_annual"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Semesters/Annual*</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="min_credits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Credits*</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
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
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* University + Regulatory Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="university_school"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>University School*</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., USICT" {...field} />
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
                        <FormLabel>Regulatory Body (Short)</FormLabel>
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
                  name="regulatory_body_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Regulatory Body Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="All India Council for Technical Education"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4">
                  <Link href="/admin/schemes">
                    <Button variant="outline">Cancel</Button>
                  </Link>
                  <Button type="submit">Update Scheme</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
