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
const mockSchemes = [
  {
    Scheme_ID: "CSE2023001",
    Course_ID: "CSE",
    Acad_Year: 2023,
    Semester_Annual: 1,
    Min_Duration_in_years: 4,
    Max_Duration_in_years: 6,
    Total_Semester_Annual: 8,
    Min_Credits: 160,
    Max_Credits: 200,
    Regulatory_Body_Name: "All India Council for Technical Education",
    Regulatory_Body_ShortName: "AICTE",
    University_School: "GGSIPU",
  },
  {
    Scheme_ID: "ECE2023001",
    Course_ID: "ECE",
    Acad_Year: 2023,
    Semester_Annual: 1,
    Min_Duration_in_years: 4,
    Max_Duration_in_years: 6,
    Total_Semester_Annual: 8,
    Min_Credits: 160,
    Max_Credits: 200,
    Regulatory_Body_Name: "All India Council for Technical Education",
    Regulatory_Body_ShortName: "AICTE",
    University_School: "GGSIPU",
  },
]

export default function SchemesPage() {
  const [schemes] = useState(mockSchemes)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSchemes = schemes.filter(
    (scheme) =>
      scheme.Scheme_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.Course_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.Acad_Year.toString().includes(searchTerm),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0c4da2] text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <GraduationCap className="h-6 w-6 mr-2" />
            <h1 className="text-xl font-bold">BPIT - Course Schemes Management</h1>
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
                <CardTitle className="text-2xl">Course Schemes</CardTitle>
                <CardDescription>Manage course schemes and their academic structure</CardDescription>
              </div>
              <Link href="/admin/schemes/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Add Scheme
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-6">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search schemes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Scheme ID</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Academic Year</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>System</TableHead>
                    <TableHead>Regulatory Body</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchemes.map((scheme) => (
                    <TableRow key={scheme.Scheme_ID}>
                      <TableCell className="font-medium">{scheme.Scheme_ID}</TableCell>
                      <TableCell>{scheme.Course_ID}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{scheme.Acad_Year}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>
                            {scheme.Min_Duration_in_years}-{scheme.Max_Duration_in_years} years
                          </div>
                          <div className="text-gray-500">{scheme.Total_Semester_Annual} semesters</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>
                            {scheme.Min_Credits}-{scheme.Max_Credits}
                          </div>
                          <div className="text-gray-500">credits</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={scheme.Semester_Annual === 1 ? "default" : "outline"}>
                          {scheme.Semester_Annual === 1 ? "Semester" : "Annual"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{scheme.Regulatory_Body_ShortName}</div>
                          <div className="text-gray-500">{scheme.University_School}</div>
                        </div>
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
