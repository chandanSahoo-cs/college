"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { GraduationCap, Home, Plus, Search, Edit, Trash2 } from "lucide-react"

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
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCourses = courses.filter(
    (course) =>
      course.Course_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.Course_Short_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.Course_ID.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
            <div className="flex items-center space-x-2 mb-6">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course ID</TableHead>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Short Name</TableHead>
                    <TableHead>Programme</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Total Semesters</TableHead>
                    <TableHead>System</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.map((course) => (
                    <TableRow key={course.Course_ID}>
                      <TableCell className="font-medium">{course.Course_ID}</TableCell>
                      <TableCell>{course.Course_Name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{course.Course_Short_Name}</Badge>
                      </TableCell>
                      <TableCell>{course.Prog_ID}</TableCell>
                      <TableCell>
                        {course.Min_Duration_in_years}-{course.Max_Duration_in_years} years
                      </TableCell>
                      <TableCell>{course.Total_Semester_Annual}</TableCell>
                      <TableCell>
                        <Badge variant={course.Semester_Annual === 1 ? "default" : "outline"}>
                          {course.Semester_Annual === 1 ? "Semester" : "Annual"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
