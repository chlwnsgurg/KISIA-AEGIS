'use client';

import { apiClient } from './api';
import type { LoginResponse, UserResponse, ImageUploadResponse, ValidateResponse } from './api';

interface LoadingContextType {
  showLoading: (message: string, progress?: number) => void;
  hideLoading: () => void;
  updateProgress: (progress: number) => void;
  updateMessage: (message: string) => void;
}

class ApiWithLoading {
  private loadingContext: LoadingContextType | null = null;

  setLoadingContext(context: LoadingContextType) {
    this.loadingContext = context;
  }

  private async withLoading<T>(
    operation: () => Promise<T>,
    message: string,
    progressSteps?: { progress: number; message: string }[]
  ): Promise<T> {
    if (!this.loadingContext) {
      return operation();
    }

    try {
      this.loadingContext.showLoading(message);

      if (progressSteps) {
        for (const step of progressSteps) {
          this.loadingContext.updateProgress(step.progress);
          this.loadingContext.updateMessage(step.message);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      const result = await operation();
      
      if (progressSteps) {
        this.loadingContext.updateProgress(100);
        this.loadingContext.updateMessage('완료되었습니다!');
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      return result;
    } finally {
      this.loadingContext.hideLoading();
    }
  }

  async signup(name: string, email: string, password: string) {
    return this.withLoading(
      () => apiClient.signup(name, email, password),
      '회원가입 처리 중입니다...',
      [
        { progress: 30, message: '입력 정보를 확인하고 있습니다...' },
        { progress: 70, message: '계정을 생성하고 있습니다...' }
      ]
    );
  }

  async login(email: string, password: string, rememberMe = false) {
    return this.withLoading(
      () => apiClient.login(email, password, rememberMe),
      '로그인 처리 중입니다...',
      [
        { progress: 40, message: '인증 정보를 확인하고 있습니다...' },
        { progress: 80, message: '세션을 설정하고 있습니다...' }
      ]
    );
  }

  async uploadImage(copyright: string, file: File, protectionAlgorithm: string = 'EditGuard') {
    return this.withLoading(
      () => apiClient.uploadImage(copyright, file, protectionAlgorithm),
      '이미지에 워터마크를 생성하고 있습니다...',
      [
        { progress: 20, message: '이미지를 업로드하고 있습니다...' },
        { progress: 40, message: '이미지 분석을 진행하고 있습니다...' },
        { progress: 60, message: '워터마크를 생성하고 있습니다...' },
        { progress: 80, message: '보호된 이미지를 저장하고 있습니다...' }
      ]
    );
  }

  async validateImage(file: File, model: string = 'EditGuard') {
    return this.withLoading(
      () => apiClient.validateImage(file, model),
      '이미지 위변조를 검증하고 있습니다...',
      [
        { progress: 20, message: '이미지를 업로드하고 있습니다...' },
        { progress: 40, message: 'AI 모델을 로딩하고 있습니다...' },
        { progress: 60, message: '워터마크를 분석하고 있습니다...' },
        { progress: 80, message: '위변조 영역을 탐지하고 있습니다...' }
      ]
    );
  }

  async getMe() {
    return this.withLoading(
      () => apiClient.getMe(),
      '사용자 정보를 불러오고 있습니다...'
    );
  }

  async getUserImages(limit: number = 20, offset: number = 0) {
    return this.withLoading(
      () => apiClient.getUserImages(limit, offset),
      '이미지 목록을 불러오고 있습니다...'
    );
  }

  async getValidationHistory(limit: number = 10, offset: number = 0) {
    return this.withLoading(
      () => apiClient.getValidationHistory(limit, offset),
      '검증 이력을 불러오고 있습니다...'
    );
  }

  async getMyValidationSummary(limit: number = 10, offset: number = 0) {
    return this.withLoading(
      () => apiClient.getMyValidationSummary(limit, offset),
      '검증 요약 정보를 불러오고 있습니다...'
    );
  }

  async getValidationRecordByUuid(validationUuid: string) {
    return this.withLoading(
      () => apiClient.getValidationRecordByUuid(validationUuid),
      '검증 결과를 불러오고 있습니다...',
      [
        { progress: 50, message: '검증 데이터를 분석하고 있습니다...' }
      ]
    );
  }

  async getAlgorithms() {
    return this.withLoading(
      () => apiClient.getAlgorithms(),
      '알고리즘 목록을 불러오고 있습니다...'
    );
  }

  async getProtectionAlgorithms() {
    return this.withLoading(
      () => apiClient.getProtectionAlgorithms(),
      '보호 알고리즘 목록을 불러오고 있습니다...'
    );
  }

  async getImageDetail(imageId: number) {
    return this.withLoading(
      () => apiClient.getImageDetail(imageId),
      '이미지 상세 정보를 불러오고 있습니다...'
    );
  }

  logout() {
    apiClient.logout();
  }

  isAuthenticated() {
    return apiClient.isAuthenticated();
  }

  async verifyToken() {
    return this.withLoading(
      () => apiClient.verifyToken(),
      '토큰을 검증하고 있습니다...'
    );
  }
}

export const apiWithLoading = new ApiWithLoading();

export type { LoginResponse, UserResponse, ImageUploadResponse, ValidateResponse };