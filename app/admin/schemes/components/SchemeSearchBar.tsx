"use client";

import { deleteSchemeById } from "@/action/scheme.action";
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
import { SchemeType } from "../page";

interface SearchBarProps {
  schemes: SchemeType[];
}

type FilterOption =
  | "all"
  | "scheme_id"
  | "course_id"
  | "acad_year"
  | "semester_annual"
  | "total_semester_annual"
  | "min_duration_in_years"
  | "max_duration_in_years"
  | "min_credits"
  | "max_credits"
  | "university_school"
  | "regulatory_body_name";

export default function SchemeSearchBar({ schemes }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterOption>("all");
  const router = useRouter();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "Deleting this scheme is irreversible."
  );

  const deleteScheme = async (scheme_id: string) => {
    const ok = await confirm();
    if (!ok) return;

    try {
      await deleteSchemeById(scheme_id);
      toast.success("Scheme deleted successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to delete scheme");
    }
  };

  const filteredSchemes = schemes.filter((scheme) => {
    const term = searchTerm.toLowerCase();
    const check = (value: string | number | undefined) =>
      String(value ?? "")
        .toLowerCase()
        .includes(term);

    switch (filter) {
      case "all":
        return (
          check(scheme.scheme_id) ||
          check(scheme.course_id) ||
          check(scheme.acad_year) ||
          check(scheme.university_school) ||
          check(scheme.regulatory_body_name as string)
        );
      default:
        return check((scheme as any)[filter]);
    }
  });

  return (
    <>
      <ConfirmDialog />
      <div className="space-y-6">
        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={`Search schemes ${
                  filter !== "all" ? `by ${filter.replaceAll("_", " ")}` : ""
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              defaultValue="all"
              onValueChange={(v) => setFilter(v as FilterOption)}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Filter by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fields</SelectItem>
                <SelectItem value="scheme_id">Scheme ID</SelectItem>
                <SelectItem value="course_id">Course ID</SelectItem>
                <SelectItem value="acad_year">Academic Year</SelectItem>
                <SelectItem value="semester_annual">Semester/Annual</SelectItem>
                <SelectItem value="total_semester_annual">
                  Total Semesters/Annuals
                </SelectItem>
                <SelectItem value="min_duration_in_years">
                  Min Duration
                </SelectItem>
                <SelectItem value="max_duration_in_years">
                  Max Duration
                </SelectItem>
                <SelectItem value="min_credits">Min Credits</SelectItem>
                <SelectItem value="max_credits">Max Credits</SelectItem>
                <SelectItem value="regulatory_body_name">
                  Regulatory Body
                </SelectItem>
                <SelectItem value="university_school">University</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            Showing {filteredSchemes.length} of {schemes.length} schemes
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Scheme ID</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Total Terms</TableHead>
                <TableHead>Regulatory Body</TableHead>
                <TableHead>University</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchemes.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="text-center py-6 text-gray-500">
                    No matching schemes found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSchemes.map((scheme) => (
                  <TableRow key={scheme.scheme_id}>
                    <TableCell>{scheme.scheme_id}</TableCell>
                    <TableCell>{scheme.course_id}</TableCell>
                    <TableCell>{scheme.acad_year}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          scheme.semester_annual === 0
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}>
                        {scheme.semester_annual === 0 ? "Annual" : "Semester"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {scheme.min_duration_in_years}–
                      {scheme.max_duration_in_years} yrs
                    </TableCell>
                    <TableCell>
                      {scheme.min_credits}–{scheme.max_credits}
                    </TableCell>
                    <TableCell>{scheme.total_semester_annual}</TableCell>
                    <TableCell>{scheme.regulatory_body_name || "—"}</TableCell>
                    <TableCell>{scheme.university_school}</TableCell>
                    <TableCell>
                      <div className="flex justify-center items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="h-8 w-8 p-0">
                          <Link
                            href={`/admin/schemes/edit/${scheme.scheme_id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => deleteScheme(scheme.scheme_id)}>
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
    </>
  );
}
