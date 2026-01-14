<img width="94" height="39" alt="image" src="https://github.com/user-attachments/assets/3c124631-c06a-492d-a782-895453b46901" /><img width="534" height="60" alt="image" src="https://github.com/user-attachments/assets/c3b023ca-995f-471b-a9c2-d55aa1bf4846" /><p align="center">
<img width="356" height="95" alt="image" src="https://github.com/user-attachments/assets/df015068-1eed-48ab-9c05-390fe4cc5712" />
<p>

AEGIS는 생성형 AI 시대에 급증하는 디지털 콘텐츠 위·변조 및 저작권 침해 문제를 해결하기 위해 설계된 딥러닝 기반 워터마킹 및 위변조 탐지 SaaS입니다.

---
## Background & Motivation

생성형 AI의 확산으로 딥페이크, 무단 편집, 출처 위조 등 디지털 신뢰 위협이 급격히 증가하고 있습니다.  
이에 따라 각국 정부와 글로벌 규제 기관은 AI 생성 콘텐츠 식별 및 워터마킹 제도화를 적극 추진하고 있습니다.

그러나 기존 워터마킹 솔루션은 다음과 같은 한계를 가집니다.

- **편집 취약성**: AI 편집 및 각종 공격(압축/노이즈/변형)에 취약
- **상용화 장벽**: 고비용 온프레미스 중심 구조, 느린 업데이트 주기

AEGIS는 이러한 문제를 해결하기 위해 설계되었습니다.

---
## Key Features
AEGIS는 딥러닝 기반 워터마킹 및 위변조 탐지 SaaS로, 주요 기능은 다음과 같습니다.

### 1. 원본 보호 (Watermark Embedding)
- 사용자가 업로드한 이미지에 비가시성 워터마크 삽입
<img width="318" height="399" alt="image" src="https://github.com/user-attachments/assets/a2e30d2f-6a84-4912-8517-9c82d4613b5c" />


### 2. 위변조 검증 (Tamper Detection & Localization)
- 의심되는 이미지를 분석하여 위변조 여부 판정
  - 추출된 저작권 정보 제공
  - 조작된 영역 시각화
<img width="223" height="385" alt="image" src="https://github.com/user-attachments/assets/b148dc6c-0b7f-489b-8e8c-0e49e6926a64" />


### 3. 실시간 유출 및 위변조 모니터링
- 위변조된 이미지 참지시 원본 소유자에게 알림
<img width="285" height="402" alt="image" src="https://github.com/user-attachments/assets/b5d35bc3-f168-41b6-848f-176949f94af6" />


### + 타 서비스와 핵심 기능을 손쉽게 연결하는 API 지원
<img width="536" height="265" alt="image" src="https://github.com/user-attachments/assets/147cc17a-83d1-4d05-80ad-545bf7dad005" />

---
## System Architecture
<img width="1280" height="835" alt="Screenshot 2026-01-14 at 6 06 22 PM-Photoroom" src="https://github.com/user-attachments/assets/11915ef8-5429-4a9d-9b97-c53f636bd238" />


---
## Core Idea
<img width="1280" height="595" alt="Screenshot 2026-01-14 at 5 45 31 PM-Photoroom" src="https://github.com/user-attachments/assets/43b82e15-4b3e-4fdc-89ed-ceec60ba5256" />

AEGIS의 핵심 아이디어는 Deep Learning과 Error Correction Code(ECC)를 결합하여 강인성(Robustness)과  
신뢰성(Reliability)을 동시에 만족하는 새로운 워터마킹 프레임워크입니다.

- **Deep Learning**  
  - 다양한 공격(편집, 변형, 노이즈)에 대한 강인성 확보
- **Error Correction Code (ECC)**  
  - 딥러닝 모델의 uncerntainty 특성을 보완하여 신뢰성 확보

---

## Experimental Results

### 조작된 영역 시각화 성능 평가
EditGuard 모델을 기반으로 서비스를 구동하였다.
<img width="599" height="326" alt="Screenshot 2026-01-14 at 6 29 42 PM" src="https://github.com/user-attachments/assets/36efb2ac-3825-4f87-9c36-c057684c6131" />


### 공격 시나리오에서의 강건성 평가
- RobustWide 모델을 기반으로 서비스를 구동하였다.
<img width="643" height="308" alt="Screenshot 2026-01-14 at 6 30 30 PM" src="https://github.com/user-attachments/assets/7698d190-e905-411d-8796-a9f19f0fbcac" />

---


## Future Work

- 워터마킹 모델에 대한 지속적 업데이트
- 웹 크롤링 기술을 통한 콘텐츠 유출 모니터링 자동화

