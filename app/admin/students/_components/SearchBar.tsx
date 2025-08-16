"use client";

import { deleteStudent, searchStudents } from "@/action/students.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { useConfirm } from "@/hooks/useConfirm";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export interface Student {
  student_id: string;
  name: string;
  email: string | null;
  mobile: string | null;
  course_id: string;
  course: {
    course_name: string;
  };
  admission_date: Date;
  date_of_birth: Date;
  qualifications: any[]; // Replace 'any' with actual qualification type if known
  parents: any | null; // Replace 'any' with actual parent type if known
}

interface SearchBarProps {
  initialStudents: Student[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export default function SearchBar({
  initialStudents,
  total,
  totalPages,
  currentPage,
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [isSearching, setIsSearching] = useState(false);
  const [students, setStudents] = useState(initialStudents);
  const [currentPageState, setCurrentPageState] = useState(currentPage);
  const [totalState, setTotalState] = useState(total);
  const [totalPagesState, setTotalPagesState] = useState(totalPages);
  const [ConfirmDialog, Confirm] = useConfirm(
    "Are you sure ",
    "This action cannot be undone."
  );
  if (total === 0) {
    router.push("/admin/students/new");
  }
  useEffect(() => {
    setStudents(initialStudents);
    setCurrentPageState(currentPage);
    setTotalState(total);
    setTotalPagesState(totalPages);
  }, [initialStudents, currentPage, total, totalPages]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      router.push("/admin/students");
      return;
    }

    setIsSearching(true);
    try {
      const { data, total, totalPages } = await searchStudents(
        searchTerm,
        1,
        10
      );
      setStudents(data);
      setCurrentPageState(1);
      setTotalState(total);
      setTotalPagesState(totalPages);
      router.push(`/admin/students?q=${encodeURIComponent(searchTerm)}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search students",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPagesState) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/admin/students?${params.toString()}`);
  };

  const handleDelete = async (id: string) => {
    const result = await Confirm();
    if (!result) {
      return;
    }

    try {
      const result = await deleteStudent(id);
      if (result.success) {
        toast({
          title: "Success",
          description: "Student deleted successfully",
        });
        // Refresh the students list
        const { data, total, totalPages } = await searchStudents(
          searchTerm,
          currentPageState,
          10
        );
        setStudents(data);
        setTotalState(total);
        setTotalPagesState(totalPages);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete student",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <ConfirmDialog />
      <div className="space-y-4">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search students by ID, name, email, or course..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isSearching}
          />
        </form>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Admission Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length > 0 ? (
                students.map((student) => (
                  <TableRow key={student.student_id}>
                    <TableCell className="font-medium">
                      {student.student_id}
                    </TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.mobile}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{student.course_id}</span>
                        <span className="text-xs text-muted-foreground">
                          {student.course.course_name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(student.admission_date)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/students/${student.student_id}`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link
                            href={`/admin/students/edit/${student.student_id}`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(student.student_id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground">
                    {isSearching ? "Searching..." : "No students found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPagesState > 1 && (
          <div className="flex items-center justify-between px-2">
            <div className="text-sm text-muted-foreground">
              {totalState} {totalState === 1 ? "student" : "students"} found
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPageState - 1)}
                disabled={currentPageState === 1}>
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>
              <div className="text-sm">
                Page {currentPageState} of {totalPagesState}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPageState + 1)}
                disabled={currentPageState >= totalPagesState}>
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
