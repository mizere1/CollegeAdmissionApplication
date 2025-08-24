import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface EducationData {
  highSchool: string
  graduationYear: string
  qualification: string
  previousEducation: string
}

interface EducationFormProps {
  data: EducationData
  updateData: (data: Partial<EducationData>) => void
  onNext: () => void
  onPrev: () => void
}

export function EducationForm({ data, updateData, onNext, onPrev }: EducationFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!data.highSchool.trim()) {
      newErrors.highSchool = 'High school name is required'
    }
    if (!data.graduationYear) {
      newErrors.graduationYear = 'Graduation year is required'
    }
    if (!data.qualification) {
      newErrors.qualification = 'Qualification is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext()
    }
  }

  const handleInputChange = (field: keyof EducationData, value: string) => {
    updateData({ [field]: value })
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1980 + 1 }, (_, i) => currentYear - i)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-green-800 border-b-2 border-yellow-500 pb-2">
          Education Background
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="highSchool">High School Name *</Label>
          <Input
            id="highSchool"
            value={data.highSchool}
            onChange={(e) => handleInputChange('highSchool', e.target.value)}
            className={errors.highSchool ? 'border-red-500' : ''}
          />
          {errors.highSchool && (
            <p className="text-sm text-red-500">{errors.highSchool}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="graduationYear">Graduation Year *</Label>
            <Select 
              value={data.graduationYear} 
              onValueChange={(value) => handleInputChange('graduationYear', value)}
            >
              <SelectTrigger className={errors.graduationYear ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.graduationYear && (
              <p className="text-sm text-red-500">{errors.graduationYear}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="qualification">Qualification *</Label>
            <Select 
              value={data.qualification} 
              onValueChange={(value) => handleInputChange('qualification', value)}
            >
              <SelectTrigger className={errors.qualification ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select qualification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MSCE">Malawi School Certificate of Education (MSCE)</SelectItem>
                <SelectItem value="high_school">High School Diploma</SelectItem>
                <SelectItem value="a_level">A-Level</SelectItem>
                <SelectItem value="ib">International Baccalaureate</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.qualification && (
              <p className="text-sm text-red-500">{errors.qualification}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="previousEducation">Previous Education (if any)</Label>
          <Textarea
            id="previousEducation"
            value={data.previousEducation}
            onChange={(e) => handleInputChange('previousEducation', e.target.value)}
            placeholder="Describe any additional education, certifications, or relevant experience"
          />
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onPrev}>
            Previous
          </Button>
          <Button onClick={handleNext} className="bg-green-800 hover:bg-green-700">
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}