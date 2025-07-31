"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, Shield, Search, TrendingUp } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { apiClient } from "@/lib/api"

interface UserData {
  id: number;
  name: string;
  email: string;
  time_created: string;
}

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
      if (!apiClient.isAuthenticated()) {
        toast({
          title: "로그인 필요",
          description: "대시보드에 접근하려면 로그인이 필요합니다.",
          variant: "destructive",
        })
        router.push("/login")
        setIsCheckingAuth(false)
        return
      }
      try {
        const user = await apiClient.getMe()
        setUserData(user)
      } catch (error) {
        console.error('User data fetch error:', error)
        toast({
          title: "사용자 정보 조회 실패",
          description: "사용자 정보를 가져올 수 없습니다.",
          variant: "destructive",
        })
        apiClient.logout()
        router.push("/login")
      } finally {
        setIsCheckingAuth(false)
      }
    }
    fetchUserData()
  }, [router, toast])

  if (isCheckingAuth) return null;

  const mockStats = {
    totalAnalyses: 1247,
    protectedImages: 892,
    detectedFakes: 355,
    successRate: 94.7,
  }

  const recentAnalyses = [
    { id: "abc123", type: "검증", result: "위변조 탐지", date: "2025-01-15", tamperRate: 3.8 },
    { id: "def456", type: "보호", result: "워터마크 삽입", date: "2025-01-15" },
    { id: "ghi789", type: "검증", result: "원본 확인", date: "2024-01-14", tamperRate: 1.5 },
    { id: "jkl012", type: "검증", result: "위변조 탐지", date: "2025-01-14", tamperRate: 10.7 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">대시보드</h1>
            <p className="text-xl text-gray-600">
              {userData ? `${userData.name}님의 ` : ''}AEGIS 서비스 이용 현황을 한눈에 확인하세요
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">총 분석 횟수</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.totalAnalyses.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">보호된 이미지</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.protectedImages.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+8% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">탐지된 위변조</CardTitle>
                <Search className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.detectedFakes.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+23% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Analyses */}
          <Card>
            <CardHeader>
              <CardTitle>최근 분석 내역</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAnalyses.map((analysis) => (
                  <div key={analysis.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium">분석 ID: {analysis.id}</p>
                        <p className="text-sm text-gray-600">{analysis.date}</p>
                      </div>
                      <Badge variant={analysis.type === "보호" ? "default" : "secondary"}>{analysis.type}</Badge>
                    </div>
                    <div className="text-right">
                      <Badge variant={analysis.result.includes("위변조") ? "destructive" : "default"}>
                        {analysis.result}
                      </Badge>
                      {typeof analysis.tamperRate === "number" && (
                        <p className="text-sm text-gray-600 mt-1">변조률: {analysis.tamperRate}%</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button variant="outline">더 많은 내역 보기</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
