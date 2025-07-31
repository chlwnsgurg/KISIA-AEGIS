"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Download, Copy, Share } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ImageComparison from "@/components/image-comparison"

interface ResultPageProps {
  params: {
    id: string
  }
}

export default function ResultPage({ params }: ResultPageProps) {
  const [copySuccess, setCopySuccess] = useState(false)

  // Mock data - in real app, this would be fetched based on the ID
  const mockResult = {
    isManipulated: Math.random() > 0.5,
    confidence: 94.7,
    copyrightInfo: "© 2025 홍길동. All rights reserved.",
    originalImage: "/placeholder.png?height=400&width=600",
    analysisImage: "/placeholder.png?height=400&width=600"
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  const handleDownloadReport = () => {
    // Mock PDF download
    const link = document.createElement("a")
    link.href = "/placeholder.pdf"
    link.download = `aegis-report-${params.id}.pdf`
    link.click()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">무결성 검증 보고서</h1>
            <p className="text-gray-600">분석 ID: {params.id}</p>
          </div>

          {/* Result Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                {mockResult.isManipulated ? (
                  <>
                    <AlertTriangle className="mr-2 h-6 w-6 text-red-500" />
                    <span className="text-red-600">경고: 위변조가 탐지되었습니다</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-6 w-6 text-green-500" />
                    <span className="text-green-600">안전: 원본 이미지로 확인되었습니다</span>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">변조률</p>
                  <p className="text-2xl font-bold">{mockResult.confidence}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">분석 상태</p>
                  <Badge variant={mockResult.isManipulated ? "destructive" : "default"}>
                    {mockResult.isManipulated ? "위변조 탐지" : "원본 확인"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">저작권 정보</p>
                  <p className="text-sm">{mockResult.copyrightInfo || "정보 없음"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
            

          {/* Image Comparison */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>상세 분석 결과</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageComparison
                originalImage={mockResult.originalImage}
                processedImage={mockResult.analysisImage}
                originalLabel="업로드된 이미지"
                processedLabel="위변조 탐지 결과"
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleDownloadReport} size="lg">
              <Download className="mr-2 h-4 w-4" />
              보고서 다운로드 (PDF)
            </Button>
            <Button variant="outline" onClick={handleCopyLink} size="lg">
              {copySuccess ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  링크 복사됨!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  결과 링크 복사
                </>
              )}
            </Button>
            <Button variant="outline" size="lg">
              <Share className="mr-2 h-4 w-4" />
              결과 공유
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
