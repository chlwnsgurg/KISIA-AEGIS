#!/usr/bin/env python3
"""
이메일 발송 테스트 스크립트
"""

import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

# 환경 변수에서 이메일 설정 가져오기
SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = "kisiaaegis@gmail.com"
SMTP_PASSWORD = "ukgsswblwazuuqwm"
EMAIL_FROM = "kisiaaegis@gmail.com"
TEST_EMAIL_TO = "daehyuh@gmail.com"  # 테스트용 수신자

def test_email_connection():
    """SMTP 서버 연결 테스트"""
    try:
        print(f"🔗 SMTP 서버 연결 테스트: {SMTP_HOST}:{SMTP_PORT}")
        
        context = ssl.create_default_context()
        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
        server.set_debuglevel(1)  # 디버그 출력 활성화
        server.starttls(context=context)
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.quit()
        
        print("✅ SMTP 서버 연결 성공!")
        return True
        
    except Exception as e:
        print(f"❌ SMTP 서버 연결 실패: {e}")
        return False

def send_test_email():
    """테스트 이메일 발송"""
    try:
        print(f"📧 테스트 이메일 발송: {EMAIL_FROM} → {TEST_EMAIL_TO}")
        
        msg = MIMEMultipart()
        msg['From'] = f"Aegis Test <{EMAIL_FROM}>"
        msg['To'] = TEST_EMAIL_TO
        msg['Subject'] = "🧪 Aegis 이메일 테스트"
        
        body = """
        안녕하세요!
        
        이것은 Aegis 시스템의 이메일 발송 테스트입니다.
        
        이 이메일을 받으셨다면 이메일 시스템이 정상적으로 작동하고 있습니다.
        
        감사합니다.
        Aegis 팀
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        context = ssl.create_default_context()
        
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls(context=context)
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(EMAIL_FROM, TEST_EMAIL_TO, msg.as_string())
        
        print("✅ 테스트 이메일 발송 성공!")
        return True
        
    except Exception as e:
        print(f"❌ 테스트 이메일 발송 실패: {e}")
        return False

def check_network():
    """네트워크 연결 확인"""
    import socket
    try:
        print(f"🌐 네트워크 연결 확인: {SMTP_HOST}:{SMTP_PORT}")
        socket.create_connection((SMTP_HOST, SMTP_PORT), timeout=10)
        print("✅ 네트워크 연결 성공!")
        return True
    except Exception as e:
        print(f"❌ 네트워크 연결 실패: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("🧪 Aegis 이메일 시스템 테스트")
    print("=" * 50)
    
    # 1. 네트워크 연결 확인
    network_ok = check_network()
    
    # 2. SMTP 연결 확인
    if network_ok:
        smtp_ok = test_email_connection()
    else:
        smtp_ok = False
    
    # 3. 이메일 발송 테스트
    if smtp_ok:
        email_ok = send_test_email()
    else:
        email_ok = False
    
    print("\n" + "=" * 50)
    print("📊 테스트 결과")
    print("=" * 50)
    print(f"네트워크 연결: {'✅ 성공' if network_ok else '❌ 실패'}")
    print(f"SMTP 연결: {'✅ 성공' if smtp_ok else '❌ 실패'}")
    print(f"이메일 발송: {'✅ 성공' if email_ok else '❌ 실패'}")
    
    if not network_ok:
        print("\n🔧 해결 방법:")
        print("1. 방화벽에서 포트 587 허용: sudo ufw allow out 587")
        print("2. AWS Security Group에서 아웃바운드 포트 587 허용")
        print("3. 네트워크 설정 확인")