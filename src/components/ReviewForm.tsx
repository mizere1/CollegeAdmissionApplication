import React, { useState } from 'react'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Checkbox } from './ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Separator } from './ui/separator'
import { FormData } from '../App'

interface ReviewFormProps {
  formData: FormData
  onPrev: () => void
  onSubmit: () => void
}

export function ReviewForm({ formData, onPrev, onSubmit }: ReviewFormProps) {
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (!consent) {
      setError('You must consent to the declaration before submitting your application.')
      return
    }
    setError('')
    onSubmit()
  }

  const formatFileList = (files: File[]): string => {
    if (files.length === 0) return 'None'
    return files.map(file => file.name).join(', ')
  }

  const countWords = (text: string): number => {
    return text.trim() === '' ? 0 : text.trim().split(/\s+/).length
  }

  const qualificationMap: Record<string, string> = {
    MSCE: 'Malawi School Certificate of Education (MSCE)',
    high_school: 'High School Diploma',
    a_level: 'A-Level',
    ib: 'International Baccalaureate',
    other: 'Other'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-green-800 border-b-2 border-yellow-500 pb-2">
          Review Your Application
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Name:</span> {formData.personalInfo.firstName} {formData.personalInfo.lastName}
            </div>
            <div>
              <span className="font-medium">Email:</span> {formData.personalInfo.email}
            </div>
            <div>
              <span className="font-medium">Phone:</span> {formData.personalInfo.phone}
            </div>
            <div>
              <span className="font-medium">Date of Birth:</span> {formData.personalInfo.dateOfBirth}
            </div>
          </div>
          <div className="mt-2 text-sm">
            <span className="font-medium">Address:</span> {formData.personalInfo.address}
          </div>
        </div>

        <Separator />

        {/* Education Background */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Education Background</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">High School:</span> {formData.education.highSchool}
            </div>
            <div>
              <span className="font-medium">Graduation Year:</span> {formData.education.graduationYear}
            </div>
            <div>
              <span className="font-medium">Qualification:</span> {qualificationMap[formData.education.qualification] || formData.education.qualification}
            </div>
          </div>
          {formData.education.previousEducation && (
            <div className="mt-2 text-sm">
              <span className="font-medium">Previous Education:</span> {formData.education.previousEducation}
            </div>
          )}
        </div>

        <Separator />

        {/* Essays */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Essays</h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium">Why Royal African College:</span>
              <p className="mt-1 text-gray-600">
                {formData.essays.whyCollege.substring(0, 150)}
                {formData.essays.whyCollege.length > 150 ? '...' : ''}
                <span className="ml-2 text-xs text-gray-500">
                  ({countWords(formData.essays.whyCollege)} words)
                </span>
              </p>
            </div>
            <div>
              <span className="font-medium">Career Goals:</span>
              <p className="mt-1 text-gray-600">
                {formData.essays.careerGoals.substring(0, 150)}
                {formData.essays.careerGoals.length > 150 ? '...' : ''}
                <span className="ml-2 text-xs text-gray-500">
                  ({countWords(formData.essays.careerGoals)} words)
                </span>
              </p>
            </div>
            {formData.essays.leadership && (
              <div>
                <span className="font-medium">Leadership Experience:</span>
                <p className="mt-1 text-gray-600">
                  {formData.essays.leadership.substring(0, 150)}
                  {formData.essays.leadership.length > 150 ? '...' : ''}
                  <span className="ml-2 text-xs text-gray-500">
                    ({countWords(formData.essays.leadership)} words)
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Documents */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Documents</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Certificate:</span> {formData.credentials.certificate?.name || 'Not uploaded'}
            </div>
            <div>
              <span className="font-medium">ID Document:</span> {formData.credentials.idDocument?.name || 'Not uploaded'}
            </div>
            <div>
              <span className="font-medium">Photo:</span> {formData.credentials.photo?.name || 'Not uploaded'}
            </div>
            <div>
              <span className="font-medium">Additional Documents:</span> {formatFileList(formData.credentials.additionalDocs)}
            </div>
          </div>
        </div>

        <Separator />

        {/* Consent */}
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={setConsent}
            />
            <Label htmlFor="consent" className="text-sm leading-relaxed">
              I hereby declare that the information provided is true and accurate to the best of my knowledge. 
              I understand that any false information may result in the rejection of my application or 
              cancellation of my admission. *
            </Label>
          </div>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onPrev}>
            Previous
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-yellow-600 hover:bg-yellow-700 text-black"
          >
            Submit Application
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}