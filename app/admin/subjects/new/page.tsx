"use client";

import { getAllSchemes } from "@/action/scheme.action";
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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [schemes, setSchemes] = useState<{ scheme_id: string }[]>([]);

  // Fetch programmes on component mount
  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const data = await getAllSchemes();
        if (data) {
          setSchemes(data);
        }
      } catch (error) {
        console.error("Failed to fetch schemes:", error);
        toast.error("Failed to load scheme options");
      }
    };

    fetchSchemes();
  }, []);

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
                {Object.keys(formSchema.shape).map((key) => {
                  if (key == "scheme_id") {
                    return (
                      <FormField
                        key={key}
                        control={form.control}
                        name={key as keyof FormValues}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Scheme ID*</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value?.toString()}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select programme" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {schemes.map((scheme) => (
                                  <SelectItem
                                    key={scheme.scheme_id}
                                    value={scheme.scheme_id}>
                                    {`${scheme.scheme_id}`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    );
                  }
                  return (
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
                  );
                })}
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
