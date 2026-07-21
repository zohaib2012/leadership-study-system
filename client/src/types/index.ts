export interface Student {
  _id: string
  registrationNo: string
  firstName: string
  lastName: string
  dob: string
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  fatherName: string
  fatherPhone: string
  class?: any
  section?: any
  subjects?: any[]
  type?: 'SCHOOL' | 'ACADEMY'
  status: 'ACTIVE' | 'INACTIVE' | 'PASSED_OUT' | 'TRANSFERRED'
  joiningDate: string
  photo?: string
  address?: string
  fatherEmail?: string
}

export interface Teacher {
  _id: string
  user: any
  qualification?: string
  experience?: number
  salary?: number
  assignedClasses: any[]
  status: string
  joinDate: string
}

export interface ClassItem {
  _id: string
  name: string
  numericLevel?: number
  type: 'SCHOOL' | 'O_LEVEL' | 'AS_LEVEL' | 'A_LEVEL'
  sections?: any[]
  studentCount?: number
}

export interface Subject {
  _id: string
  name: string
  code?: string
  type: 'SCHOOL' | 'ACADEMY'
}

export interface FeeChallan {
  _id: string
  challanNo: string
  student: any
  month: string
  totalAmount: number
  dueDate: string
  status: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE'
  paidAmount: number
}

export interface Attendance {
  _id: string
  student: any
  date: string
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'LEAVE' | 'HALF_DAY'
}
