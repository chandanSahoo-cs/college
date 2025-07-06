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
const mockProgrammes = [
  {
    Prog_ID: "BTECH001",
    Prog_Name: "Bachelor of Technology",
    Prog_Short_Name: "B.Tech",
    Regulatory_Body_Name: "All India Council for Technical Education",
    Regulatory_Body_ShortName: "AICTE",
    University_School: "GGSIPU",
    Semester_Annual: 1,
    Min_Duration_in_years: 4,
    Max_Duration_in_years: 6,
  },
  {
    Prog_ID: "MCA001",
    Prog_Name: "Master of Computer Applications",
    Prog_Short_Name: "MCA",
    Regulatory_Body_Name: "All India Council for Technical Education",
    Regulatory_Body_ShortName: "AICTE",
    University_School: "GGSIPU",
    Semester_Annual: 1,
    Min_Duration_in_years: 2,
    Max_Duration_in_years: 4,
  },
]

export default function ProgrammesPage() {
  const [programmes] = useState(mockProgrammes)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProgrammes = programmes.filter(
    (programme) =>
      programme.Prog_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      programme.Prog_Short_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      programme.Prog_ID.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0c4da2] text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <GraduationCap className="h-6 w-6 mr-2" />
            <h1 className="text-xl font-bold">BPIT - Programmes Management</h1>
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
                <CardTitle className="text-2xl">Academic Programmes</CardTitle>
                <CardDescription>Manage all academic programmes offered by the institute</CardDescription>
              </div>
              <Link href="/admin/programmes/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Add Programme
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-6">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search programmes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Programme ID</TableHead>
                    <TableHead>Programme Name</TableHead>
                    <TableHead>Short Name</TableHead>
                    <TableHead>Regulatory Body</TableHead>
                    <TableHead>University/School</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>System</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProgrammes.map((programme) => (
                    <TableRow key={programme.Prog_ID}>
                      <TableCell className="font-medium">{programme.Prog_ID}</TableCell>
                      <TableCell>{programme.Prog_Name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{programme.Prog_Short_Name}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{programme.Regulatory_Body_ShortName}</div>
                          <div className="text-sm text-gray-500">{programme.Regulatory_Body_Name}</div>
                        </div>
                      </TableCell>
                      <TableCell>{programme.University_School}</TableCell>
                      <TableCell>
                        {programme.Min_Duration_in_years}-{programme.Max_Duration_in_years} years
                      </TableCell>
                      <TableCell>
                        <Badge variant={programme.Semester_Annual === 1 ? "default" : "outline"}>
                          {programme.Semester_Annual === 1 ? "Semester" : "Annual"}
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
