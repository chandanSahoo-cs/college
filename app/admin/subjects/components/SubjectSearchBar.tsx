"use client";

import { deleteSubjectById } from "@/action/subject.action";
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
import { SubjectType } from "../page";

interface SearchBarProps {
  subjects: SubjectType;
}

type FilterOption =
  | "all"
  | "paper_name"
  | "paper_code"
  | "credits"
  | "paper_group"
  | "paper_sub_group"
  | "kind";

export default function SubjectSearchBar({ subjects }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterOption>("all");

  const router = useRouter();

  const filteredSubjectsByAttribute = (
    subjects: any[],
    filter: FilterOption
  ) => {
    switch (filter) {
      case "all":
        return subjects.filter(
          (subject) =>
            subject.paper_name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            subject.paper_code
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            subject.paper_group
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            subject.paper_sub_group
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            subject.credits === Number(searchTerm)
        );
      case "paper_name":
        return subjects.filter((subject) =>
          subject.paper_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case "paper_code":
        return subjects.filter((subject) =>
          subject.paper_code.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case "credits":
        return subjects.filter(
          (subject) => subject.credits === Number(searchTerm)
        );
      case "paper_group":
        return subjects.filter((subject) =>
          subject.paper_group?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case "paper_sub_group":
        return subjects.filter((subject) =>
          subject.paper_sub_group
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
      case "kind":
        return subjects.filter(
          (subject) => subject.kind === Number(searchTerm)
        );
      default:
        return subjects;
    }
  };

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure",
    "Deleted subject cannot be restored"
  );

  const deleteSubject = async (paper_id: string, scheme_id: string) => {
    const ok = await confirm();
    if (!ok) return;
    try {
      await deleteSubjectById(paper_id, scheme_id);
      toast.success("Subject deleted successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to delete subject");
    }
  };

  const filteredSubjects = filteredSubjectsByAttribute(subjects!, filter);

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
                placeholder={`Search subjects ${
                  filter !== "all" ? `by ${filter}` : ""
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
                <SelectItem value="paper_name">Paper Name</SelectItem>
                <SelectItem value="paper_code">Paper Code</SelectItem>
                <SelectItem value="credits">Credits</SelectItem>
                <SelectItem value="paper_group">Paper Group</SelectItem>
                <SelectItem value="paper_sub_group">Paper Sub Group</SelectItem>
                <SelectItem value="kind">Kind</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results count */}
          <div className="mt-3 text-sm text-gray-600">
            Showing {filteredSubjects.length} of {subjects?.length} subjects
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Paper ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead>Sub Group</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Kind</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubjects.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-gray-500">
                      No subjects found matching your search criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubjects.map((subject) => (
                    <TableRow key={`${subject.paper_id}_${subject.scheme_id}`}>
                      <TableCell>{subject.paper_id}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {subject.paper_name}
                      </TableCell>
                      <TableCell>{subject.paper_code}</TableCell>
                      <TableCell>{subject.paper_group}</TableCell>
                      <TableCell>{subject.paper_sub_group}</TableCell>
                      <TableCell>{subject.credits}</TableCell>
                      <TableCell>{subject.kind}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="h-8 w-8 p-0">
                            <Link
                              href={`/admin/subjects/edit/${subject.paper_id}?scheme=${subject.scheme_id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() =>
                              deleteSubject(subject.paper_id, subject.scheme_id)
                            }>
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
