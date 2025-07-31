"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Shield, Search } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Header from "@/components/header"
import Footer from "@/components/footer"
import FileUpload from "@/components/file-upload"
import { apiClient } from "@/lib/api"

export default function VerifyPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // 인증 확인
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 약간의 지연을 두어 쿠키가 완전히 로드되도록 함
        await new Promise(resolve => setTimeout(resolve, 100))
        
        if (!apiClient.isAuthenticated()) {
          toast({
            title: "로그인 필요",
            description: "이 서비스를 이용하려면 로그인이 필요합니다.",
            variant: "destructive",
          })
          router.push("/login")
        }
      } catch (error) {
        console.error('Auth check error:', error)
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkAuth()
  }, [router, toast])

  if (isCheckingAuth) return null;

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
  }

  const handleVerify = async () => {
    if (!selectedFile) return

    setIsProcessing(true)

    try {
      // 이미지 검증
      const validateResponse = await apiClient.validateImage(selectedFile)
      
      toast({
        title: "검증 완료",
        description: "이미지 분석이 완료되었습니다.",
      })

      // 결과 페이지로 이동
      // 실제로는 백엔드에서 받은 분석 ID를 사용해야 함
      const resultId = Math.random().toString(36).substr(2, 9)
      router.push(`/result/${resultId}`)
    } catch (error) {
      toast({
        title: "검증 실패",
        description: error instanceof Error ? error.message : "이미지 검증 중 오류가 발생했습니다.",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">AI 위변조 검증</h1>
            <p className="text-xl text-gray-600">의심스러운 이미지를 업로드하여 위변조 여부를 확인하세요</p>
          </div>

          {/* Toggle */}
          <div className="flex justify-center mb-8">
            <div className="flex rounded-lg p-1 gap-1 bg-gray-100">
              <Link href="/protect">
                <Button
                  type="button"
                  className={`rounded-md px-6 py-2 flex items-center space-x-2 transition-colors font-medium
                    bg-gray-100 text-gray-500 hover:bg-primary/10 hover:text-primary
                  `}
                  tabIndex={-1}
                >
                  <Shield className="h-4 w-4" />
                  <span>원본 보호</span>
                </Button>
              </Link>
              <Link href="/verify">
                <Button
                  type="button"
                  className={`rounded-md px-6 py-2 flex items-center space-x-2 transition-colors font-medium
                    bg-primary text-white font-bold shadow-sm
                  `}
                  style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)' }}
                  tabIndex={-1}
                  disabled
                >
                  <Search className="h-4 w-4" />
                  <span>위변조 검증</span>
                </Button>
              </Link>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>이미지 업로드</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FileUpload
                onFileSelect={handleFileSelect}
                title="검증할 이미지를 여기에 드래그 앤 드롭하거나 클릭하여 업로드하세요"
                description="지원 형식: PNG (최대 10MB)"
              />

              <Button onClick={handleVerify} disabled={!selectedFile || isProcessing} className="w-full" size="lg">
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    AI가 이미지를 정밀 분석하고 있습니다...
                  </>
                ) : (
                  "검증 시작하기"
                )}
              </Button>
            </CardContent>
          </Card>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">검증 과정 안내</h3>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• AI가 이미지의 픽셀 패턴을 분석합니다</li>
              <li>• 딥페이크 및 편집 흔적을 탐지합니다</li>
              <li>• 워터마크 정보를 추출합니다</li>
              <li>• 종합적인 무결성 보고서를 생성합니다</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
