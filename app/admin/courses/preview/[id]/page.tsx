"use client";

import { getCourseById } from "@/action/courses.action";
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
  BookOpen,
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
}

interface Course {
  course_id: string;
  course_name: string;
  course_short_name: string;
  prog_id: string;
  semester_annual: number;
  min_duration_in_years: number;
  max_duration_in_years: number;
  total_semester_annual: number;
  programme?: Programme;
  created_at?: string;
  updated_at?: string;
}

export default function CourseDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const courseData = await getCourseById(id);
        if (!courseData) {
          toast.error("Course not found");
          return;
        }
        setCourse(courseData as Course);
      } catch (err) {
        console.error("Failed to load course:", err);
        toast.error("Error fetching course details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (isLoading) {
    return <Loader message="Loading course details..." />;
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-[#0c4da2] text-white py-4 px-6 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <BookOpen className="h-6 w-6 mr-2" />
              <h1 className="text-xl font-bold">BPIT - Course Details</h1>
            </div>
            <div className="flex gap-2">
              <Link href="/admin/courses">
                <Button
                  variant="outline"
                  className="bg-white/10 text-white border-white/20 hover:bg-white hover:text-[#0c4da2] hover:border-white transition-all duration-200 backdrop-blur-sm font-medium">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back to Courses
                </Button>
              </Link>
            </div>
          </div>
        </header>
        <div className="container mx-auto py-8 px-4">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-20">
              <div className="text-gray-400 mb-4">
                <BookOpen className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Course Not Found
              </h3>
              <p className="text-gray-600 mb-6">
                The course you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/admin/courses">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Courses
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
            <BookOpen className="h-6 w-6 mr-2" />
            <h1 className="text-xl font-bold">Course Details</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/courses">
              <Button
                variant="outline"
                className="bg-white/10 text-white border-white/20 hover:bg-white hover:text-[#0c4da2] hover:border-white transition-all duration-200 backdrop-blur-sm font-medium">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Courses
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
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Course Header Card */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-3xl font-bold text-gray-900">
                      {course.course_name}
                    </CardTitle>
                    <Badge variant="secondary" className="text-sm">
                      {course.course_short_name}
                    </Badge>
                  </div>
                  <CardDescription className="text-lg">
                    Course ID:{" "}
                    <span className="font-semibold text-gray-700">
                      {course.course_id}
                    </span>
                  </CardDescription>
                </div>
                <Link href={`/admin/courses/edit/${course.course_id}`}>
                  <Button className="bg-[#0c4da2] hover:bg-[#0a3d82]">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Course
                  </Button>
                </Link>
              </div>
            </CardHeader>
          </Card>

          {/* Course Details Grid */}
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
                      Full Course Name
                    </label>
                    <p className="text-gray-900 font-medium">
                      {course.course_name}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Short Name
                    </label>
                    <p className="text-gray-900 font-medium">
                      {course.course_short_name}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Course ID
                    </label>
                    <p className="text-gray-900 font-medium font-mono bg-gray-50 px-2 py-1 rounded">
                      {course.course_id}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Programme Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <GraduationCap className="h-5 w-5 text-green-600" />
                  Programme Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Programme
                    </label>
                    <p className="text-gray-900 font-medium">
                      {course.programme?.prog_name ||
                        "Programme information not available"}
                    </p>
                    {course.programme?.prog_short_name && (
                      <p className="text-sm text-gray-600">
                        ({course.programme.prog_short_name})
                      </p>
                    )}
                  </div>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Programme ID
                    </label>
                    <p className="text-gray-900 font-medium font-mono bg-gray-50 px-2 py-1 rounded">
                      {course.prog_id}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Duration & Structure */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-orange-600" />
                  Duration & Structure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Duration Range
                    </label>
                    <p className="text-gray-900 font-medium">
                      {course.min_duration_in_years} -{" "}
                      {course.max_duration_in_years} years
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Total{" "}
                      {course.semester_annual === 0 ? "Semesters" : "Terms"}
                    </label>
                    <p className="text-gray-900 font-medium">
                      {course.total_semester_annual}
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
                      Term Type
                    </label>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          course.semester_annual === 0 ? "default" : "secondary"
                        }
                        className={
                          course.semester_annual === 0
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                        }>
                        {course.semester_annual === 0
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
                      {course.semester_annual === 0
                        ? `${course.total_semester_annual} semesters over ${course.min_duration_in_years}-${course.max_duration_in_years} years`
                        : `${course.total_semester_annual} annual terms over ${course.min_duration_in_years}-${course.max_duration_in_years} years`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  <p>Need to make changes to this course?</p>
                </div>
                <div className="flex gap-3">
                  <Link href="/admin/courses">
                    <Button variant="outline">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Courses
                    </Button>
                  </Link>
                  <Link href={`/admin/courses/edit/${course.course_id}`}>
                    <Button className="bg-[#0c4da2] hover:bg-[#0a3d82]">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Course
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
