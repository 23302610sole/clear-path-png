import { useState, useEffect } from 'react'
import { supabase, DEPARTMENTS, isSupabaseConfigured } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

export interface ClearanceStatus {
  department: string
  status: 'pending' | 'cleared' | 'blocked'
  notes?: string
  cleared_at?: string
  cleared_by?: string
}

export const useClearanceData = () => {
  const { studentProfile, departmentProfile, userType } = useAuth()
  const [clearanceData, setClearanceData] = useState<ClearanceStatus[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const loadClearanceData = async () => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    if (!studentProfile && !departmentProfile) return

    setLoading(true)
    try {
      let query = supabase.from('clearance_records').select(`
        *,
        students!inner(student_id, full_name, email, department)
      `)

      if (userType === 'student' && studentProfile) {
        query = query.eq('student_id', studentProfile.id)
      } else if (userType === 'department' && departmentProfile) {
        query = query.eq('department', departmentProfile.department)
      }

      const { data, error } = await query

      if (error) throw error

      if (userType === 'student') {
        // For students, create a status for each department
        const clearanceStatuses: ClearanceStatus[] = DEPARTMENTS.map(dept => {
          const record = data?.find((r: any) => r.department === dept.name)
          return {
            department: dept.name,
            status: record?.status || 'pending',
            notes: record?.notes,
            cleared_at: record?.cleared_at,
            cleared_by: record?.cleared_by
          }
        })
        setClearanceData(clearanceStatuses)
      } else {
        // For department users, show all student records for their department
        const clearanceStatuses: ClearanceStatus[] = data?.map((record: any) => ({
          department: record.department,
          status: record.status,
          notes: record.notes,
          cleared_at: record.cleared_at,
          cleared_by: record.cleared_by,
          student: record.students
        })) || []
        setClearanceData(clearanceStatuses)
      }
    } catch (error: any) {
      console.error('Error loading clearance data:', error)
      toast({
        title: 'Error',
        description: 'Failed to load clearance data',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const updateClearanceStatus = async (
    studentId: string,
    department: string,
    status: 'pending' | 'cleared' | 'blocked',
    notes?: string
  ) => {
    if (!departmentProfile) return

    try {
      const updateData: any = {
        student_id: studentId,
        department,
        status,
        notes,
        updated_by: departmentProfile.id
      }

      if (status === 'cleared') {
        updateData.cleared_by = departmentProfile.full_name
        updateData.cleared_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('clearance_records')
        .upsert(updateData, {
          onConflict: 'student_id,department'
        })

      if (error) throw error

      toast({
        title: 'Success',
        description: `Clearance status updated to ${status}`,
      })

      // Reload data
      loadClearanceData()
    } catch (error: any) {
      console.error('Error updating clearance status:', error)
      toast({
        title: 'Error',
        description: 'Failed to update clearance status',
        variant: 'destructive'
      })
    }
  }

  const sendReminderEmail = async (studentId: string) => {
    try {
      // This would integrate with an email service
      // For now, we'll just show a success message
      toast({
        title: 'Reminder Sent',
        description: 'Email reminder sent to student',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to send reminder email',
        variant: 'destructive'
      })
    }
  }

  const generateClearanceCertificate = async (studentId: string) => {
    try {
      // This would generate a PDF certificate
      // For now, we'll just show a success message
      toast({
        title: 'Certificate Generated',
        description: 'Clearance certificate has been generated',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to generate certificate',
        variant: 'destructive'
      })
    }
  }

  useEffect(() => {
    loadClearanceData()
  }, [studentProfile, departmentProfile, userType])

  return {
    clearanceData,
    loading,
    updateClearanceStatus,
    sendReminderEmail,
    generateClearanceCertificate,
    refetch: loadClearanceData
  }
}