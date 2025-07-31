"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Search, Eye, Shield, AlertTriangle, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { apiClient } from "@/lib/api"

interface ImageRecord {
  id: string
  filename: string
  uploadDate: string
  type: "protect" | "verify"
  status: "safe" | "manipulated" | "protected"
  confidence?: number
  thumbnail: string
  size: string
  tamperRate?: number // Added for mock data
}

export default function MyImagesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // 인증 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 약간의 지연을 두어 쿠키가 완전히 로드되도록 함
        await new Promise(resolve => setTimeout(resolve, 100))
        
        if (!apiClient.isAuthenticated()) {
          toast({
            title: "로그인 필요",
            description: "내 이미지에 접근하려면 로그인이 필요합니다.",
            variant: "destructive",
          })
          router.push("/login")
          return
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

  // Mock data
  const mockImages: ImageRecord[] = [
    {
      id: "img001",
      filename: "portrait_photo.jpg",
      uploadDate: "2025-01-15",
      type: "protect",
      status: "protected",
      thumbnail: "/placeholder.png?height=150&width=150",
      size: "2.4 MB",
    },
    {
      id: "img002",
      filename: "suspicious_image.png",
      uploadDate: "2025-01-14",
      type: "verify",
      status: "manipulated",
      tamperRate: 5.3,
      thumbnail: "/placeholder.png?height=150&width=150",
      size: "1.8 MB",
    },
    {
      id: "img003",
      filename: "document_scan.jpg",
      uploadDate: "2025-01-13",
      type: "verify",
      status: "safe",
      tamperRate: 1.2,
      thumbnail: "/placeholder.png?height=150&width=150",
      size: "3.1 MB",
    },
    {
      id: "img004",
      filename: "family_photo.jpg",
      uploadDate: "2025-01-12",
      type: "protect",
      status: "protected",
      thumbnail: "/placeholder.png?height=150&width=150",
      size: "4.2 MB",
    },
    {
      id: "img005",
      filename: "news_image.png",
      uploadDate: "2025-01-11",
      type: "verify",
      status: "manipulated",
      tamperRate: 8.7,
      thumbnail: "/placeholder.png?height=150&width=150",
      size: "2.7 MB",
    },
  ]

  const filteredImages = mockImages.filter((image) => {
    const matchesSearch = image.filename.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || image.type === filterType
    const matchesStatus = filterStatus === "all" || image.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "protected":
        return <Shield className="h-4 w-4 text-green-600" />
      case "safe":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "manipulated":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "protected":
        return <Badge className="bg-green-100 text-green-800">보호됨</Badge>
      case "safe":
        return <Badge className="bg-green-100 text-green-800">안전</Badge>
      case "manipulated":
        return <Badge variant="destructive">위변조 탐지</Badge>
      default:
        return null
    }
  }

  const handleDownload = (imageId: string) => {
    // Mock download functionality
    console.log(`Downloading image: ${imageId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">내 이미지</h1>
            <p className="text-xl text-gray-600">업로드한 이미지와 분석 결과를 관리하세요</p>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="파일명으로 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="유형 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 유형</SelectItem>
                    <SelectItem value="protect">원본 보호</SelectItem>
                    <SelectItem value="verify">위변조 검증</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="상태 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 상태</SelectItem>
                    <SelectItem value="protected">보호됨</SelectItem>
                    <SelectItem value="safe">안전</SelectItem>
                    <SelectItem value="manipulated">위변조 탐지</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Images Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image) => (
              <Card key={image.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={image.thumbnail || "/placeholder.png"}
                      alt={image.filename}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-medium text-gray-900 truncate">{image.filename}</h3>
                      <p className="text-sm text-gray-500">
                        {image.size} • {image.uploadDate}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {/* 보호된 이미지는 보호됨만, 검증 이미지는 변조률/탐지 뱃지 */}
                        {image.type === "protect" ? (
                          <Badge className="bg-green-100 text-green-800">보호됨</Badge>
                        ) : (
                          <>
                            {image.status === "manipulated" && <Badge variant="destructive">위변조 탐지</Badge>}
                            {image.status === "safe" && <Badge className="bg-green-100 text-green-800">안전</Badge>}
                          </>
                        )}
                      </div>
                      <Badge variant="outline">{image.type === "protect" ? "보호" : "검증"}</Badge>
                    </div>

                    {/* 변조 이미지만 변조률 표시 */}
                    {image.type === "verify" && typeof image.tamperRate === "number" && (
                      <div className="text-sm text-gray-600">변조률: {image.tamperRate}%</div>
                    )}

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Eye className="h-4 w-4 mr-1" />
                        <Link href={`/result/${image.id}`}>결과 보기</Link>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDownload(image.id)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-gray-500 mb-4">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">검색 결과가 없습니다</p>
                  <p className="text-sm">다른 검색어나 필터를 시도해보세요</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="mt-12 text-center">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">새로운 이미지 분석</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/protect">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Shield className="mr-2 h-4 w-4" />
                    원본 보호하기
                  </Button>
                </Link>
                <Link href="/verify">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                    <Search className="mr-2 h-4 w-4" />
                    위변조 검증하기
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
