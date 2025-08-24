import React, { useState } from 'react'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Upload, FileText } from 'lucide-react'

interface CredentialsData {
  certificate: File | null
  idDocument: File | null
  photo: File | null
  additionalDocs: File[]
}

interface CredentialsFormProps {
  data: CredentialsData
  updateData: (data: Partial<CredentialsData>) => void
  onNext: () => void
  onPrev: () => void
}

export function CredentialsForm({ data, updateData, onNext, onPrev }: CredentialsFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!data.certificate) {
      newErrors.certificate = 'Certificate upload is required'
    }
    if (!data.idDocument) {
      newErrors.idDocument = 'ID document upload is required'
    }
    if (!data.photo) {
      newErrors.photo = 'Photo upload is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext()
    }
  }

  const handleFileChange = (field: keyof CredentialsData, file: File | null) => {
    updateData({ [field]: file })
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleMultipleFileChange = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files)
      updateData({ additionalDocs: [...data.additionalDocs, ...fileArray] })
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const FileUploadField = ({ 
    label, 
    field, 
    accept, 
    maxSize, 
    file 
  }: { 
    label: string
    field: keyof CredentialsData
    accept: string
    maxSize: string
    file: File | null
  }) => (
    <div className="space-y-2">
      <Label htmlFor={field}>{label}</Label>
      <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        errors[field] ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
      }`}>
        <Input
          id={field}
          type="file"
          accept={accept}
          onChange={(e) => handleFileChange(field, e.target.files?.[0] || null)}
          className="hidden"
        />
        <Label htmlFor={field} className="cursor-pointer">
          <div className="flex flex-col items-center space-y-2">
            <Upload className="w-8 h-8 text-gray-400" />
            <div>
              <p className="text-sm font-medium">
                {file ? file.name : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-gray-500">
                {accept.replace(/\./g, '').toUpperCase()} files (Max size: {maxSize})
              </p>
              {file && (
                <p className="text-xs text-green-600 mt-1">
                  {formatFileSize(file.size)}
                </p>
              )}
            </div>
          </div>
        </Label>
      </div>
      {errors[field] && (
        <p className="text-sm text-red-500">{errors[field]}</p>
      )}
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-green-800 border-b-2 border-yellow-500 pb-2">
          Credentials & Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FileUploadField
          label="Upload your MSCE Certificate or equivalent *"
          field="certificate"
          accept=".pdf,.jpg,.jpeg,.png"
          maxSize="5MB"
          file={data.certificate}
        />

        <FileUploadField
          label="Upload National ID or Passport *"
          field="idDocument"
          accept=".pdf,.jpg,.jpeg,.png"
          maxSize="5MB"
          file={data.idDocument}
        />

        <FileUploadField
          label="Upload Recent Photograph *"
          field="photo"
          accept=".jpg,.jpeg,.png"
          maxSize="2MB"
          file={data.photo}
        />

        <div className="space-y-2">
          <Label htmlFor="additionalDocs">Additional Documents (if any)</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <Input
              id="additionalDocs"
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleMultipleFileChange(e.target.files)}
              className="hidden"
            />
            <Label htmlFor="additionalDocs" className="cursor-pointer">
              <div className="flex flex-col items-center space-y-2">
                <Upload className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Click to upload multiple files</p>
                  <p className="text-xs text-gray-500">
                    PDF, JPG, PNG files (You can select multiple files)
                  </p>
                </div>
              </div>
            </Label>
          </div>
          {data.additionalDocs.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium mb-2">Uploaded files:</p>
              <ul className="space-y-1">
                {data.additionalDocs.map((file, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span>{file.name}</span>
                    <span className="text-gray-500">({formatFileSize(file.size)})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
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