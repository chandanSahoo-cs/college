'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { deleteProgrammeById } from "@/action/programmes.action"

interface SearchBarProps {
  programmes: any[]
}

export default function SearchBar({ programmes }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")



  const filteredProgrammesByAttribute = (programmes: any[], filter: "all" | "Programmes" | "Duration" | "Name" | "Short Name" | "University" | "Semester/Annual" | "Min_Duration_in_years" | "Max_Duration_in_years") => {
    switch (filter) {
      case "all":
        return programmes
      case "Programmes":
        return programmes.filter((programme) => programme.Prog_Name.toLowerCase().includes(searchTerm.toLowerCase()))
      case "Duration":
        return programmes.filter((programme) => programme.Min_Duration_in_years === Number(searchTerm))
      case "Name":
        return programmes.filter((programme) => programme.Prog_Name.toLowerCase().includes(searchTerm.toLowerCase()))
      case "Short Name":
        return programmes.filter((programme) => programme.Prog_Short_Name.toLowerCase().includes(searchTerm.toLowerCase()))
      case "University":
        return programmes.filter((programme) => programme.University_School.toLowerCase().includes(searchTerm.toLowerCase()))
      case "Semester/Annual":
        return programmes.filter((programme) => programme.Semester_Annual === Number(searchTerm))
      case "Min_Duration_in_years":
        return programmes.filter((programme) => programme.Min_Duration_in_years === Number(searchTerm))
      case "Max_Duration_in_years":
        return programmes.filter((programme) => programme.Max_Duration_in_years === Number(searchTerm))
      default:
        return programmes
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Input
          placeholder= {`Search programmes ${filter}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select defaultValue="all" onValueChange={(value) => setFilter(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Programmes">Programmes</SelectItem>
            <SelectItem value="Duration">Duration</SelectItem>
            <SelectItem value="Name">Name</SelectItem>
            <SelectItem value="Short Name">Short Name</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="overflow-x-auto">
        <Table className="table w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Programme ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Short Name</TableHead>
              <th>Regulatory Body</th>
              <th>University</th>
              <th>Semester/Annual</th>
              <th>Duration</th>
              <th>Actions</th>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProgrammesByAttribute(programmes, filter).map((programme) => (
              <TableRow key={programme.Prog_ID}>
                <TableCell>{programme.Prog_ID}</TableCell>
                <TableCell>{programme.Prog_Name}</TableCell>
                <TableCell>{programme.Prog_Short_Name}</TableCell>
                <td>
                  {programme.Regulatory_Body_Name} ({programme.Regulatory_Body_ShortName})
                </td>
                <td>{programme.University_School}</td>
                <td>
                  {programme.Semester_Annual === 0 ? 'Annual' : 'Semester'}
                </td>
                <td>
                  {programme.Min_Duration_in_years} - {programme.Max_Duration_in_years} years
                </td>
                <td>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/programmes/edit/${programme.Prog_ID}`}
                      className="btn btn-sm btn-primary"
                    >
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Link>
                    <button className="btn btn-sm btn-error" onClick={() => deleteProgrammeById(programme.Prog_ID)}>
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </button>
                  </div>
                </td>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}