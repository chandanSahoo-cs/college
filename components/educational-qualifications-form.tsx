"use client"

import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

// Define the form schema based on the SQL schema
const qualificationSchema = z.object({
  Exam_Passed: z.enum(["X", "XII", "Polytechnic", "Graduation", "Other"], {
    required_error: "Examination is required",
  }),
  School_College: z.string().min(1, "School/College name is required").max(100),
  Board_University: z.string().min(1, "Board/University is required").max(100),
  Year: z
    .string()
    .min(4, "Year is required")
    .max(4)
    .regex(/^\d{4}$/, "Must be a valid year"),
  Percentage: z
    .string()
    .min(1, "Percentage is required")
    .transform((val) => Number.parseFloat(val))
    .refine((val) => val >= 0 && val <= 100, "Percentage must be between 0 and 100"),
  PCM_Marks: z
    .string()
    .transform((val) => (val ? Number.parseFloat(val) : undefined))
    .refine((val) => val === undefined || (val >= 0 && val <= 100), "PCM marks must be between 0 and 100")
    .optional(),
})

type QualificationValues = z.infer<typeof qualificationSchema>

interface EducationalQualificationsFormProps {
  data: QualificationValues[]
  updateData: (data: QualificationValues[]) => void
}

export default function EducationalQualificationsForm({ data, updateData }: EducationalQualificationsFormProps) {
  const [qualifications, setQualifications] = useState<QualificationValues[]>(data || [])
  const [editIndex, setEditIndex] = useState<number | null>(null)

  // Initialize the form
  const form = useForm<QualificationValues>({
    resolver: zodResolver(qualificationSchema),
    defaultValues: {
      Exam_Passed: undefined,
      School_College: "",
      Board_University: "",
      Year: "",
      Percentage: "",
      PCM_Marks: "",
    },
  })

  const onSubmit = (values: QualificationValues) => {
    let updatedQualifications: QualificationValues[]

    if (editIndex !== null) {
      // Update existing qualification
      updatedQualifications = [...qualifications]
      updatedQualifications[editIndex] = values
    } else {
      // Add new qualification
      updatedQualifications = [...qualifications, values]
    }

    setQualifications(updatedQualifications)
    updateData(updatedQualifications)

    // Reset form and edit state
    form.reset({
      Exam_Passed: undefined,
      School_College: "",
      Board_University: "",
      Year: "",
      Percentage: "",
      PCM_Marks: "",
    })
    setEditIndex(null)
  }

  const handleEdit = (index: number) => {
    const qualification = qualifications[index]
    form.reset({
      Exam_Passed: qualification.Exam_Passed,
      School_College: qualification.School_College,
      Board_University: qualification.Board_University,
      Year: qualification.Year.toString(),
      Percentage: qualification.Percentage.toString(),
      PCM_Marks: qualification.PCM_Marks?.toString() || "",
    })
    setEditIndex(index)
  }

  const handleDelete = (index: number) => {
    const updatedQualifications = qualifications.filter((_, i) => i !== index)
    setQualifications(updatedQualifications)
    updateData(updatedQualifications)

    if (editIndex === index) {
      form.reset()
      setEditIndex(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Educational Qualifications</h3>
        <p className="text-sm text-muted-foreground">
          Add your educational qualifications starting from Class X onwards.
        </p>
      </div>

      {/* List of added qualifications */}
      {qualifications.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Added Qualifications:</h4>
          <div className="grid gap-4">
            {qualifications.map((qualification, index) => (
              <Card key={index}>
                <CardHeader className="py-4">
                  <CardTitle className="text-base">
                    {qualification.Exam_Passed === "X"
                      ? "Class X"
                      : qualification.Exam_Passed === "XII"
                        ? "Class XII"
                        : qualification.Exam_Passed}
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">School/College:</span> {qualification.School_College}
                    </div>
                    <div>
                      <span className="font-medium">Board/University:</span> {qualification.Board_University}
                    </div>
                    <div>
                      <span className="font-medium">Year:</span> {qualification.Year}
                    </div>
                    <div>
                      <span className="font-medium">Percentage:</span> {qualification.Percentage}%
                    </div>
                    {qualification.PCM_Marks && (
                      <div>
                        <span className="font-medium">PCM Marks:</span> {qualification.PCM_Marks}%
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="py-2">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(index)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(index)}>
                      <Trash2 className="h-4 w-4 mr-1" /> Remove
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Form to add/edit qualification */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{editIndex !== null ? "Edit Qualification" : "Add Qualification"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="Exam_Passed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Examination*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select examination" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="X">Class X</SelectItem>
                          <SelectItem value="XII">Class XII</SelectItem>
                          <SelectItem value="Polytechnic">Polytechnic</SelectItem>
                          <SelectItem value="Graduation">Graduation</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="School_College"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School/College*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter school or college name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="Board_University"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Board/University*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter board or university name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="Year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year of Passing*</FormLabel>
                      <FormControl>
                        <Input placeholder="YYYY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="Percentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Percentage*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter percentage" {...field} />
                      </FormControl>
                      <FormDescription>Enter percentage between 0 and 100</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="PCM_Marks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PCM Marks</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter PCM marks (if applicable)" {...field} />
                      </FormControl>
                      <FormDescription>Physics, Chemistry, Mathematics marks (if applicable)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit">
                <Plus className="h-4 w-4 mr-2" />
                {editIndex !== null ? "Update Qualification" : "Add Qualification"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
