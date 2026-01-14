<p align="center">
<img width="356" height="95" alt="image" src="https://github.com/user-attachments/assets/df015068-1eed-48ab-9c05-390fe4cc5712" />
<p>

# AEGIS  
**Robust & Reliable Image Watermarking Framework for the Generative AI Era**

AEGIS는 생성형 AI 시대에 급증하는 **디지털 콘텐츠 위·변조 및 저작권 침해 문제**를 해결하기 위해 설계된  
**딥러닝 기반 이미지 워터마킹 및 위변조 검증 시스템**입니다.  
Deep Learning과 Error Correction Code(ECC)를 결합하여 **강인성(Robustness)**과  
**신뢰성(Reliability)**을 동시에 만족하는 새로운 워터마킹 프레임워크를 제안합니다.

---

## Background & Motivation

생성형 AI의 확산으로 딥페이크, 무단 편집, 출처 위조 등 **디지털 신뢰 위협**이 급격히 증가하고 있습니다.  
이에 따라 각국 정부와 글로벌 규제 기관은 **AI 생성 콘텐츠 식별 및 워터마킹 제도화**를 적극 추진하고 있습니다.

그러나 기존 워터마킹 솔루션은 다음과 같은 한계를 가집니다.

- **손쉬운 무력화**: 단순 로고/가시성 워터마크는 AI 편집 및 후처리를 통해 쉽게 제거
- **편집 취약성**: 비가시성 워터마크 또한 AI 기반 편집, 압축, 변형에 취약
- **상용화 장벽**: 고비용 온프레미스 중심 구조, 느린 업데이트 주기

AEGIS는 이러한 문제를 해결하기 위해 설계되었습니다.

---

## Core Idea

### Deep Learning + ECC

AEGIS의 핵심 아이디어는 다음과 같습니다.

- **Deep Learning**  
  - 이미지 특성에 적응적인 워터마크 삽입
  - 다양한 공격(편집, 변형, 노이즈)에 대한 강인성 확보
- **Error Correction Code (ECC)**  
  - 워터마크 손상 상황에서도 정보 복원 가능
  - 높은 신뢰도의 워터마크 추출 보장

> **Result:**  
> 다양한 공격 환경에서도 유지되는  
> **Robust & Reliable Watermark**

---

## Key Features

### 1. 원본 보호 (Watermark Embedding)
- 사용자가 업로드한 이미지에 **비가시성 워터마크 삽입**
- 원본 이미지 품질을 최대한 유지하면서 저작권 정보 보호

### 2. 위변조 검증 (Tamper Detection & Localization)
- 이미지 내 워터마크 존재 여부 자동 분석
- 위변조 발생 시:
  - 위변조 여부 판단
  - **위변조 영역 시각화(EditGuard 기반)**
  - 신뢰 가능한 검증 리포트 제공

### 3. 실시간 유출 및 위변조 모니터링
- 외부 유출 이미지에 대한 지속적 추적
- 사용자가 인지하지 못한 위변조·유출 상황 알림

---

## System Architecture

AEGIS는 **API 중심의 클라우드 네이티브 구조**로 설계되었습니다.

- **Frontend**: React / Next.js (Vercel)
- **Backend API**: FastAPI / Flask
- **AI Model Server**: PyTorch (GPU Server)
- **Infrastructure**:
  - AWS (ECR, ECS, S3 등)
  - 컨테이너 기반 배포
- **External Integration**:
  - GitHub
  - Open API 제공

> 간단한 API 호출만으로  
> 워터마킹 삽입, 검증, 추적 기능을 손쉽게 연동할 수 있습니다.

---

## Experimental Results

### EditGuard 기반 위변조 검증
- 원본 / 워터마킹 이미지 / 위변조 이미지 비교
- 위변조 영역 정확한 마스킹 및 시각화 확인

### RobustWide 실험
- 다양한 이미지 및 공격 시나리오에서 평가
- 편집 및 변형 이후에도 **낮은 Bit Error Rate(BER)** 유지
- ECC 적용을 통해 복원 성능 안정적 확보

---

## Business Strategy

AEGIS는 다음과 같은 시장을 대상으로 합니다.

### B2C
- 개인 창작자, 인플루언서, SNS 사용자
- 개인 이미지·영상 저작권 보호 및 무단 도용 방지

### B2B
- 쇼핑몰, 콘텐츠 플랫폼, 미디어 기업
- 생성형 AI 콘텐츠 유통 환경에서의 신뢰성 확보
- 브랜드·마케팅 자산 보호

### B2G
- 정부 및 공공기관
- 공공 이미지·문서 위변조 방지
- 대국민 신뢰도 제고

### Revenue Model
- Freemium 기반 SaaS 구독 모델
- API 형태로 핵심 기능 제공 (B2B/B2G)

---

## Future Work

- 워터마킹 모델의 **지속적 업데이트**
- 모듈화된 아키텍처를 통한:
  - 더 강력한 AI 모델 교체
  - 다양한 공격 시나리오 대응
- 이미지 → **비디오·멀티모달 워터마킹 확장**

---

## Keywords
`Digital Watermarking` · `Generative AI` · `Content Authenticity` ·  
`Deep Learning` · `ECC` · `Tamper Detection` · `Copyright Protection`

---

## Disclaimer
본 프로젝트는 연구 및 프로토타입 목적을 포함하며,  
실제 상용 환경에서는 추가적인 보안·법적 검토가 필요합니다.
