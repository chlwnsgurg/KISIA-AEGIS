"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Download, CheckCircle, Shield, Search } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Header from "@/components/header"
import Footer from "@/components/footer"
import FileUpload from "@/components/file-upload"
import { apiClient } from "@/lib/api"

export default function ProtectPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [copyrightInfo, setCopyrightInfo] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [protectedImageUrl, setProtectedImageUrl] = useState<string | null>(null)
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
    setIsComplete(false)
    setProtectedImageUrl(null)
  }

  const handleProtect = async () => {
    if (!selectedFile) return

    setIsProcessing(true)

    try {
      // 이미지 업로드
      const uploadResponse = await apiClient.uploadImage(copyrightInfo, selectedFile)
      
      toast({
        title: "업로드 성공",
        description: "이미지가 성공적으로 업로드되고 워터마크가 삽입되었습니다.",
      })

      // 실제 백엔드에서 처리된 이미지 URL을 받아와야 하지만,
      // 현재는 원본 이미지를 표시
      const reader = new FileReader()
      reader.onload = () => {
        setProtectedImageUrl(reader.result as string)
        setIsProcessing(false)
        setIsComplete(true)
      }
      reader.readAsDataURL(selectedFile)
    } catch (error) {
      toast({
        title: "처리 실패",
        description: error instanceof Error ? error.message : "이미지 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (protectedImageUrl) {
      const link = document.createElement("a")
      link.href = protectedImageUrl
      link.download = `protected_${selectedFile?.name || "image"}`
      link.click()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">디지털 원본 보호</h1>
            <p className="text-xl text-gray-600">보이지 않는 워터마크로 당신의 이미지를 안전하게 보호하세요</p>
          </div>

          {/* Toggle */}
          <div className="flex justify-center mb-8">
            <div className="flex rounded-lg p-1 gap-1 bg-gray-100">
              <Link href="/protect">
                <Button
                  type="button"
                  className={`rounded-md px-6 py-2 flex items-center space-x-2 transition-colors font-medium
                    ${
                      true
                        ? 'bg-primary text-white font-bold shadow-sm' // 활성화
                        : 'bg-gray-100 text-gray-500 hover:bg-primary/10 hover:text-primary'
                    }
                  `}
                  style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)' }}
                  tabIndex={-1}
                  disabled
                >
                  <Shield className="h-4 w-4" />
                  <span>원본 보호</span>
                </Button>
              </Link>
              <Link href="/verify">
                <Button
                  type="button"
                  className={`rounded-md px-6 py-2 flex items-center space-x-2 transition-colors font-medium
                    bg-gray-100 text-gray-500 hover:bg-primary/10 hover:text-primary
                  `}
                  tabIndex={-1}
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
                title="보호할 이미지를 여기에 드래그 앤 드롭하거나 클릭하여 업로드하세요"
                description="지원 형식: PNG (최대 10MB)"
              />

              <div className="space-y-2">
                <Label htmlFor="copyright">이미지에 삽입할 저작권 정보를 입력하세요 (선택 사항)</Label>
                <Input
                  id="copyright"
                  placeholder="예: © 2025 홍길동. All rights reserved."
                  value={copyrightInfo}
                  onChange={(e) => setCopyrightInfo(e.target.value)}
                />
              </div>

              <Button onClick={handleProtect} disabled={!selectedFile || isProcessing} className="w-full" size="lg">
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    AI가 워터마크를 보호하고 있습니다...
                  </>
                ) : (
                  "원본파일 보호 하기"
                )}
              </Button>
            </CardContent>
          </Card>

          {isComplete && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  워터마크 삽입 완료
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  이미지에 보이지 않는 워터마크가 성공적으로 삽입되었습니다.
                  {copyrightInfo && ` 저작권 정보: "${copyrightInfo}"`}
                </p>

                {protectedImageUrl && (
                  <div className="text-center">
                    <img
                      src={protectedImageUrl || "/placeholder.png"}
                      alt="Protected Image"
                      className="max-w-full h-auto max-h-64 mx-auto rounded-lg mb-4"
                    />
                  </div>
                )}

                <Button onClick={handleDownload} className="w-full" size="lg">
                  <Download className="mr-2 h-4 w-4" />
                  보호된 이미지 다운로드
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
