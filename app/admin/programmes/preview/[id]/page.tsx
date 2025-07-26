"use client";

import { getProgrammeById } from "@/action/programmes.action";
import { Loader } from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Building,
  Calendar,
  Clock,
  Edit,
  GraduationCap,
  Hash,
  Home,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Types
interface Programme {
  prog_id: string;
  prog_name: string;
  prog_short_name: string;
  university_school: string;
  semester_annual: number;
  min_duration_in_years: number;
  max_duration_in_years: number;
  regulatory_body_name?: string;
  regulatory_body_shortname?: string;
  created_at?: string;
  updated_at?: string;
}

export default function ProgrammePreviewPage() {
  const params = useParams();
  const id = params.id as string;
  const [programme, setProgramme] = useState<Programme | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProgramme = async () => {
      try {
        setIsLoading(true);
        const programmeData = await getProgrammeById(id);
        if (!programmeData) {
          toast.error("Programme not found");
          return;
        }
        setProgramme(programmeData as Programme);
      } catch (err) {
        console.error("Failed to load programme:", err);
        toast.error("Error fetching programme details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgramme();
  }, [id]);

  if (isLoading) {
    return <Loader message="Loading programme details..." />;
  }

  if (!programme) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-[#0c4da2] text-white py-4 px-6 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <GraduationCap className="h-6 w-6 mr-2" />
              <h1 className="text-xl font-bold">BPIT - Programme Details</h1>
            </div>
            <div className="flex gap-2">
              <Link href="/admin/programmes">
                <Button
                  variant="outline"
                  className="bg-white/10 text-white border-white/20 hover:bg-white hover:text-[#0c4da2] hover:border-white transition-all duration-200 backdrop-blur-sm font-medium">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back to Programmes
                </Button>
              </Link>
            </div>
          </div>
        </header>
        <div className="container mx-auto py-8 px-4">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-20">
              <div className="text-gray-400 mb-4">
                <GraduationCap className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Programme Not Found
              </h3>
              <p className="text-gray-600 mb-6">
                The programme you're looking for doesn't exist or has been
                removed.
              </p>
              <Link href="/admin/programmes">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Programmes
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0c4da2] text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <GraduationCap className="h-6 w-6 mr-2" />
            <h1 className="text-xl font-bold">BPIT - Programme Details</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/programmes">
              <Button
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-[#0c4da2] bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Programmes
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-[#0c4da2] bg-transparent">
                <Home className="h-4 w-4 mr-2" /> Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Programme Header Card */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-3xl font-bold text-gray-900">
                      {programme.prog_name}
                    </CardTitle>
                    <Badge variant="secondary" className="text-sm">
                      {programme.prog_short_name}
                    </Badge>
                  </div>
                  <CardDescription className="text-lg">
                    Programme ID:{" "}
                    <span className="font-semibold text-gray-700">
                      {programme.prog_id}
                    </span>
                  </CardDescription>
                </div>
                <Link href={`/admin/programmes/edit/${programme.prog_id}`}>
                  <Button className="bg-[#0c4da2] hover:bg-[#0a3d82]">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Programme
                  </Button>
                </Link>
              </div>
            </CardHeader>
          </Card>

          {/* Programme Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Hash className="h-5 w-5 text-blue-600" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Full Programme Name
                    </label>
                    <p className="text-gray-900 font-medium">
                      {programme.prog_name}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Short Name
                    </label>
                    <p className="text-gray-900 font-medium">
                      {programme.prog_short_name}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Programme ID
                    </label>
                    <p className="text-gray-900 font-medium font-mono bg-gray-50 px-2 py-1 rounded">
                      {programme.prog_id}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Institution Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building className="h-5 w-5 text-green-600" />
                  Institution Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      University/School
                    </label>
                    <p className="text-gray-900 font-medium">
                      {programme.university_school}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Regulatory Body
                    </label>
                    {programme.regulatory_body_name ? (
                      <div>
                        <p className="text-gray-900 font-medium">
                          {programme.regulatory_body_name}
                        </p>
                        {programme.regulatory_body_shortname && (
                          <p className="text-sm text-gray-600">
                            ({programme.regulatory_body_shortname})
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">Not specified</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Duration Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-orange-600" />
                  Duration Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Duration Range
                    </label>
                    <p className="text-gray-900 font-medium">
                      {programme.min_duration_in_years} -{" "}
                      {programme.max_duration_in_years} years
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Minimum Duration
                    </label>
                    <p className="text-gray-900 font-medium">
                      {programme.min_duration_in_years} years
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Maximum Duration
                    </label>
                    <p className="text-gray-900 font-medium">
                      {programme.max_duration_in_years} years
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic System */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  Academic System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      System Type
                    </label>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          programme.semester_annual === 1
                            ? "default"
                            : "secondary"
                        }
                        className={
                          programme.semester_annual === 1
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                            : "bg-green-100 text-green-800 hover:bg-green-100"
                        }>
                        {programme.semester_annual === 1
                          ? "Semester System"
                          : "Annual System"}
                      </Badge>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Academic Structure
                    </label>
                    <p className="text-gray-900">
                      {programme.semester_annual === 1
                        ? `Semester-based programme spanning ${programme.min_duration_in_years}-${programme.max_duration_in_years} years`
                        : `Annual programme spanning ${programme.min_duration_in_years}-${programme.max_duration_in_years} years`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Programme Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Programme Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-blue-600">
                    {programme.prog_short_name}
                  </div>
                  <div className="text-sm text-gray-600">Programme Code</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-600">
                    {programme.min_duration_in_years ===
                    programme.max_duration_in_years
                      ? `${programme.min_duration_in_years}`
                      : `${programme.min_duration_in_years}-${programme.max_duration_in_years}`}
                  </div>
                  <div className="text-sm text-gray-600">Duration (Years)</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-600">
                    {programme.semester_annual === 1 ? "SEM" : "ANN"}
                  </div>
                  <div className="text-sm text-gray-600">System Type</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  <p>Need to make changes to this programme?</p>
                </div>
                <div className="flex gap-3">
                  <Link href="/admin/programmes">
                    <Button variant="outline">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Programmes
                    </Button>
                  </Link>
                  <Link href={`/admin/programmes/edit/${programme.prog_id}`}>
                    <Button className="bg-[#0c4da2] hover:bg-[#0a3d82]">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Programme
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
