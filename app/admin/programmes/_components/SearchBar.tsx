"use client";

import { deleteProgrammeById } from "@/action/programmes.action";
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
  programmes: any[];
}

type FilterOption =
  | "all"
  | "Programmes"
  | "Duration"
  | "Name"
  | "Short Name"
  | "University"
  | "Semester/Annual"
  | "Min_Duration_in_years"
  | "Max_Duration_in_years";

export default function SearchBar({ programmes }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterOption>("all");

  const router = useRouter();

  const filteredProgrammesByAttribute = (
    programmes: any[],
    filter: FilterOption
  ) => {
    switch (filter) {
      case "all":
        return programmes.filter(
          (programme) =>
            programme.Prog_Name.toLowerCase().includes(
              searchTerm.toLowerCase()
            ) ||
            programme.Prog_Short_Name.toLowerCase().includes(
              searchTerm.toLowerCase()
            ) ||
            programme.University_School.toLowerCase().includes(
              searchTerm.toLowerCase()
            ) ||
            programme.Regulatory_Body_Name.toLowerCase().includes(
              searchTerm.toLowerCase()
            ) ||
            programme.Min_Duration_in_years === Number(searchTerm) ||
            programme.Max_Duration_in_years === Number(searchTerm)
        );
      case "Programmes":
      case "Name":
        return programmes.filter((programme) =>
          programme.Prog_Name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case "Duration":
        return programmes.filter(
          (programme) =>
            programme.Min_Duration_in_years === Number(searchTerm) ||
            programme.Max_Duration_in_years === Number(searchTerm)
        );
      case "Short Name":
        return programmes.filter((programme) =>
          programme.Prog_Short_Name.toLowerCase().includes(
            searchTerm.toLowerCase()
          )
        );
      case "University":
        return programmes.filter((programme) =>
          programme.University_School.toLowerCase().includes(
            searchTerm.toLowerCase()
          )
        );
      case "Semester/Annual":
        return programmes.filter(
          (programme) => programme.Semester_Annual === Number(searchTerm)
        );
      case "Min_Duration_in_years":
        return programmes.filter(
          (programme) => programme.Min_Duration_in_years === Number(searchTerm)
        );
      case "Max_Duration_in_years":
        return programmes.filter(
          (programme) => programme.Max_Duration_in_years === Number(searchTerm)
        );
      default:
        return programmes;
    }
  };

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure",
    "Delete programme can't be restored"
  );

  const deleteProgramme = async (id: any) => {
    const ok = await confirm();
    if (!ok) return;
    try {
      await deleteProgrammeById(id);
      toast.success("Programme deleted successfully");
    } catch (error) {
      toast.error("Failed to delete programme");
    }

    router.refresh();
  };

  const filteredProgrammes = filteredProgrammesByAttribute(programmes, filter);

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
                placeholder={`Search programmes ${
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
                <SelectItem value="Name">Programme Name</SelectItem>
                <SelectItem value="Short Name">Short Name</SelectItem>
                <SelectItem value="University">University</SelectItem>
                <SelectItem value="Duration">Duration</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results count */}
          <div className="mt-3 text-sm text-gray-600">
            Showing {filteredProgrammes.length} of {programmes.length}{" "}
            programmes
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-900">
                    Programme ID
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Name
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Short Name
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Regulatory Body
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    University
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Type
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Duration
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProgrammes.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-gray-500">
                      No programmes found matching your search criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProgrammes.map((programme) => (
                    <TableRow
                      key={programme.Prog_ID}
                      className="hover:bg-gray-50"
                      onClick={() => {
                        router.push(
                          `/admin/programmes/preview/${programme.Prog_ID}`
                        );
                      }}>
                      <TableCell className="font-medium text-gray-900">
                        {programme.Prog_ID}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="font-medium text-gray-900 truncate">
                          {programme.Prog_Name}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-blue-600">
                        {programme.Prog_Short_Name}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {programme.Regulatory_Body_Name}
                          </div>
                          <div className="text-gray-500">
                            ({programme.Regulatory_Body_ShortName})
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {programme.University_School}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            programme.Semester_Annual === 0
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}>
                          {programme.Semester_Annual === 0
                            ? "Annual"
                            : "Semester"}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {programme.Min_Duration_in_years} -{" "}
                        {programme.Max_Duration_in_years} years
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            variant="ghost"
                            size="icon"
                            asChild
                            className="h-8 w-8 p-0">
                            <Link
                              href={`/admin/programmes/edit/${programme.Prog_ID}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteProgramme(programme.Prog_ID);
                            }}>
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
