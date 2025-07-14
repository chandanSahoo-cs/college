-- CreateEnum
CREATE TYPE "role" AS ENUM ('student', 'faculty', 'admin');

-- CreateTable
CREATE TABLE "programmes" (
    "prog_id" VARCHAR(10) NOT NULL,
    "prog_name" VARCHAR(50) NOT NULL,
    "prog_short_name" VARCHAR(20) NOT NULL,
    "regulatory_body_name" VARCHAR(50),
    "regulatory_body_shortname" VARCHAR(10),
    "university_school" VARCHAR(10) NOT NULL,
    "semester_annual" SMALLINT NOT NULL,
    "min_duration_in_years" SMALLINT NOT NULL,
    "max_duration_in_years" SMALLINT NOT NULL,

    CONSTRAINT "programmes_pkey" PRIMARY KEY ("prog_id")
);

-- CreateTable
CREATE TABLE "courses" (
    "course_id" CHAR(3) NOT NULL,
    "course_name" VARCHAR(100) NOT NULL,
    "course_short_name" VARCHAR(20) NOT NULL,
    "prog_id" VARCHAR(10) NOT NULL,
    "semester_annual" SMALLINT NOT NULL,
    "min_duration_in_years" SMALLINT NOT NULL,
    "max_duration_in_years" SMALLINT NOT NULL,
    "total_semester_annual" SMALLINT NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("course_id")
);

-- CreateTable
CREATE TABLE "course_intake" (
    "course_id" CHAR(3) NOT NULL,
    "acad_year" INTEGER NOT NULL,
    "intake" SMALLINT NOT NULL,

    CONSTRAINT "course_intake_pkey" PRIMARY KEY ("course_id","acad_year")
);

-- CreateTable
CREATE TABLE "course_scheme" (
    "scheme_id" VARCHAR(12) NOT NULL,
    "course_id" CHAR(3) NOT NULL,
    "acad_year" INTEGER NOT NULL,
    "semester_annual" SMALLINT NOT NULL,
    "min_duration_in_years" SMALLINT NOT NULL,
    "max_duration_in_years" SMALLINT NOT NULL,
    "total_semester_annual" SMALLINT NOT NULL,
    "min_credits" SMALLINT NOT NULL,
    "max_credits" SMALLINT NOT NULL,
    "regulatory_body_name" VARCHAR(50),
    "regulatory_body_shortname" VARCHAR(10),
    "university_school" VARCHAR(10) NOT NULL,

    CONSTRAINT "course_scheme_pkey" PRIMARY KEY ("scheme_id")
);

-- CreateTable
CREATE TABLE "subject_master" (
    "paper_id" VARCHAR(6) NOT NULL,
    "scheme_id" VARCHAR(12) NOT NULL,
    "paper_code" VARCHAR(10) NOT NULL,
    "paper_name" VARCHAR(100) NOT NULL,
    "credits" SMALLINT NOT NULL,
    "type" SMALLINT NOT NULL,
    "exam" SMALLINT NOT NULL,
    "mode" SMALLINT NOT NULL,
    "paper_group" VARCHAR(5),
    "paper_sub_group" VARCHAR(5),
    "kind" SMALLINT NOT NULL,
    "minor_max_marks" SMALLINT NOT NULL,
    "major_max_marks" SMALLINT NOT NULL,
    "total_max_marks" SMALLINT NOT NULL,
    "pass_marks" SMALLINT NOT NULL,

    CONSTRAINT "subject_master_pkey" PRIMARY KEY ("paper_id","scheme_id")
);

