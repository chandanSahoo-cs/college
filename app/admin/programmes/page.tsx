"use server";

import { getAllProgrammes } from "@/action/programmes.action";
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
import { useState } from "react";
import SearchBar from "./_components/SearchBar";

// Convert Prisma data to match our UI format
const formatProgrammeData = (programme: any) => ({
  Prog_ID: programme.prog_id,
  Prog_Name: programme.prog_name,
  Prog_Short_Name: programme.prog_short_name,
  Regulatory_Body_Name: programme.regulatory_body_name,
  Regulatory_Body_ShortName: programme.regulatory_body_shortname,
  University_School: programme.university_school,
  Semester_Annual: programme.semester_annual,
  Min_Duration_in_years: programme.min_duration_in_years,
  Max_Duration_in_years: programme.max_duration_in_years,
});

export type ProgrammesType =
  | {
      Prog_ID: any;
      Prog_Name: any;
      Prog_Short_Name: any;
      Regulatory_Body_Name: any;
      Regulatory_Body_ShortName: any;
      University_School: any;
      Semester_Annual: any;
      Min_Duration_in_years: any;
      Max_Duration_in_years: any;
    }[]
  | undefined;

export default async function ProgrammesPage() {
  try {
    const programmes = await getAllProgrammes();
    const formattedProgrammes = programmes?.map(formatProgrammeData);
    // const [formattedProgrammes, setFormattedProgrammes] =
    //   useState<ProgrammesType>(undefined);
    // const [isLoading, setIsLoading] = useState(false);

    // useEffect(() => {
    //   const fetchProgrammes = async () => {
    //     setIsLoading(true);
    //     try {
    //       const data =
    //       setFormattedProgrammes(programmes);
    //     } catch (error) {
    //       console.error("Error fetching programmes:", error);
    //     } finally {
    //       setIsLoading(false);
    //     }
    //   };
    //   fetchProgrammes();
    // }, []);

    // if (isLoading) {
    //   return <Loader message="Loading programmes" />;
    // }

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-[#0c4da2] text-white py-4 px-6 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <GraduationCap className="h-6 w-6 mr-2" />
              <h1 className="text-xl font-bold">
                BPIT - Programmes Management
              </h1>
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
        <main className="container mx-auto py-8 flex gap-4 w-full ">
          <Card className="w-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">
                    Academic Programmes
                  </CardTitle>
                  <CardDescription>
                    Manage all academic programmes offered by the institute
                  </CardDescription>
                </div>
                <Link href="/admin/programmes/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" /> Add Programme
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <SearchBar programmes={formattedProgrammes} />
              <Badge variant="outline">
                Total: {formattedProgrammes?.length}
              </Badge>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error fetching programmes:", error);
  }
}
