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
const mockSubjects = [
  {
    Paper_ID: "CS101",
    Scheme_ID: "CSE2023001",
    Paper_Code: "CS101",
    Paper_Name: "Programming Fundamentals",
    Credits: 4,
    Type: 1, // Theory
    Exam: 1, // UES
    Mode: 1, // Compulsory
    Paper_Group: "CORE",
    Paper_Sub_Group: "CS",
    Kind: 1, // Mandatory
    Minor_Max_Marks: 30,
    Major_Max_Marks: 70,
    Total_Max_Marks: 100,
    Pass_Marks: 40,
  },
  {
    Paper_ID: "CS102",
    Scheme_ID: "CSE2023001",
    Paper_Code: "CS102L",
    Paper_Name: "Programming Lab",
    Credits: 2,
    Type: 0, // Practical
    Exam: 0, // NUES
    Mode: 1, // Compulsory
    Paper_Group: "CORE",
    Paper_Sub_Group: "CS",
    Kind: 1, // Mandatory
    Minor_Max_Marks: 20,
    Major_Max_Marks: 30,
    Total_Max_Marks: 50,
    Pass_Marks: 25,
  },
]

export default function SubjectsPage() {
  const [subjects] = useState(mockSubjects)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.Paper_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.Paper_Code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.Paper_ID.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getTypeLabel = (type: number) => (type === 1 ? "Theory" : "Practical")
  const getExamLabel = (exam: number) => (exam === 1 ? "UES" : "NUES")
  const getModeLabel = (mode: number) => (mode === 1 ? "Compulsory" : "Elective")
  const getKindLabel = (kind: number) => (kind === 1 ? "Mandatory" : "Droppable")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0c4da2] text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <GraduationCap className="h-6 w-6 mr-2" />
            <h1 className="text-xl font-bold">BPIT - Subjects Management</h1>
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
                <CardTitle className="text-2xl">Subject Master</CardTitle>
                <CardDescription>Manage all subjects and their details across different schemes</CardDescription>
              </div>
              <Link href="/admin/subjects/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Add Subject
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-6">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paper ID</TableHead>
                    <TableHead>Paper Code</TableHead>
                    <TableHead>Paper Name</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Exam</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>Marks</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubjects.map((subject) => (
                    <TableRow key={`${subject.Paper_ID}-${subject.Scheme_ID}`}>
                      <TableCell className="font-medium">{subject.Paper_ID}</TableCell>
                      <TableCell>{subject.Paper_Code}</TableCell>
                      <TableCell>{subject.Paper_Name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{subject.Credits}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={subject.Type === 1 ? "default" : "outline"}>{getTypeLabel(subject.Type)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={subject.Exam === 1 ? "default" : "outline"}>{getExamLabel(subject.Exam)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={subject.Mode === 1 ? "destructive" : "secondary"}>
                          {getModeLabel(subject.Mode)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{subject.Paper_Group}</div>
                          <div className="text-gray-500">{subject.Paper_Sub_Group}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Total: {subject.Total_Max_Marks}</div>
                          <div className="text-gray-500">Pass: {subject.Pass_Marks}</div>
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
