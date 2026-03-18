# CLAUDE.md

## 프로젝트 개요

React 기반 SI/어드민 프로젝트 템플릿

## 기술 스택

- **빌드 도구:** Vite
- **프레임워크:** React
- **언어:** TypeScript
- **UI 라이브러리:** Ant Design
- **스타일링:** Tailwind CSS
- **상태 관리:** Zustand
- **라우팅:** React Router
- **API 모킹:** MSW (Mock Service Worker)

## 코딩 컨벤션

- 함수형 컴포넌트와 화살표 함수 사용
- 모든 컴포넌트와 함수에는 명확한 TypeScript 타입 정의
- UI 컴포넌트는 Ant Design을 기본으로 사용하되, 세부 레이아웃이나 간격은 Tailwind CSS 활용

## 디렉토리 구조

```
src/
├── components/   # 공통 UI 컴포넌트
├── pages/        # 화면 단위 컴포넌트
├── layouts/      # 레이아웃 (Sidebar, Header 등)
├── mocks/        # MSW 관련 모킹 데이터 및 핸들러
├── store/        # Zustand 상태 관리
└── utils/        # 공통 유틸리티 함수
```

## 언어

- 모든 응답과 설명은 반드시 한글로 작성한다.
- 코드 주석, 커밋 메시지, 사용자 응답 등 모든 텍스트 출력은 한글을 기본으로 한다.

## 행동 지침

- 사용자의 명시적인 승인 없이 한 번에 여러 개의 복잡한 기능을 구현하지 말 것.
- 명령어를 실행하기 전이나, 파일을 대규모로 수정하기 전에 항상 작업 계획을 먼저 브리핑할 것.
