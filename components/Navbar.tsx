"use client"

import { Button } from "@/components/ui/button"
import { BookOpen, GraduationCap, Home, Users, Calendar, FileText } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigationItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: Home,
  },
  {
    title: "Programmes",
    href: "/admin/programmes",
    icon: GraduationCap,
    children: [
      { title: "All Programmes", href: "/admin/programmes" },
      { title: "Add Programme", href: "/admin/programmes/new" },
      { title: "Edit Programme", href: "/admin/programmes/edit" },
      { title: "Preview Programme", href: "/admin/programmes/preview" },
    ],
  },
  {
    title: "Courses",
    href: "/admin/courses",
    icon: BookOpen,
    children: [
      { title: "All Courses", href: "/admin/courses" },
      { title: "Add Course", href: "/admin/courses/new" },
      { title: "Edit Course", href: "/admin/courses/edit" },
      { title: "Preview Course", href: "/admin/courses/preview" },
    ],
  },
  {
    title: "Students",
    href: "/admin/students",
    icon: Users,
    children: [
      { title: "All Students", href: "/admin/students" },
      { title: "Add Student Details", href: "/admin/students/new" },
      { title: "Edit Student Details", href: "/admin/students/edit" },
      { title: "Student Reports", href: "/admin/students/preview" },
    ],
  },
  {
    title: "Course Intake",
    href: "/admin/intake",
    icon: Calendar,
    children: [
      { title: "All Course Intake", href: "/admin/intake" },
      { title: "Add Course Intake", href: "/admin/intake/new" },
      { title: "Edit Course Intake", href: "/admin/intake/edit" },
    ],
  },
  {
    title: "Course Scheme",
    href: "/admin/schemes",
    icon: FileText,
    children: [
      { title: "All Course Scheme", href: "/admin/scheme" },
      { title: "Add Course Scheme", href: "/admin/scheme/new" },
      { title: "Edit Course Scheme", href: "/admin/scheme/edit" },
    ],
  },
]

export function Navbar() {
  const pathname = usePathname()

  // Function to get current page title based on pathname
  const getCurrentPageTitle = () => {
    // Handle exact matches first
    for (const item of navigationItems) {
      if (pathname === item.href) {
        return item.title
      }

      // Check children for exact matches
      if (item.children) {
        for (const child of item.children) {
          if (pathname === child.href) {
            return child.title
          }
        }
      }
    }

    // Handle dynamic routes (like /admin/courses/edit/123)
    for (const item of navigationItems) {
      if (pathname.startsWith(item.href) && item.href !== "/admin") {
        // Check if it's a child route
        if (item.children) {
          for (const child of item.children) {
            if (pathname.startsWith(child.href)) {
              // Handle specific cases
              if (child.href.includes("/edit") && pathname.includes("/edit/")) {
                return `Edit ${item.title.slice(0, -1)}` // Remove 's' from plural
              }
              if (child.href.includes("/new")) {
                return `Add ${item.title.slice(0, -1)}` // Remove 's' from plural
              }
              if (child.href.includes("/preview") && pathname.includes("/preview/")) {
                return `Preview ${item.title.slice(0, -1)}` // Remove 's' from plural
              }
              return child.title
            }
          }
        }
        return item.title
      }
    }

    // Default fallback
    return "BPIT - Programmes Management"
  }

  const currentPageTitle = getCurrentPageTitle()

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0c4da2] shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Left side - Current Page Title */}
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
            <BookOpen className="h-5 w-5 text-[#0c4da2]" />
          </div>
          <h1 className="text-xl font-bold text-white">{currentPageTitle}</h1>
        </div>

        {/* Right side - Navigation Buttons */}
        <div className="flex items-center space-x-3">
          {/* Back to Admin Button */}
          {pathname !== "/admin" && (
            <Link href="/admin">
              <Button
                variant="outline"
                className="bg-white text-[#0c4da2] border-white hover:bg-gray-100 hover:text-[#0c4da2] font-medium px-4 py-2 rounded-lg"
              >
                Admin
              </Button>
            </Link>
          )}

          {/* Home Button */}
          <Link href="/">
            <Button
              variant="outline"
              className="bg-white text-[#0c4da2] border-white hover:bg-gray-100 hover:text-[#0c4da2] font-medium px-4 py-2 rounded-lg"
            >
              Home
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
