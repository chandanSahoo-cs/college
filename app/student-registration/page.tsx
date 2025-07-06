"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ArrowRight, Save, GraduationCap, Home } from "lucide-react"
import StudentDetailsForm from "@/components/student-details-form"
import EducationalQualificationsForm from "@/components/educational-qualifications-form"
import ParentDetailsForm from "@/components/parent-details-form"
import FeeReimbursementForm from "@/components/fee-reimbursement-form"
import UndertakingsForm from "@/components/undertakings-form"

export default function StudentRegistration() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("student-details")
  const [formData, setFormData] = useState({
    studentDetails: {},
    educationalQualifications: [],
    parentDetails: {},
    feeReimbursement: {},
    undertakings: {},
  })

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handleNext = () => {
    const tabs = [
      "student-details",
      "educational-qualifications",
      "parent-details",
      "fee-reimbursement",
      "undertakings",
    ]
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1])
    }
  }

  const handlePrevious = () => {
    const tabs = [
      "student-details",
      "educational-qualifications",
      "parent-details",
      "fee-reimbursement",
      "undertakings",
    ]
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1])
    }
  }

  const updateFormData = (section: string, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }))
  }

  const handleSubmit = async () => {
    // Here you would typically send the data to your backend
    console.log("Form submitted with data:", formData)

    // Show success message and redirect
    alert("Student registration successful!")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0c4da2] text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <GraduationCap className="h-6 w-6 mr-2" />
            <h1 className="text-xl font-bold">BPIT Student Registration</h1>
          </div>
          <Link href="/">
            <Button variant="outline" className="text-white border-white hover:bg-white hover:text-[#0c4da2]">
              <Home className="h-4 w-4 mr-2" /> Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Student Registration Form</CardTitle>
            <CardDescription>
              Please fill out all the required information to complete your registration at Bhagwan Parshuram Institute
              of Technology.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid grid-cols-5 mb-8">
                <TabsTrigger value="student-details">Personal Details</TabsTrigger>
                <TabsTrigger value="educational-qualifications">Education</TabsTrigger>
                <TabsTrigger value="parent-details">Parent Details</TabsTrigger>
                <TabsTrigger value="fee-reimbursement">Fee Reimbursement</TabsTrigger>
                <TabsTrigger value="undertakings">Undertakings</TabsTrigger>
              </TabsList>

              <TabsContent value="student-details">
                <StudentDetailsForm
                  data={formData.studentDetails}
                  updateData={(data) => updateFormData("studentDetails", data)}
                />
              </TabsContent>

              <TabsContent value="educational-qualifications">
                <EducationalQualificationsForm
                  data={formData.educationalQualifications}
                  updateData={(data) => updateFormData("educationalQualifications", data)}
                />
              </TabsContent>

              <TabsContent value="parent-details">
                <ParentDetailsForm
                  data={formData.parentDetails}
                  updateData={(data) => updateFormData("parentDetails", data)}
                />
              </TabsContent>

              <TabsContent value="fee-reimbursement">
                <FeeReimbursementForm
                  data={formData.feeReimbursement}
                  updateData={(data) => updateFormData("feeReimbursement", data)}
                />
              </TabsContent>

              <TabsContent value="undertakings">
                <UndertakingsForm
                  data={formData.undertakings}
                  updateData={(data) => updateFormData("undertakings", data)}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={activeTab === "student-details"}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>

            {activeTab === "undertakings" ? (
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                <Save className="mr-2 h-4 w-4" /> Submit Registration
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
