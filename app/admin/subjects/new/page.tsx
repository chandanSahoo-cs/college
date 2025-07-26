"use client";

import { addSubject } from "@/action/subject.action";
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
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  paper_id: z.string().min(1, "Paper ID is required"),
  scheme_id: z.string().min(1, "Scheme ID is required"),
  paper_code: z.string().min(1, "Paper code is required"),
  paper_name: z.string().min(1, "Paper name is required"),
  credits: z.coerce.number().min(1).max(30),
  type: z.coerce.number().int(),
  exam: z.coerce.number().int(),
  mode: z.coerce.number().int(),
  paper_group: z.string().optional(),
  paper_sub_group: z.string().optional(),
  kind: z.coerce.number().int(),
  minor_max_marks: z.coerce.number().int(),
  major_max_marks: z.coerce.number().int(),
  total_max_marks: z.coerce.number().int(),
  pass_marks: z.coerce.number().int(),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewSubjectPage() {
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

  const onSubmit = async (values: FormValues) => {
    try {
      await addSubject(values);
      toast.success("Subject added successfully!");
      router.push("/admin/subjects");
    } catch (error) {
      console.error("Error adding subject:", error);
      toast.error("Failed to add subject. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#0c4da2] text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <BookOpen className="h-6 w-6 mr-2" />
            <h1 className="text-xl font-bold">BPIT - Add New Subject</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/subjects">
              <Button
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-[#0c4da2]">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Subjects
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
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Add New Subject</CardTitle>
            <CardDescription>
              Fill in subject details and save it to the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.keys(formSchema.shape).map((key) => (
                  
                  <FormField
                    key={key}
                    control={form.control}
                    name={key as keyof FormValues}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {key
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (char) => char.toUpperCase())}
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <div className="col-span-2 flex justify-end space-x-4">
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
  );
}