-- CreateTable
CREATE TABLE "students" (
    "student_id" VARCHAR(12) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "gender" CHAR(1),
    "category" VARCHAR(20),
    "domicile" VARCHAR(20),
    "parent_income" VARCHAR(20),
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "place_of_birth" VARCHAR(50),
    "admission_date" TIMESTAMP(3) NOT NULL,
    "mobile" VARCHAR(15),
    "email" VARCHAR(100),
    "present_address" VARCHAR(255),
    "permanent_address" VARCHAR(255),
    "user_id" TEXT,
    "course_id" CHAR(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "student_educational_qualifications" (
    "student_id" VARCHAR(12) NOT NULL,
    "exam_passed" VARCHAR(20) NOT NULL,
    "school_college" VARCHAR(100) NOT NULL,
    "board_university" VARCHAR(100) NOT NULL,
    "year" SMALLINT NOT NULL,
    "percentage" DECIMAL(5,2),
    "pcm_marks" DECIMAL(5,2),

    CONSTRAINT "student_educational_qualifications_pkey" PRIMARY KEY ("student_id","exam_passed")
);

-- CreateTable
CREATE TABLE "student_parents" (
    "student_id" VARCHAR(12) NOT NULL,
    "father_name" VARCHAR(100),
    "father_occupation" VARCHAR(100),
    "father_qualification" VARCHAR(50),
    "father_mobile" VARCHAR(15),
    "father_email" VARCHAR(100),
    "father_office_address" VARCHAR(255),
    "mother_name" VARCHAR(100),
    "mother_occupation" VARCHAR(100),
    "mother_qualification" VARCHAR(50),
    "mother_mobile" VARCHAR(15),
    "mother_email" VARCHAR(100),
    "mother_office_address" VARCHAR(255),

    CONSTRAINT "student_parents_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "fee_reimbursement" (
    "student_id" VARCHAR(12) NOT NULL,
    "agency" VARCHAR(50),
    "reimbursement_amount" DECIMAL(10,2),

    CONSTRAINT "fee_reimbursement_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "undertakings" (
    "student_id" VARCHAR(12) NOT NULL,
    "antiragging_refno" VARCHAR(50) NOT NULL,
    "agreement_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "undertakings_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordhash" TEXT NOT NULL,
    "role" "role" NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "avatar" TEXT NOT NULL,
    "studentid" TEXT,
    "facultyid" TEXT,
    "adminid" TEXT,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faculty" (
    "faculty_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gender" CHAR(1),
    "email" TEXT NOT NULL,
    "mobile" VARCHAR(15),
    "department" TEXT NOT NULL,
    "designation" TEXT,
    "qualification" TEXT,
    "experience" INTEGER,
    "doj" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "user_id" TEXT,

    CONSTRAINT "faculty_pkey" PRIMARY KEY ("faculty_id")
);

-- CreateTable
CREATE TABLE "admins" (
    "admin_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" VARCHAR(15),
    "department" TEXT,
    "designation" TEXT,
    "role_desc" TEXT,
    "doj" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "user_id" TEXT,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("admin_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "students_mobile_key" ON "students"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");

-- CreateIndex
CREATE UNIQUE INDEX "students_user_id_key" ON "students"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_studentid_key" ON "user"("studentid");

-- CreateIndex
CREATE UNIQUE INDEX "user_facultyid_key" ON "user"("facultyid");

-- CreateIndex
CREATE UNIQUE INDEX "user_adminid_key" ON "user"("adminid");

-- CreateIndex
CREATE UNIQUE INDEX "faculty_email_key" ON "faculty"("email");

-- CreateIndex
CREATE UNIQUE INDEX "faculty_user_id_key" ON "faculty"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admins_user_id_key" ON "admins"("user_id");

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_prog_id_fkey" FOREIGN KEY ("prog_id") REFERENCES "programmes"("prog_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_intake" ADD CONSTRAINT "course_intake_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_scheme" ADD CONSTRAINT "course_scheme_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject_master" ADD CONSTRAINT "subject_master_scheme_id_fkey" FOREIGN KEY ("scheme_id") REFERENCES "course_scheme"("scheme_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_educational_qualifications" ADD CONSTRAINT "student_educational_qualifications_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_parents" ADD CONSTRAINT "student_parents_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_reimbursement" ADD CONSTRAINT "fee_reimbursement_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "undertakings" ADD CONSTRAINT "undertakings_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_studentid_fkey" FOREIGN KEY ("studentid") REFERENCES "students"("student_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_facultyid_fkey" FOREIGN KEY ("facultyid") REFERENCES "faculty"("faculty_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_adminid_fkey" FOREIGN KEY ("adminid") REFERENCES "admins"("admin_id") ON DELETE SET NULL ON UPDATE CASCADE;
