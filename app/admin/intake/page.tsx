"use client";

import { GraduationCap, Home, Plus } from "lucide-react";
import Link from "next/link";

import { getAllCourseIntakes } from "@/action/courseIntake.action";
import Loader from "@/app/loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import IntakeSearchBar from "../intake/components/IntakeSearchBar";

export type IntakesType = {
  Course_ID: string;
  Course_Name: string; // optional chaining if included
  Acad_Year: number;
  Intake: number;
};

// Format intake data for search component
const formatIntakeData = (intake: any) => ({
  Course_ID: intake.course_id,
  Course_Name: intake.course?.course_name ?? "", // optional chaining if included
  Acad_Year: intake.acad_year,
  Intake: intake.intake,
});

export default function CourseIntakesPage() {
  try {
    const [formattedIntakes, setFormattedIntakes] = useState<IntakesType[]>();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const fetchCourseIntakes = async () => {
        setIsLoading(true);
        try {
          const data = await getAllCourseIntakes();
          const intake = data?.map(formatIntakeData);
          setFormattedIntakes(intake);
        } catch (error) {
          console.error("Error fetching programmes:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchCourseIntakes();
    }, []);

    if (isLoading) {
      return <Loader message="Loading course intake..." />;
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
                  className="bg-white/10 text-white border-white/20 hover:bg-white hover:text-[#0c4da2] hover:border-white transition-all duration-200 backdrop-blur-sm font-medium">
                  Admin Dashboard
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
                <Link href="/admin/intake/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" /> Add Intake
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <IntakeSearchBar intakes={formattedIntakes!} />
              <Badge variant="outline">Total: {formattedIntakes?.length}</Badge>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error fetching intakes:", error);
  }
}
