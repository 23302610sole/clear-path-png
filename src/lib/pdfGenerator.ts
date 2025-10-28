import { Student } from './supabase';

interface ClearanceStatus {
  department: string;
  status: string;
  cleared_at?: string;
  cleared_by?: string;
}

export const generateClearanceCertificate = async (
  student: Student,
  clearanceData: ClearanceStatus[]
): Promise<void> => {
  // Create a simple HTML certificate
  const allCleared = clearanceData.every(d => d.status === 'cleared');
  
  if (!allCleared) {
    throw new Error('Cannot generate certificate. Not all departments have been cleared.');
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Clearance Certificate - ${student.student_id}</title>
      <style>
        body {
          font-family: 'Times New Roman', serif;
          max-width: 800px;
          margin: 40px auto;
          padding: 40px;
          border: 3px double #800000;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
        }
        .logo {
          font-size: 48px;
          color: #800000;
          font-weight: bold;
        }
        .university {
          font-size: 24px;
          color: #800000;
          margin: 10px 0;
        }
        .title {
          font-size: 32px;
          color: #800000;
          margin: 30px 0;
          text-decoration: underline;
        }
        .content {
          line-height: 2;
          font-size: 16px;
        }
        .student-info {
          margin: 30px 0;
          padding: 20px;
          background: #f5f5f5;
        }
        .department-list {
          margin: 20px 0;
        }
        .department-item {
          padding: 10px;
          margin: 5px 0;
          border-left: 4px solid #DAA520;
          background: #f9f9f9;
        }
        .footer {
          margin-top: 50px;
          text-align: center;
        }
        .signature {
          margin-top: 60px;
          text-align: right;
        }
        .signature-line {
          border-top: 2px solid #000;
          width: 300px;
          margin: 10px 0 5px auto;
        }
        @media print {
          body { margin: 0; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">PNG UOT</div>
        <div class="university">Papua New Guinea University of Technology</div>
        <div class="title">CLEARANCE CERTIFICATE</div>
      </div>

      <div class="content">
        <p>This is to certify that:</p>
        
        <div class="student-info">
          <p><strong>Name:</strong> ${student.full_name}</p>
          <p><strong>Student ID:</strong> ${student.student_id}</p>
          <p><strong>Department:</strong> ${student.department}</p>
          ${student.course_code ? `<p><strong>Course:</strong> ${student.course_code}</p>` : ''}
          ${student.year_level ? `<p><strong>Year:</strong> ${student.year_level}</p>` : ''}
          ${student.clearance_reason ? `<p><strong>Reason:</strong> ${student.clearance_reason.replace(/_/g, ' ').toUpperCase()}</p>` : ''}
        </div>

        <p>Has successfully completed clearance from the following departments:</p>

        <div class="department-list">
          ${clearanceData.map(dept => `
            <div class="department-item">
              <strong>${dept.department}</strong><br>
              Status: ${dept.status.toUpperCase()}<br>
              ${dept.cleared_at ? `Cleared on: ${new Date(dept.cleared_at).toLocaleDateString()}` : ''}<br>
              ${dept.cleared_by ? `Approved by: ${dept.cleared_by}` : ''}
            </div>
          `).join('')}
        </div>

        <p>This certificate confirms that the student has no outstanding obligations to the university and is cleared for:</p>
        <ul>
          <li>Collection of academic transcripts</li>
          <li>Final certificate collection</li>
          <li>Exit from university premises</li>
        </ul>

        <div class="signature">
          <div class="signature-line"></div>
          <p><strong>Registrar</strong></p>
          <p>Papua New Guinea University of Technology</p>
          <p>Date: ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="footer">
          <p><em>This is an automatically generated certificate. Certificate ID: ${student.id.substring(0, 8).toUpperCase()}</em></p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Create a new window and print
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
    };
  } else {
    throw new Error('Could not open print window. Please check your popup blocker settings.');
  }
};
