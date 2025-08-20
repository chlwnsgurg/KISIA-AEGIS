"use client"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Shield } from "lucide-react"

export default function TermsPage() {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms')

  // 이용약관 내용
  const termsContent = `AEGIS 서비스 이용약관

제1조 (목적)
이 약관은 AEGIS(이하 "회사")가 제공하는 이미지 워터마킹 및 위변조 검증 서비스(이하 "서비스")의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.

제2조 (정의)
1. "서비스"란 회사가 제공하는 이미지 원본 보호(워터마킹) 및 위변조 검증 서비스를 의미합니다.
2. "회원"이란 이 약관에 따라 회사와 서비스 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 자를 의미합니다.
3. "이미지"란 회원이 서비스를 통해 업로드하는 디지털 이미지 파일을 의미합니다.

제3조 (약관의 효력 및 변경)
1. 이 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그 효력을 발생합니다.
2. 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 이 약관을 변경할 수 있습니다.

제4조 (서비스의 제공)
1. 회사는 다음과 같은 서비스를 제공합니다:
   - 이미지 워터마킹을 통한 원본 보호 서비스
   - AI 기반 이미지 위변조 검증 서비스
   - 검증 결과 분석 및 리포트 제공
2. 서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다.

제5조 (회원가입)
1. 회원가입은 이용고객이 약관의 내용에 대하여 동의를 하고 회원가입신청을 한 후 회사가 이러한 신청에 대하여 승낙함으로써 체결됩니다.
2. 회원가입시 제공하는 정보는 정확하고 진실한 정보여야 합니다.

제6조 (서비스 이용제한)
1. 회원은 다음 행위를 하여서는 안 됩니다:
   - 불법적인 목적으로 서비스를 이용하는 행위
   - 타인의 개인정보를 도용하거나 명예를 손상시키는 행위
   - 저작권 등 타인의 권리를 침해하는 이미지를 업로드하는 행위
   - 서비스의 안정적인 운영을 방해하는 행위

제7조 (개인정보보호)
회사는 개인정보보호법 등 관련 법령에 따라 회원의 개인정보를 보호합니다. 개인정보의 처리에 관한 사항은 별도의 개인정보처리방침에서 정합니다.

제8조 (책임의 제한)
1. 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
2. 회사는 AI 기반 검증 서비스의 특성상 100% 정확성을 보장하지 않습니다.

제9조 (분쟁해결)
1. 이 약관은 대한민국 법을 준거법으로 합니다.
2. 서비스 이용과 관련하여 발생한 분쟁은 민사소송법에 따른 관할법원에 소를 제기할 수 있습니다.

부칙
이 약관은 2025년 1월 1일부터 시행됩니다.`;

  // 개인정보처리방침 내용
  const privacyContent = `AEGIS 개인정보처리방침

AEGIS(이하 "회사")는 개인정보보호법 등 관련 법령에 따라 이용자의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보처리방침을 수립·공개합니다.

제1조 (개인정보의 처리목적)
회사는 다음의 목적을 위하여 개인정보를 처리합니다:
1. 회원가입 및 관리: 회원제 서비스 제공, 본인확인, 회원자격 유지·관리
2. 서비스 제공: 이미지 워터마킹 서비스, 위변조 검증 서비스 제공
3. 서비스 개선: 이용통계 분석, 서비스 품질 향상

제2조 (처리하는 개인정보의 항목)
1. 필수항목: 이메일주소, 비밀번호, 이름
2. 서비스 이용 과정에서 수집되는 정보: 접속 IP주소, 서비스 이용기록, 쿠키
3. 이미지 관련 정보: 업로드된 이미지 파일, 검증 결과 데이터

제3조 (개인정보의 처리 및 보유기간)
1. 회원정보: 회원 탈퇴시까지
2. 서비스 이용기록: 3개월
3. 업로드 이미지: 사용자 요청시 즉시 삭제 (기본 보존기간 1년)

제4조 (개인정보의 제3자 제공)
회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다:
1. 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우

제5조 (개인정보 처리의 위탁)
회사는 서비스 제공을 위해 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:
1. 클라우드 서비스: Amazon Web Services (이미지 저장 및 처리)

제6조 (정보주체의 권리·의무 및 행사방법)
이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다:
1. 개인정보 열람요구
2. 오류 등이 있을 경우 정정·삭제 요구
3. 처리정지 요구

제7조 (개인정보의 파기)
회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.

제8조 (개인정보의 안전성 확보조치)
회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:
1. 개인정보 취급 직원의 최소화 및 교육
2. 개인정보에 대한 접근 제한
3. 개인정보의 암호화
4. 접속기록의 보관 및 위변조 방지

제9조 (개인정보보호 책임자)
회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제를 위하여 아래와 같이 개인정보보호 책임자를 지정하고 있습니다.

개인정보보호 책임자
- 성명: [담당자 이름]
- 연락처: [이메일 주소]

제10조 (개인정보처리방침의 변경)
이 개인정보처리방침은 2025년 1월 1일부터 적용됩니다. 이전의 개인정보처리방침은 아래에서 확인하실 수 있습니다.`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">약관 및 정책</h1>
            <p className="text-xl text-gray-600 text-center">AEGIS 서비스 이용약관 및 개인정보처리방침</p>
          </div>

          {/* 탭 버튼 */}
          <div className="flex justify-center mb-6">
            <div className="flex rounded-lg p-1 gap-1 bg-gray-100">
              <Button
                variant={activeTab === 'terms' ? 'default' : 'ghost'}
                className={`px-6 py-2 flex items-center space-x-2 transition-colors font-medium ${
                  activeTab === 'terms' 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-gray-500 hover:text-primary'
                }`}
                onClick={() => setActiveTab('terms')}
              >
                <FileText className="h-4 w-4" />
                <span>이용약관</span>
              </Button>
              <Button
                variant={activeTab === 'privacy' ? 'default' : 'ghost'}
                className={`px-6 py-2 flex items-center space-x-2 transition-colors font-medium ${
                  activeTab === 'privacy' 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-gray-500 hover:text-primary'
                }`}
                onClick={() => setActiveTab('privacy')}
              >
                <Shield className="h-4 w-4" />
                <span>개인정보처리방침</span>
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                {activeTab === 'terms' ? '서비스 이용약관' : '개인정보처리방침'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <textarea
                  value={activeTab === 'terms' ? termsContent : privacyContent}
                  readOnly
                  className="w-full h-[600px] p-6 border border-gray-200 rounded-lg resize-none font-mono text-sm leading-relaxed bg-gray-50 focus:outline-none"
                  style={{ 
                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                    lineHeight: '1.6'
                  }}
                />
                
                {/* 편집 안내 */}
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>📝 편집 방법:</strong> 위 텍스트 영역에서 내용을 직접 수정할 수 있습니다. 
                    실제 서비스에서는 이 내용을 데이터베이스나 별도 파일에서 관리하는 것을 권장합니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 마지막 업데이트 정보 */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>마지막 업데이트: 2025년 1월 1일</p>
            <p className="mt-2">
              문의사항이 있으시면 <a href="mailto:support@aegis.com" className="text-blue-600 hover:underline">support@aegis.com</a>으로 연락주세요.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}