"use client";

import { getAllSchemes } from "@/action/scheme.action";
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
import { GraduationCap, Home, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import SchemeSearchBar from "./components/SchemeSearchBar";

export type SchemeType = {
  regulatory_body_name: string | null;
  regulatory_body_shortname: string | null;
  university_school: string;
  semester_annual: number;
  min_duration_in_years: number;
  max_duration_in_years: number;
  course_id: string;
  total_semester_annual: number;
  scheme_id: string;
  acad_year: number;
  min_credits: number;
  max_credits: number;
};

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

export default function SchemesPage() {
  try {
    const [formattedSchemes, setFormattedSchemes] = useState<SchemeType[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const fetchSchemes = async () => {
        setIsLoading(true);
        try {
          const data = await getAllSchemes();
          const schemes = data?.map(formatSchemeData);
          setFormattedSchemes(schemes);
        } catch (error) {
          console.error("Error fetching programmes:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchSchemes();
    }, []);

    if (isLoading) {
      return <Loader message="Loading courses schemes" />;
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
              <SchemeSearchBar schemes={formattedSchemes!} />
              <Badge variant="outline">Total: {formattedSchemes.length}</Badge>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error fetching schemes:", error);
  }
}
