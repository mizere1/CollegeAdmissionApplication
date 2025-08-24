import React, { useState } from 'react'
import { Navigation } from './components/Navigation'
import { ApplicationHeader } from './components/ApplicationHeader'
import { ProgressSteps } from './components/ProgressSteps'
import { PersonalInfoForm } from './components/PersonalInfoForm'
import { EducationForm } from './components/EducationForm'
import { EssaysForm } from './components/EssaysForm'
import { CredentialsForm } from './components/CredentialsForm'
import { ReviewForm } from './components/ReviewForm'
import { SuccessMessage } from './components/SuccessMessage'
import { LoadingSpinner } from './components/LoadingSpinner'
import { ErrorMessage } from './components/ErrorMessage'
import { projectId, publicAnonKey } from './utils/supabase/info'

export interface FormData {
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    dateOfBirth: string
    address: string
  }
  education: {
    highSchool: string
    graduationYear: string
    qualification: string
    previousEducation: string
  }
  essays: {
    whyCollege: string
    careerGoals: string
    leadership: string
  }
  credentials: {
    certificate: File | null
    idDocument: File | null
    photo: File | null
    additionalDocs: File[]
  }
}

const initialFormData: FormData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: ''
  },
  education: {
    highSchool: '',
    graduationYear: '',
    qualification: '',
    previousEducation: ''
  },
  essays: {
    whyCollege: '',
    careerGoals: '',
    leadership: ''
  },
  credentials: {
    certificate: null,
    idDocument: null,
    photo: null,
    additionalDocs: []
  }
}

export default function App() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [studentId, setStudentId] = useState<string | null>(null)

  const steps = ['Personal Info', 'Education', 'Essays', 'Credentials', 'Review']

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateFormData = (section: keyof FormData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }))
  }

  const submitApplication = async () => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Convert file data to base64 for transmission (in a real app, you'd upload files separately)
      const submissionData = {
        personalInfo: formData.personalInfo,
        education: formData.education,
        essays: formData.essays,
        credentials: {
          certificateUploaded: !!formData.credentials.certificate,
          idDocumentUploaded: !!formData.credentials.idDocument,
          photoUploaded: !!formData.credentials.photo,
          additionalDocsCount: formData.credentials.additionalDocs.length
        }
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8812e0fb/submit-application`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData)
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit application')
      }

      if (result.success) {
        setStudentId(result.studentId)
        setIsSubmitted(true)
      } else {
        throw new Error(result.error || 'Application submission failed')
      }

    } catch (error) {
      console.error('Application submission error:', error)
      setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetApplication = () => {
    setCurrentStep(0)
    setFormData(initialFormData)
    setIsSubmitted(false)
    setIsSubmitting(false)
    setSubmitError(null)
    setStudentId(null)
  }

  // Show loading spinner during submission
  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  // Show error message if submission failed
  if (submitError) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage 
            error={submitError} 
            onRetry={() => setSubmitError(null)}
            onReset={resetApplication}
          />
        </div>
      </div>
    )
  }

  // Show success message after submission
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <SuccessMessage 
            studentId={studentId}
            email={formData.personalInfo.email}
            onNewApplication={resetApplication}
          />
        </div>
      </div>
    )
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalInfoForm
            data={formData.personalInfo}
            updateData={(data) => updateFormData('personalInfo', data)}
            onNext={nextStep}
          />
        )
      case 1:
        return (
          <EducationForm
            data={formData.education}
            updateData={(data) => updateFormData('education', data)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 2:
        return (
          <EssaysForm
            data={formData.essays}
            updateData={(data) => updateFormData('essays', data)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 3:
        return (
          <CredentialsForm
            data={formData.credentials}
            updateData={(data) => updateFormData('credentials', data)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 4:
        return (
          <ReviewForm
            formData={formData}
            onPrev={prevStep}
            onSubmit={submitApplication}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ApplicationHeader />
        
        <ProgressSteps 
          steps={steps} 
          currentStep={currentStep} 
        />
        
        <div className="mt-8">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  )
}