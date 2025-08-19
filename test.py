#!/usr/bin/env python3
"""
Aegis 회원가입 완료 이메일 테스트
"""

import asyncio
import sys
import os

# 프로젝트 루트 디렉토리를 Python 경로에 추가
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.email_service import email_service


async def test_welcome_email():
    """회원가입 완료 이메일 테스트"""
    print("🧪 Aegis 회원가입 완료 이메일 테스트 시작...")
    
    try:
        # 이메일 서비스 상태 확인
        print("📧 이메일 서비스 상태 확인 중...")
        status = await email_service.check_email_service_status()
        
        if not status["smtp_connection"]:
            print(f"❌ SMTP 연결 실패: {status.get('error', '알 수 없는 오류')}")
            return False
            
        print("✅ SMTP 연결 성공")
        
        # 회원가입 완료 이메일 발송
        print("📨 회원가입 완료 이메일 발송 중...")
        
        success = await email_service.send_welcome_email(
            user_email="daehyuh@gmail.com",
            username="김대현"
        )
        
        if success:
            print("🎉 회원가입 완료 이메일 발송 성공!")
            print("📬 daehyuh@gmail.com으로 이메일이 발송되었습니다.")
            return True
        else:
            print("❌ 이메일 발송 실패")
            return False
            
    except Exception as e:
        print(f"💥 테스트 중 오류 발생: {str(e)}")
        return False


async def main():
    """메인 테스트 함수"""
    print("=" * 50)
    print("🛡️  AEGIS EMAIL TEST")
    print("=" * 50)
    
    result = await test_welcome_email()
    
    print("\n" + "=" * 50)
    if result:
        print("✅ 테스트 성공: 이메일이 정상적으로 발송되었습니다!")
    else:
        print("❌ 테스트 실패: 이메일 발송에 문제가 있습니다.")
    print("=" * 50)


if __name__ == "__main__":
    asyncio.run(main())