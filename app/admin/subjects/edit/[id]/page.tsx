"use client";

import { getSubjectById, updateSubjectById } from "@/action/subject.action";
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
import { ArrowLeft, BookOpen, Home } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  paper_id: z.string().min(1, "Paper ID is required"),
  scheme_id: z.string().min(1, "Scheme ID is required"),
  paper_code: z.string().min(1, "Paper code is required"),
  paper_name: z.string().min(1, "Paper name is required"),
  credits: z.coerce.number().min(0).max(30),
  type: z.coerce.number(),
  exam: z.coerce.number(),
  mode: z.coerce.number(),
  paper_group: z.string().optional(),
  paper_sub_group: z.string().optional(),
  kind: z.coerce.number(),
  minor_max_marks: z.coerce.number(),
  major_max_marks: z.coerce.number(),
  total_max_marks: z.coerce.number(),
  pass_marks: z.coerce.number(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditSubjectPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const scheme = searchParams.get("scheme") as string;

  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paper_id: "",
      scheme_id: "",
      paper_code: "",
      paper_name: "",
      credits: 0,
      type: 0,
      exam: 0,
      mode: 0,
      paper_group: "",
      paper_sub_group: "",
      kind: 0,
      minor_max_marks: 0,
      major_max_marks: 0,
      total_max_marks: 0,
      pass_marks: 0,
    },
  });

  useEffect(() => {
    handleFetchSubject();
  }, [id, scheme]);

  const handleFetchSubject = async () => {
    try {
      const subject = await getSubjectById(id, scheme);
      if (subject) {
        const sanitized = {
          ...subject,
          paper_group: subject.paper_group ?? undefined,
          paper_sub_group: subject.paper_sub_group ?? undefined,
        };
        form.reset(sanitized);
      }
    } catch (error) {
      toast.error("Error fetching subject");
      console.error("Fetch error:", error);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const normalizedValues = {
        ...values,
        paper_group: values.paper_group || undefined,
        paper_sub_group: values.paper_sub_group || undefined,
      };

      await updateSubjectById(id, scheme, normalizedValues);
      toast.success("Subject updated successfully!");
      router.push("/admin/subjects");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update subject");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#0c4da2] text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <BookOpen className="h-6 w-6 mr-2" />
            <h1 className="text-xl font-bold">BPIT - Edit Subject</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/subjects">
              <Button
                variant="outline"
                className="bg-white/10 text-white border-white/20 hover:bg-white hover:text-[#0c4da2] hover:border-white transition-all duration-200 backdrop-blur-sm font-medium">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Subjects
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
            <CardTitle className="text-2xl">Edit Subject</CardTitle>
            <CardDescription>
              Modify subject details for the academic scheme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Field-by-field rendering starts here */}

                <FormField
                  disabled
                  control={form.control}
                  name="paper_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paper ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled
                  control={form.control}
                  name="scheme_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scheme ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paper_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paper Code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paper_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paper Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="credits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credits</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="exam"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exam</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mode</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paper_group"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paper Group</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paper_sub_group"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paper Sub Group</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="kind"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kind</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="minor_max_marks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minor Max Marks</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="major_max_marks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Major Max Marks</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="total_max_marks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Max Marks</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pass_marks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pass Marks</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit/Cancel Buttons */}
                <div className="md:col-span-2 flex justify-end gap-4">
                  <Link href="/admin/subjects">
                    <Button variant="outline">Cancel</Button>
                  </Link>
                  <Button type="submit">Update Subject</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
