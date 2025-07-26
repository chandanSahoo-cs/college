"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  Calendar,
  FileText,
  GraduationCap,
  Home,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0c4da2] text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <GraduationCap className="h-6 w-6 mr-2" />
            <h1 className="text-xl font-bold">BPIT Admin Dashboard</h1>
          </div>
          <Link href="/">
            <Button
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white hover:text-[#0c4da2] hover:border-white transition-all duration-200 backdrop-blur-sm font-medium">
              <Home className="h-4 w-4 mr-2" /> Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h2>
          <p className="text-gray-600">
            Manage academic programs, courses, and student data
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/programmes">
            {/* Programmes Management */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <BookOpen className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <CardTitle>Programmes</CardTitle>
                    <CardDescription>
                      Manage academic programmes
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          {/* Courses Management */}
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/admin/courses")}>
            <CardHeader>
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <FileText className="h-6 w-6 text-green-700" />
                </div>
                <div>
                  <CardTitle>Courses</CardTitle>
                  <CardDescription>
                    Manage courses and curriculum
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Course Intake Management */}
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/admin/intake")}>
            <CardHeader>
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                  <Users className="h-6 w-6 text-purple-700" />
                </div>
                <div>
                  <CardTitle>Course Intake</CardTitle>
                  <CardDescription>
                    Manage yearly intake capacity
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Course Schemes Management */}
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/admin/schemes")}>
            <CardHeader>
              <div className="flex items-center">
                <div className="bg-orange-100 p-2 rounded-lg mr-3">
                  <Settings className="h-6 w-6 text-orange-700" />
                </div>
                <div>
                  <CardTitle>Course Schemes</CardTitle>
                  <CardDescription>
                    Manage course schemes and structure
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Subject Master Management */}
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/admin/subjects")}>
            <CardHeader>
              <div className="flex items-center">
                <div className="bg-red-100 p-2 rounded-lg mr-3">
                  <Calendar className="h-6 w-6 text-red-700" />
                </div>
                <div>
                  <CardTitle>Subjects</CardTitle>
                  <CardDescription>Manage subject master data</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Students Management */}
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/admin/students")}>
            <CardHeader>
              <div className="flex items-center">
                <div className="bg-teal-100 p-2 rounded-lg mr-3">
                  <Users className="h-6 w-6 text-teal-700" />
                </div>
                <div>
                  <CardTitle>Students</CardTitle>
                  <CardDescription>Manage student records</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
