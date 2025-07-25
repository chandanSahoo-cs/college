"use client";

import { deleteCourseIntakeById } from "@/action/courseIntake.action";
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

interface IntakeSearchBarProps {
  intakes: any[];
}

type FilterOption = "all" | "Course Name" | "Acad Year" | "Intake";

export default function IntakeSearchBar({ intakes }: IntakeSearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterOption>("all");
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "Deleting an intake record cannot be undone."
  );
  const router = useRouter();

  const filteredIntakes = intakes.filter((intake) => {
    const term = searchTerm.toLowerCase();
    switch (filter) {
      case "Course Name":
        return intake.Course_Name?.toLowerCase().includes(term);
      case "Acad Year":
        return intake.Acad_Year.toString().includes(term);
      case "Intake":
        return intake.Intake.toString().includes(term);
      case "all":
        return (
          intake.Course_Name?.toLowerCase().includes(term) ||
          intake.Acad_Year.toString().includes(term) ||
          intake.Intake.toString().includes(term)
        );
      default:
        return true;
    }
  });

  const deleteIntake = async (courseId: string, acadYear: number) => {
    const ok = await confirm();
    if (!ok) return;
    try {
      await deleteCourseIntakeById(courseId, acadYear);
      toast.success("Intake deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete intake");
    }
  };

  return (
    <>
      <ConfirmDialog />
      <div className="space-y-6">
        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={`Search intakes ${
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
                <SelectItem value="Course Name">Course Name</SelectItem>
                <SelectItem value="Acad Year">Academic Year</SelectItem>
                <SelectItem value="Intake">Intake Number</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-3 text-sm text-gray-600">
            Showing {filteredIntakes.length} of {intakes.length} intakes
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
                    Academic Year
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Intake
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIntakes.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-gray-500">
                      No intake records match your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredIntakes.map((intake) => (
                    <TableRow key={`${intake.Course_ID}-${intake.Acad_Year}`}>
                      <TableCell className="font-medium text-gray-900">
                        {intake.Course_ID}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {intake.Course_Name ?? "—"}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {intake.Acad_Year}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {intake.Intake}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-8 px-3">
                            <Link
                              href={`/admin/intake/edit/${intake.Course_ID}?acad_year=${intake.Acad_Year}`}>
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Link>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-8 px-3"
                            onClick={() =>
                              deleteIntake(intake.Course_ID, intake.Acad_Year)
                            }>
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
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
