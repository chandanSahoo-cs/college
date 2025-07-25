"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { GraduationCap, Home, Plus } from "lucide-react"
import SearchBar from "./_components/Searchbar"

// Mock data - replace with actual data fetching
const mockCourses = [
  {
    Course_ID: "CSE",
    Course_Name: "Computer Science and Engineering",
    Course_Short_Name: "CSE",
    Prog_ID: "BTECH001",
    Semester_Annual: 1,
    Min_Duration_in_years: 4,
    Max_Duration_in_years: 6,
    Total_Semester_Annual: 8,
  },
  {
    Course_ID: "ECE",
    Course_Name: "Electronics and Communication Engineering",
    Course_Short_Name: "ECE",
    Prog_ID: "BTECH001",
    Semester_Annual: 1,
    Min_Duration_in_years: 4,
    Max_Duration_in_years: 6,
    Total_Semester_Annual: 8,
  },
  {
    Course_ID: "MCA",
    Course_Name: "Master of Computer Applications",
    Course_Short_Name: "MCA",
    Prog_ID: "MCA001",
    Semester_Annual: 1,
    Min_Duration_in_years: 2,
    Max_Duration_in_years: 4,
    Total_Semester_Annual: 4,
  },
]

export default function CoursesPage() {
  const [courses] = useState(mockCourses)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0c4da2] text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <GraduationCap className="h-6 w-6 mr-2" />
            <h1 className="text-xl font-bold">BPIT - Courses Management</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/admin">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-[#0c4da2]">
                Admin Dashboard
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-[#0c4da2]">
                <Home className="h-4 w-4 mr-2" /> Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">Courses</CardTitle>
                <CardDescription>Manage all courses offered under different programmes</CardDescription>
              </div>
              <Link href="/admin/courses/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Add Course
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <SearchBar courses={courses} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
