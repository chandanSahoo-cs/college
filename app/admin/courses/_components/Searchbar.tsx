"use client";

import { deleteCourseById } from "@/action/courses.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useConfirm } from "@/hooks/useConfirm";
import { Edit, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface SearchBarProps {
  courses: any[];
}

type FilterOption =
  | "all"
  | "Course ID"
  | "Course Name"
  | "Short Name"
  | "Programme ID"
  | "Semester/Annual"
  | "Min Duration"
  | "Max Duration";

export default function SearchBar({ courses }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterOption>("all");
  const router = useRouter();

  const filteredCoursesByAttribute = (courses: any[], filter: FilterOption) => {
    if (!searchTerm) return courses;
    
    const searchTermLower = searchTerm.toLowerCase();
    
    switch (filter) {
      case "all":
        return courses.filter(
          (course) =>
            course.Course_ID?.toLowerCase().includes(searchTermLower) ||
            course.Course_Name?.toLowerCase().includes(searchTermLower) ||
            course.Course_Short_Name?.toLowerCase().includes(searchTermLower) ||
            course.Prog_ID?.toLowerCase().includes(searchTermLower) ||
            course.Semester_Annual?.toString() === searchTerm ||
            course.Min_Duration_in_years?.toString() === searchTerm ||
            course.Max_Duration_in_years?.toString() === searchTerm
        );
      case "Course ID":
        return courses.filter(course => 
          course.Course_ID?.toLowerCase().includes(searchTermLower)
        );
      case "Course Name":
        return courses.filter(course => 
          course.Course_Name?.toLowerCase().includes(searchTermLower)
        );
      case "Short Name":
        return courses.filter(course => 
          course.Course_Short_Name?.toLowerCase().includes(searchTermLower)
        );
      case "Programme ID":
        return courses.filter(course => 
          course.Prog_ID?.toLowerCase().includes(searchTermLower)
        );
      case "Semester/Annual":
        return courses.filter(
          course => course.Semester_Annual?.toString() === searchTerm
        );
      case "Min Duration":
        return courses.filter(
          course => course.Min_Duration_in_years?.toString() === searchTerm
        );
      case "Max Duration":
        return courses.filter(
          course => course.Max_Duration_in_years?.toString() === searchTerm
        );
      default:
        return courses;
    }
  };

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "Deleting this course cannot be undone."
  );

  const handleDelete = async (id: string) => {
    const ok = await confirm();
    if (!ok) return;
    try {
      await deleteCourseById(id);
      toast.success("Course deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete course");
    }
  };

  const filteredCourses = filteredCoursesByAttribute(courses, filter);

  return (
    <>
      <ConfirmDialog />
      <div className="space-y-6">
        {/* Search and Filter Section */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={`Search courses ${
                  filter !== "all" ? `by ${filter.toLowerCase()}` : ""
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              defaultValue="all"
              onValueChange={(value) => setFilter(value as FilterOption)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fields</SelectItem>
                <SelectItem value="Course ID">Course ID</SelectItem>
                <SelectItem value="Course Name">Course Name</SelectItem>
                <SelectItem value="Short Name">Short Name</SelectItem>
                <SelectItem value="Programme ID">Programme ID</SelectItem>
                <SelectItem value="Semester/Annual">Semester/Annual</SelectItem>
                <SelectItem value="Min Duration">Min Duration</SelectItem>
                <SelectItem value="Max Duration">Max Duration</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results count */}
          <div className="mt-3 text-sm text-gray-600">
            Showing {filteredCourses.length} of {courses.length} courses
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-900">
                    Course ID
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Course Name
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Short Name
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Programme ID
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Semester/Annual
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Duration (Years)
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.length === 0 ? (
                  <TableRow>
                    <TableCell 
                      colSpan={7} 
                      className="text-center py-8 text-gray-500"
                    >
                      No courses found matching your search criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCourses.map((course) => (
                    <TableRow key={course.Course_ID} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-gray-900">
                        {course.Course_ID}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="font-medium text-gray-900">
                          {course.Course_Name}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-blue-600">
                        {course.Course_Short_Name}
                      </TableCell>
                      <TableCell>{course.Prog_ID}</TableCell>
                      <TableCell>
                        {course.Semester_Annual === 1 ? 'Semester' : 'Annual'}
                      </TableCell>
                      <TableCell>
                        {course.Min_Duration_in_years} - {course.Max_Duration_in_years} years
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="h-8 w-8 p-0"
                          >
                            <Link href={`/admin/courses/${course.Course_ID}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(course.Course_ID)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}