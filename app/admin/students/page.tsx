"use client"

import { useSearchParams } from 'next/navigation'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Home, Plus, Users } from "lucide-react"
import SearchBar from "./_components/SearchBar"
import { getStudents } from "@/action/students.action"
import { useEffect, useState } from 'react'
import {Student} from "@/app/admin/students/_components/SearchBar"

export default function StudentsPage() {
  const searchParams = useSearchParams()
  const [students, setStudents] = useState<Student[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  
  const currentPage = searchParams.get('page') ? Number(searchParams.get('page')) : 1
  const limit = 10
  
  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true)
      try {
        const { data, total, totalPages } = await getStudents(currentPage, limit)
        setStudents(data)
        setTotal(total)
        setTotalPages(totalPages)
      } catch (error) {
        console.error('Error fetching students:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchStudents()
  }, [currentPage])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0c4da2] text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Users className="h-6 w-6 mr-2" />
            <h1 className="text-xl font-bold">BPIT - Student Management</h1>
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
                <CardTitle className="text-2xl">Students</CardTitle>
                <CardDescription>Manage all registered students and their information</CardDescription>
              </div>
              <Link href="/admin/students/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Add Student
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <SearchBar initialStudents={students} total={total} totalPages={totalPages} currentPage={currentPage} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
