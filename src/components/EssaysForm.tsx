import React, { useState } from 'react'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface EssaysData {
  whyCollege: string
  careerGoals: string
  leadership: string
}

interface EssaysFormProps {
  data: EssaysData
  updateData: (data: Partial<EssaysData>) => void
  onNext: () => void
  onPrev: () => void
}

export function EssaysForm({ data, updateData, onNext, onPrev }: EssaysFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const countWords = (text: string): number => {
    return text.trim() === '' ? 0 : text.trim().split(/\s+/).length
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    const whyCollegeWords = countWords(data.whyCollege)
    const careerGoalsWords = countWords(data.careerGoals)

    if (whyCollegeWords < 500) {
      newErrors.whyCollege = `This essay requires at least 500 words. Current: ${whyCollegeWords} words`
    }
    if (careerGoalsWords < 500) {
      newErrors.careerGoals = `This essay requires at least 500 words. Current: ${careerGoalsWords} words`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext()
    }
  }

  const handleInputChange = (field: keyof EssaysData, value: string) => {
    updateData({ [field]: value })
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-green-800 border-b-2 border-yellow-500 pb-2">
          Application Essays
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="whyCollege">
            Why do you want to study at Royal African College? (Minimum 500 words) *
          </Label>
          <Textarea
            id="whyCollege"
            value={data.whyCollege}
            onChange={(e) => handleInputChange('whyCollege', e.target.value)}
            className={`min-h-32 ${errors.whyCollege ? 'border-red-500' : ''}`}
            placeholder="Share your motivation for choosing Royal African College and how it aligns with your academic and personal goals..."
          />
          <div className="flex justify-between items-center">
            {errors.whyCollege && (
              <p className="text-sm text-red-500">{errors.whyCollege}</p>
            )}
            <p className="text-sm text-gray-500 ml-auto">
              {countWords(data.whyCollege)} words
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="careerGoals">
            Describe your career goals and how our program will help you achieve them. (Minimum 500 words) *
          </Label>
          <Textarea
            id="careerGoals"
            value={data.careerGoals}
            onChange={(e) => handleInputChange('careerGoals', e.target.value)}
            className={`min-h-32 ${errors.careerGoals ? 'border-red-500' : ''}`}
            placeholder="Outline your career aspirations and explain how Royal African College's program will support your professional development..."
          />
          <div className="flex justify-between items-center">
            {errors.careerGoals && (
              <p className="text-sm text-red-500">{errors.careerGoals}</p>
            )}
            <p className="text-sm text-gray-500 ml-auto">
              {countWords(data.careerGoals)} words
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="leadership">
            Share an experience that demonstrates your leadership abilities. (Minimum 300 words)
          </Label>
          <Textarea
            id="leadership"
            value={data.leadership}
            onChange={(e) => handleInputChange('leadership', e.target.value)}
            className="min-h-32"
            placeholder="Describe a situation where you demonstrated leadership skills, the challenges you faced, and the outcomes you achieved..."
          />
          <p className="text-sm text-gray-500 text-right">
            {countWords(data.leadership)} words
          </p>
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