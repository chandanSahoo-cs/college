"use server";

import { GraduationCap, Home, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getAllCourseIntakes } from "@/action/courseIntake.action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import IntakeSearchBar from "../intake/components/IntakeSearchBar";

// Format intake data for search component
const formatIntakeData = (intake: any) => ({
  Course_ID: intake.course_id,
  Course_Name: intake.course?.course_name ?? "", // optional chaining if included
  Acad_Year: intake.acad_year,
  Intake: intake.intake,
});

export default async function CourseIntakesPage() {
  try {
    const intakes = await getAllCourseIntakes();
    const formattedIntakes = intakes?.map(formatIntakeData);

    if (!formattedIntakes || formattedIntakes.length === 0) {
      redirect("/admin/intakes/new");
    }

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-[#0c4da2] text-white py-4 px-6 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <GraduationCap className="h-6 w-6 mr-2" />
              <h1 className="text-xl font-bold">BPIT - Intake Management</h1>
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
                  <CardTitle className="text-2xl">Course Intakes</CardTitle>
                  <CardDescription>
                    Manage annual course intake records
                  </CardDescription>
                </div>
                <Link href="/admin/intakes/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" /> Add Intake
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <IntakeSearchBar intakes={formattedIntakes} />
              <Badge variant="outline">Total: {formattedIntakes.length}</Badge>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error fetching intakes:", error);
    redirect("/admin/intakes/new");
  }
}
