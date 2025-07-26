"use server";

import { getAllSchemes } from "@/action/scheme.action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GraduationCap, Home, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import SchemeSearchBar from "./components/SchemeSearchBar";

// Convert Prisma scheme object to UI-friendly format
const formatSchemeData = (scheme: any) => ({
  scheme_id: scheme.scheme_id,
  course_id: scheme.course_id,
  acad_year: scheme.acad_year,
  semester_annual: scheme.semester_annual,
  min_duration_in_years: scheme.min_duration_in_years,
  max_duration_in_years: scheme.max_duration_in_years,
  total_semester_annual: scheme.total_semester_annual,
  min_credits: scheme.min_credits,
  max_credits: scheme.max_credits,
  university_school: scheme.university_school,
  regulatory_body_name: scheme.regulatory_body_name || "",
  regulatory_body_shortname: scheme.regulatory_body_shortname || "",
});

export default async function SchemesPage() {
  try {
    const schemes = await getAllSchemes();
    const formattedSchemes = schemes?.map(formatSchemeData);

    if (!formattedSchemes || formattedSchemes.length === 0) {
      redirect("/admin/schemes/new");
    }

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-[#0c4da2] text-white py-4 px-6 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <GraduationCap className="h-6 w-6 mr-2" />
              <h1 className="text-xl font-bold">BPIT - Course Schemes</h1>
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
                  <CardTitle className="text-2xl">Course Schemes</CardTitle>
                  <CardDescription>
                    View and manage all academic schemes mapped to courses.
                  </CardDescription>
                </div>
                <Link href="/admin/schemes/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" /> Add Scheme
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <SchemeSearchBar schemes={formattedSchemes} />
              <Badge variant="outline">Total: {formattedSchemes.length}</Badge>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error fetching schemes:", error);
    redirect("/admin/schemes/new");
  }
}
