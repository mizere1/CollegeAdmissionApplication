import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { Hono } from "npm:hono"
import { logger } from "npm:hono/logger"
import { cors } from "npm:hono/cors"
import { createClient } from "npm:@supabase/supabase-js"
import { Resend } from "npm:resend"
import * as kv from './kv_store.tsx'

const app = new Hono()

app.use('*', logger(console.log))
app.use('*', cors({
  origin: '*',
  allowHeaders: ['*'],
  allowMethods: ['*'],
}))

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// Initialize Resend with API key from environment variable
const resendApiKey = Deno.env.get('RESEND_API_KEY')
if (!resendApiKey) {
  console.error('RESEND_API_KEY environment variable is not set')
}
const resend = new Resend(resendApiKey!)

// Generate student ID
function generateStudentId(): string {
  return 'RAC' + Math.floor(100000 + Math.random() * 900000)
}

// Send email using Resend SDK
async function sendEmail(to: string, subject: string, html: string) {
  try {
    console.log(`Sending email to: ${to}`)
    
    const { data, error } = await resend.emails.send({
      from: 'Royal African College <admissions@resend.dev>',
      to: [to],
      subject: subject,
      html: html,
    })

    if (error) {
      console.error('Resend API error:', error)
      throw new Error(`Failed to send email: ${error.message}`)
    }

    console.log('Email sent successfully:', data)
    return data

  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}

// Generate admission letter HTML
function generateAdmissionLetterHTML(firstName: string, lastName: string, studentId: string): string {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Admission Letter - Royal African College</title>
      <style>
        body {
          font-family: 'Times New Roman', serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #14532d;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #14532d;
          margin-bottom: 10px;
        }
        .college-info {
          font-size: 14px;
          color: #666;
        }
        .date {
          text-align: right;
          margin-bottom: 30px;
          font-style: italic;
        }
        .letter-content {
          margin-bottom: 40px;
        }
        .letter-content p {
          margin-bottom: 20px;
        }
        .highlight {
          background-color: #fef3c7;
          padding: 15px;
          border-left: 4px solid #d4af37;
          margin: 20px 0;
          border-radius: 4px;
        }
        .bank-details {
          background-color: #f8f9fa;
          padding: 20px;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          font-family: 'Courier New', monospace;
          margin: 20px 0;
          font-size: 14px;
        }
        .signature-section {
          margin-top: 50px;
          text-align: right;
        }
        .signature {
          border-bottom: 1px solid #333;
          width: 200px;
          margin-left: auto;
          margin-bottom: 5px;
          height: 40px;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        .seal {
          position: absolute;
          top: 50px;
          right: 50px;
          opacity: 0.1;
          font-size: 60px;
          transform: rotate(15deg);
          color: #14532d;
          font-weight: bold;
        }
        .contact-info {
          background-color: #e8f5e8;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #14532d;
        }
        .payment-deadline {
          background-color: #fff3cd;
          color: #856404;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #ffeeba;
          margin: 20px 0;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="seal">OFFICIAL</div>
      
      <div class="header">
        <div class="logo">ROYAL AFRICAN COLLEGE</div>
        <div class="college-info">
          Excellence in Education | Transforming Lives<br>
          P.O. Box 12345, Lilongwe, Malawi<br>
          Tel: +265 1 234 5678 | Email: info@royalafricancollege.edu
        </div>
      </div>

      <div class="date">
        Date: ${currentDate}
      </div>

      <div class="letter-content">
        <p><strong>Dear ${firstName} ${lastName},</strong></p>

        <p>On behalf of the Admissions Committee and the entire Royal African College community, I am <strong>delighted to inform you that you have been ACCEPTED FOR ADMISSION</strong> to Royal African College for the upcoming academic year.</p>

        <p>Your application demonstrated exceptional academic promise, outstanding personal qualities, and a genuine commitment to excellence that perfectly aligns with our institution's values and mission. We were particularly impressed with your essay responses, educational background, and the potential you showed throughout the application process.</p>

        <div class="highlight">
          <p><strong>🎉 CONGRATULATIONS!</strong></p>
          <p>You have been admitted to our <strong>Bachelor of Science program</strong> with <strong>tuition-free status</strong>, in recognition of your outstanding achievements and potential.</p>
          <p><strong>Your Student ID:</strong> <span style="font-family: monospace; font-size: 18px; color: #14532d;">${studentId}</span></p>
        </div>

        <div class="payment-deadline">
          ⚠️ <strong>IMPORTANT:</strong> To secure your place, please complete payment within <strong>30 days</strong> of receiving this letter.
        </div>

        <p>To complete your enrollment, please remit the application processing fee of <strong>K35,000 (Thirty-Five Thousand Kwacha)</strong> to the following account:</p>

        <div class="bank-details">
          <strong>PAYMENT DETAILS:</strong><br><br>
          Bank: Standard Bank Malawi<br>
          Account Name: Excellence Assured<br>
          Account Number: 9100004918824<br>
          Branch: Lilongwe Main Branch<br>
          Swift Code: STBLMWMW<br><br>
          <strong>Payment Reference: ${studentId}</strong><br>
          <em>(CRITICAL: Use your Student ID as payment reference)</em>
        </div>

        <p><strong>Upon receipt of your payment, we will send you:</strong></p>
        <ul style="margin-left: 20px;">
          <li>✅ Official enrollment confirmation certificate</li>
          <li>📚 Student handbook and academic calendar</li>
          <li>📅 Orientation schedule and campus information</li>
          <li>🔑 Access credentials to the student portal</li>
          <li>🏠 Housing application (if required)</li>
          <li>🎓 Course registration materials</li>
        </ul>

        <div class="contact-info">
          <p><strong>📅 Important Dates:</strong></p>
          <p>• Orientation Week: <strong>August 26, 2024</strong></p>
          <p>• Classes Begin: <strong>September 2, 2024</strong></p>
          <p>• Registration Deadline: <strong>${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>
        </div>

        <p>Should you have any questions regarding your admission, payment process, or need assistance with enrollment, please do not hesitate to contact our Admissions Office:</p>
        
        <div class="contact-info">
          <p><strong>📞 Contact Information:</strong></p>
          <p>Email: <a href="mailto:admissions@royalafricancollege.edu" style="color: #14532d;">admissions@royalafricancollege.edu</a></p>
          <p>Phone: +265 1 234 5678</p>
          <p>Office Hours: Monday - Friday, 8:00 AM - 5:00 PM</p>
        </div>

        <p>We are incredibly excited about the contributions you will make to our academic community and the bright future that awaits you at Royal African College. Welcome to the family!</p>

        <p><strong>Congratulations once again on this outstanding achievement!</strong></p>

        <p>Sincerely,</p>
      </div>

      <div class="signature-section">
        <div class="signature"></div>
        <p><strong>Dr. Margaret Banda</strong><br>
        Director of Admissions<br>
        Royal African College<br>
        <em>mbanda@royalafricancollege.edu</em></p>
      </div>

      <div class="footer">
        <p><strong>This is an official document from Royal African College.</strong></p>
        <p>Please keep this letter for your records and present it during orientation.</p>
        <p>© 2024 Royal African College. All rights reserved. | Accredited by the National Council for Higher Education</p>
      </div>
    </body>
    </html>
  `
}

// Generate confirmation email for the college administration
function generateAdminNotificationHTML(applicationData: any, studentId: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>New Application Received</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #14532d; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; border: 1px solid #ddd; }
        .field { margin-bottom: 10px; }
        .label { font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New Application Received</h2>
        </div>
        <div class="content">
          <div class="field">
            <span class="label">Student:</span> ${applicationData.personalInfo.firstName} ${applicationData.personalInfo.lastName}
          </div>
          <div class="field">
            <span class="label">Email:</span> ${applicationData.personalInfo.email}
          </div>
          <div class="field">
            <span class="label">Phone:</span> ${applicationData.personalInfo.phone}
          </div>
          <div class="field">
            <span class="label">Student ID:</span> ${studentId}
          </div>
          <div class="field">
            <span class="label">High School:</span> ${applicationData.education.highSchool}
          </div>
          <div class="field">
            <span class="label">Submitted:</span> ${new Date().toLocaleString()}
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

// Submit application endpoint
app.post('/make-server-8812e0fb/submit-application', async (c) => {
  try {
    console.log('Received application submission request')
    const applicationData = await c.req.json()
    
    // Validate required fields
    if (!applicationData.personalInfo?.firstName || !applicationData.personalInfo?.lastName || !applicationData.personalInfo?.email) {
      return c.json({ 
        success: false, 
        error: 'Missing required personal information fields' 
      }, 400)
    }

    // Generate student ID
    const studentId = generateStudentId()
    console.log(`Generated Student ID: ${studentId}`)
    
    // Store application in database
    const applicationKey = `application_${studentId}`
    await kv.set(applicationKey, {
      ...applicationData,
      studentId,
      submittedAt: new Date().toISOString(),
      status: 'submitted',
      paymentStatus: 'pending'
    })

    console.log(`Application stored in database with key: ${applicationKey}`)

    // Create admission letter HTML
    const admissionLetterHTML = generateAdmissionLetterHTML(
      applicationData.personalInfo.firstName,
      applicationData.personalInfo.lastName,
      studentId
    )

    // Send admission email to student
    const emailSubject = `🎉 Congratulations ${applicationData.personalInfo.firstName}! Your Admission to Royal African College`
    
    console.log(`Preparing to send admission email to: ${applicationData.personalInfo.email}`)
    
    await sendEmail(
      applicationData.personalInfo.email,
      emailSubject,
      admissionLetterHTML
    )

    console.log('Admission email sent successfully')

    // Send notification to admissions office (optional - uncomment if needed)
    /*
    const adminNotificationHTML = generateAdminNotificationHTML(applicationData, studentId)
    await sendEmail(
      'admissions@royalafricancollege.edu',
      `New Application: ${applicationData.personalInfo.firstName} ${applicationData.personalInfo.lastName}`,
      adminNotificationHTML
    )
    */

    // Log successful submission
    console.log(`Application submitted successfully for ${applicationData.personalInfo.firstName} ${applicationData.personalInfo.lastName} (${studentId})`)

    return c.json({
      success: true,
      message: 'Application submitted successfully and admission letter sent',
      studentId: studentId,
      email: applicationData.personalInfo.email,
      submittedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error submitting application:', error)
    
    // Return more specific error information
    let errorMessage = 'Failed to submit application. Please try again.'
    if (error instanceof Error) {
      if (error.message.includes('email')) {
        errorMessage = 'Application saved but failed to send email. Please contact admissions.'
      } else if (error.message.includes('validation')) {
        errorMessage = 'Please check that all required fields are filled correctly.'
      } else {
        errorMessage = error.message
      }
    }

    return c.json(
      { 
        success: false, 
        error: errorMessage,
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      500
    )
  }
})

// Get application status endpoint
app.get('/make-server-8812e0fb/application/:studentId', async (c) => {
  try {
    const studentId = c.req.param('studentId')
    console.log(`Fetching application for Student ID: ${studentId}`)
    
    const application = await kv.get(`application_${studentId}`)
    
    if (!application) {
      console.log(`Application not found for Student ID: ${studentId}`)
      return c.json({ success: false, error: 'Application not found' }, 404)
    }

    return c.json({
      success: true,
      application: {
        studentId: application.studentId,
        name: `${application.personalInfo.firstName} ${application.personalInfo.lastName}`,
        email: application.personalInfo.email,
        status: application.status,
        paymentStatus: application.paymentStatus || 'pending',
        submittedAt: application.submittedAt
      }
    })

  } catch (error) {
    console.error('Error fetching application:', error)
    return c.json({ 
      success: false, 
      error: 'Failed to fetch application status' 
    }, 500)
  }
})

// Resend admission letter endpoint
app.post('/make-server-8812e0fb/resend-letter/:studentId', async (c) => {
  try {
    const studentId = c.req.param('studentId')
    const application = await kv.get(`application_${studentId}`)
    
    if (!application) {
      return c.json({ success: false, error: 'Application not found' }, 404)
    }

    const admissionLetterHTML = generateAdmissionLetterHTML(
      application.personalInfo.firstName,
      application.personalInfo.lastName,
      studentId
    )

    await sendEmail(
      application.personalInfo.email,
      `🎉 [RESENT] Your Admission Letter - Royal African College (${studentId})`,
      admissionLetterHTML
    )

    console.log(`Admission letter resent successfully to ${application.personalInfo.email}`)

    return c.json({
      success: true,
      message: 'Admission letter resent successfully'
    })

  } catch (error) {
    console.error('Error resending admission letter:', error)
    return c.json({ 
      success: false, 
      error: 'Failed to resend admission letter' 
    }, 500)
  }
})

// Health check endpoint
app.get('/make-server-8812e0fb/health', (c) => {
  return c.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
      email: resendApiKey ? 'configured' : 'not_configured'
    }
  })
})

console.log('🚀 Royal African College Admissions Server starting...')
console.log('📧 Email service:', resendApiKey ? 'Configured with Resend' : 'Not configured')

serve(app.fetch)