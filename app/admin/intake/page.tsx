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
const mockIntakeData = [
  {
    Course_ID: "CSE",
    Acad_Year: 2024,
    Intake: 120,
  },
  {
    Course_ID: "ECE",
    Acad_Year: 2024,
    Intake: 60,
  },
  {
    Course_ID: "MCA",
    Acad_Year: 2024,
    Intake: 60,
  },
  {
    Course_ID: "CSE",
    Acad_Year: 2023,
    Intake: 120,
  },
]

export default function IntakePage() {
  const [intakeData] = useState(mockIntakeData)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredIntakeData = intakeData.filter(
    (intake) =>
      intake.Course_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intake.Acad_Year.toString().includes(searchTerm),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0c4da2] text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <GraduationCap className="h-6 w-6 mr-2" />
            <h1 className="text-xl font-bold">BPIT - Course Intake Management</h1>
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
                <CardTitle className="text-2xl">Course Intake</CardTitle>
                <CardDescription>Manage yearly intake capacity for each course</CardDescription>
              </div>
              <Link href="/admin/intake/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Set Intake
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-6">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by course or year..."
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
                    <TableHead>Academic Year</TableHead>
                    <TableHead>Intake Capacity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIntakeData.map((intake) => (
                    <TableRow key={`${intake.Course_ID}-${intake.Acad_Year}`}>
                      <TableCell className="font-medium">{intake.Course_ID}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{intake.Acad_Year}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{intake.Intake} students</Badge>
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
