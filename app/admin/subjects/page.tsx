"use server";

import { getAllSubjects } from "@/action/subject.action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Home, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import SubjectSearchBar from "./components/SubjectSearchBar";

const formatSubjectData = (subject: any) => ({
  paper_id: subject.paper_id,
  scheme_id: subject.scheme_id,
  paper_code: subject.paper_code,
  paper_name: subject.paper_name,
  credits: subject.credits,
  type: subject.type,
  exam: subject.exam,
  mode: subject.mode,
  paper_group: subject.paper_group,
  paper_sub_group: subject.paper_sub_group,
  kind: subject.kind,
  minor_max_marks: subject.minor_max_marks,
  major_max_marks: subject.major_max_marks,
  total_max_marks: subject.total_max_marks,
  pass_marks: subject.pass_marks,
});

export default async function SubjectsPage() {
  try {
    const subjects = await getAllSubjects();
    const formattedSubjects = subjects?.map(formatSubjectData);

    if (!formattedSubjects || formattedSubjects.length === 0) {
      redirect("/admin/subjects/new");
    }

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-[#0c4da2] text-white py-4 px-6 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <BookOpen className="h-6 w-6 mr-2" />
              <h1 className="text-xl font-bold">BPIT - Subjects Management</h1>
            </div>
            <div className="flex gap-2">
              <Link href="/admin">
                <Button
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-[#0c4da2]">
                  Admin Dashboard
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

        {/* Main Content */}
        <main className="container mx-auto py-8 flex gap-4 w-full">
          <Card className="w-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">Academic Subjects</CardTitle>
                  <CardDescription>
                    Manage all academic subjects offered in various schemes
                  </CardDescription>
                </div>
                <Link href="/admin/subjects/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" /> Add Subject
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <SubjectSearchBar subjects={formattedSubjects} />
              <Badge variant="outline">Total: {formattedSubjects.length}</Badge>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error fetching subjects:", error);
    redirect("/admin/subjects/new");
  }
}
