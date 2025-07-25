"use client";

import {
  getProgrammeById,
  updateProgrammeById,
} from "@/action/programmes.action";
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
  prog_id: z.string().min(1, "Program ID is required"),
  prog_name: z.string().min(1, "Program name is required"),
  prog_short_name: z.string().min(1, "Program short name is required"),
  university_school: z.string().min(1, "University/School is required"),
  semester_annual: z.enum(["0", "1"]),
  min_duration_in_years: z.coerce
    .number()
    .min(1, "Minimum duration is required")
    .max(99, "Duration must be between 1 and 99 years"),
  max_duration_in_years: z.coerce
    .number()
    .min(1, "Maximum duration is required")
    .max(99, "Duration must be between 1 and 99 years"),
  regulatory_body_name: z.string().optional(),
  regulatory_body_shortname: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewProgrammePage() {
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    handleFetchProgrammes();
  }, [id]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prog_id: "",
      prog_name: "",
      prog_short_name: "",
      regulatory_body_name: "",
      regulatory_body_shortname: "",
      university_school: "",
      semester_annual: undefined,
      min_duration_in_years: 0,
      max_duration_in_years: 0,
    },
  });

  const handleFetchProgrammes = async () => {
    try {
      const programme = await getProgrammeById(id as string);
      if (programme) {
        form.reset({
          prog_id: programme.prog_id,
          prog_name: programme.prog_name,
          prog_short_name: programme.prog_short_name,
          university_school: programme.university_school,
          semester_annual: programme.semester_annual.toString() as "0" | "1",
          min_duration_in_years: programme.min_duration_in_years,
          max_duration_in_years: programme.max_duration_in_years,
          regulatory_body_name: programme.regulatory_body_name || "",
          regulatory_body_shortname: programme.regulatory_body_shortname || "",
        });
      }
    } catch (error) {
      toast.error("Error fetching programme");
      console.log("error fetching: ", error);
    }
  };

  const router = useRouter();

  const onSubmit = async (values: FormValues) => {
    try {
      const updateData = {
        ...values,
        semester_annual: Number(values.semester_annual),
      };
      await updateProgrammeById(id as string, updateData);
      toast.success("Programme updated successfully!");
      router.push("/admin/programmes");
    } catch (error) {
      console.error("Error updating programme:", error);
      toast.error("Error updating programme. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0c4da2] text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <GraduationCap className="h-6 w-6 mr-2" />
            <h1 className="text-xl font-bold">BPIT - Edit Programme</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/programmes">
              <Button
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-[#0c4da2]">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Programmes
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
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Edit Programme</CardTitle>
            <CardDescription>
              Edit an existing academic programme for the institute
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
                    name="prog_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Programme ID*</FormLabel>
                        <FormControl>
                          <Input
                            disabled
                            placeholder="e.g., BTECH001"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="prog_short_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., B.Tech" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="prog_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Programme Name*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Bachelor of Technology"
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
                    name="regulatory_body_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Regulatory Body Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., All India Council for Technical Education"
                            {...field}
                          />
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                  <FormField
                    control={form.control}
                    name="min_duration_in_years"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Duration (Years)*</FormLabel>
                        <FormControl>
                          <Input placeholder="4" {...field} />
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
                          <Input placeholder="6" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="semester_annual"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>System Type*</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}>
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

                <div className="flex justify-end space-x-4">
                  <Link href="/admin/programmes">
                    <Button variant="outline">Cancel</Button>
                  </Link>
                  <Button type="submit">Update Programme</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
