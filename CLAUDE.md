# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

- `pnpm dev` - Start development server with Vite
- `pnpm build` - Type check with TypeScript and build for production
- `pnpm preview` - Preview production build locally

### Code Quality

- `pnpm lint` - Run ESLint on all files
- `pnpm lint:fix` - Run ESLint with auto-fix
- Pre-commit hooks automatically run ESLint and Prettier on staged files via lint-staged

### Icon Generation

- `pnpm icons:gen` - Generate icon list from SVG files in `src/shared/assets/icons`

## Architecture

### Project Structure

The codebase follows a **feature-based + shared architecture**:

```
src/
├── App.tsx                    # Root app component
├── main.tsx                   # Application entry point
├── pages/                     # Feature pages
│   ├── home/                  # 홈 페이지
│   │   ├── components/        # 홈 페이지 전용 컴포넌트
│   │   ├── constants/         # 홈 페이지 상수
│   │   ├── hooks/             # 홈 페이지 전용 훅
│   │   ├── types/             # 홈 페이지 타입 정의
│   │   ├── home-page.tsx      # 메인 페이지 컴포넌트
│   │   ├── group-page.tsx
│   │   ├── rental-page.tsx
│   │   └── reservation-page.tsx
│   ├── library/               # 도서관 기능
│   │   ├── components/
│   │   │   ├── card/          # 카드 컴포넌트 모음
│   │   │   ├── section/       # 섹션 컴포넌트 모음
│   │   │   └── library-tab.tsx
│   │   ├── constants/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── library-page.tsx
│   │   ├── library-create-page.tsx
│   │   ├── library-detail-page.tsx
│   │   ├── library-book-page.tsx
│   │   ├── library-review-page.tsx
│   │   ├── book-create-page.tsx
│   │   ├── book-detail-page.tsx
│   │   └── cart-page.tsx
│   ├── board/                 # 게시판
│   │   └── components/
│   ├── chat/                  # 채팅
│   │   └── components/
│   ├── login/                 # 로그인
│   │   └── components/
│   ├── signup/                # 회원가입
│   │   └── components/
│   ├── setting/               # 설정
│   ├── onboarding/            # 온보딩
│   │   └── constants/
│   ├── notification/          # 알림
│   └── error/                 # 에러 페이지
│
└── shared/                    # 전역 공유 리소스
    ├── apis/                  # 도메인별 API 클라이언트
    │   ├── base/
    │   │   └── client.ts      # HTTP 클라이언트 (axios 래퍼)
    │   ├── auth/              # 인증 API
    │   ├── library/           # 도서관 API
    │   │   ├── library-queries.ts
    │   │   ├── library-mutations.ts
    │   │   └── library-book-queries.ts
    │   ├── member/            # 회원 API
    │   └── s3/                # S3 업로드 API
    │
    ├── components/            # 재사용 가능한 UI 컴포넌트
    │   ├── bottom-sheet/
    │   ├── button/
    │   ├── calendar/
    │   ├── dropdown/
    │   ├── empty/
    │   ├── input/
    │   ├── tab/
    │   ├── time-picker/
    │   ├── spash/             # 스플래시 스크린
    │   ├── icon.tsx           # SVG 아이콘 컴포넌트
    │   ├── loading-spinner.tsx
    │   ├── search-bar.tsx
    │   ├── section-layout.tsx
    │   └── divider.tsx
    │
    ├── hooks/                 # 전역 커스텀 훅
    │   ├── use-daum-postcode.ts
    │   ├── use-kakao-map.ts
    │   ├── use-local-storage.ts
    │   ├── use-query-tab.ts
    │   └── use-floating-button.ts
    │
    ├── routes/                # 라우팅 설정
    │   ├── router.tsx         # React Router 설정
    │   └── routes-config.ts   # 라우트 경로 상수
    │
    ├── layouts/               # 레이아웃 컴포넌트
    │   └── layout.tsx
    │
    ├── constants/             # 전역 상수
    │   ├── end-point.ts       # API 엔드포인트 정의
    │   ├── query-keys.ts      # React Query 키 정의
    │   ├── http.ts            # HTTP 상태 코드, 에러 메시지
    │   ├── icons.ts           # 아이콘 상수
    │   ├── bottom-nav.ts      # 하단 네비게이션 설정
    │   ├── modal-presets.ts
    │   └── toast-messages.ts
    │
    ├── libs/                  # 서드파티 라이브러리 설정
    │   ├── query-client.ts    # TanStack Query 클라이언트 설정
    │   └── gen-icons-list.js  # 아이콘 생성 스크립트
    │
    ├── utils/                 # 유틸리티 함수
    │   └── auth.ts            # 인증 관련 유틸
    │
    ├── types/                 # 전역 타입 정의
    │
    ├── assets/                # 정적 파일
    │   ├── icons/             # SVG 아이콘 파일
    │   └── images/            # 이미지 파일
    │
    └── styles/                # 전역 스타일
```

### Directory Organization Principles

#### Feature Pages (`src/pages/`)

각 feature는 독립적인 디렉토리를 가지며, 다음과 같은 구조를 따릅니다:

```
src/pages/[feature-name]/
├── components/            # 해당 feature에서만 사용되는 컴포넌트
├── hooks/                # 해당 feature 전용 커스텀 훅
├── constants/            # 해당 feature의 상수
├── types/                # 해당 feature의 타입 정의
└── [feature-name]-page.tsx  # 페이지 컴포넌트 (파일명에 -page 접미사)
```

**파일 네이밍 규칙:**

- 페이지 컴포넌트: `[page-name]-page.tsx`
- 일반 컴포넌트: `[component-name].tsx` (kebab-case)
- 타입 파일: `[name].types.ts`

#### Shared Resources (`src/shared/`)

**APIs (`src/shared/apis/`)**

- 도메인별로 폴더 구성 (library, auth, member, s3 등)
- 각 도메인 폴더에는:
  - `[domain]-queries.ts` - React Query의 useQuery 관련
  - `[domain]-mutations.ts` - React Query의 useMutation 관련
- 모든 API는 `base/client.ts`의 HTTP 클라이언트를 사용

**Components (`src/shared/components/`)**

- 2개 이상의 페이지에서 사용되는 재사용 가능한 컴포넌트
- 복잡한 컴포넌트는 별도 폴더로 구성 (bottom-sheet, button 등)
- 단순한 컴포넌트는 단일 파일로 관리 (icon.tsx, divider.tsx 등)

**Constants (`src/shared/constants/`)**

- `end-point.ts` - 모든 API 엔드포인트 중앙 관리
- `query-keys.ts` - React Query 키 중앙 관리 (계층적 구조)
- `http.ts` - HTTP 관련 상수 (상태 코드, 에러 메시지)

**Hooks (`src/shared/hooks/`)**

- 여러 feature에서 재사용되는 커스텀 훅
- 파일명: `use-[hook-name].ts` (kebab-case)

### State Management & Data Fetching

- **TanStack Query (React Query)** for server state management
- Query client configured in `src/shared/libs/query-client.ts` with:
  - No automatic retries
  - No refetch on window focus
  - 5-minute stale time
  - 10-minute garbage collection time
  - Errors thrown to React error boundaries

### API Layer Architecture

- **Axios-based HTTP client** in `src/shared/apis/base/client.ts`
- All API responses follow this format:
  ```typescript
  {
    success: boolean;
    data: T | null;
    error: ApiError | null;
  }
  ```
- Response interceptor unwraps `data` field automatically
- Request interceptor adds `Authorization: Bearer {token}` from localStorage
- API endpoints organized by domain (e.g., `apis/library/`, `apis/auth/`, `apis/member/`)
- API queries use **queryOptions pattern** from TanStack Query for type safety
- Endpoints centralized in `src/shared/constants/end-point.ts`
- Query keys centralized in `src/shared/constants/query-keys.ts` using hierarchical structure

### Routing

- **React Router v7** with lazy-loaded pages
- All routes configured in `src/shared/routes/router.tsx`
- Route paths defined in `src/shared/routes/routes-config.ts`
- Layout wrapper with error boundary applied to all routes

### Path Aliases

Critical aliases used throughout the codebase:

- `@pages/*` → `src/pages/*`
- `@apis/*` → `src/shared/apis/*`
- `@components/*` → `src/shared/components/*`
- `@hooks/*` → `src/shared/hooks/*`
- `@constants/*` → `src/shared/constants/*`
- `@libs/*` → `src/shared/libs/*`
- `@layouts/*` → `src/shared/layouts/*`
- `@routes/*` → `src/shared/routes/*`
- `@types/*` → `src/shared/types/*`
- `@icons/*` → `src/shared/assets/icons/*`
- `@images/*` → `src/shared/assets/images/*`

### Styling

- **Tailwind CSS v4** with Vite plugin
- Tailwind utility functions: `clsx`, `cn`, `cva`, `tw`
- Prettier with `prettier-plugin-tailwindcss` for automatic class sorting

### Icons

- SVG sprite system using `vite-plugin-svg-icons`
- Icons stored in `src/shared/assets/icons/`
- Icon component wrapper at `src/shared/components/icon.tsx`
- Sprite ID format: `icon-[name]`

### Environment & Proxy

- Development: API requests to `/api` proxied to `VITE_API_TARGET_URL`
- Production: API requests go to `VITE_API_BASE_URL`

### Form Handling

- **React Hook Form** with **Zod** validation via `@hookform/resolvers`

### Git Commit Convention

Commits must follow this format (enforced by commitlint):

- Types: `Feat`, `Fix`, `Chore`, `Style`, `Docs`, `Refactor`, `Init`, `Build` (PascalCase)
- No period at end of subject
- Max header length: 100 characters
- Example: `Feat: 유저 인증 정보 관리 유틸함수 구현`

### Key Custom Hooks

- `use-daum-postcode` - Daum Postcode integration
- `use-kakao-map` - Kakao Map integration
- `use-local-storage` - LocalStorage state management
- `use-query-tab` - Tab state synchronized with URL query params
- `use-floating-button` - Floating button behavior

## Important Notes

### When Adding New API Endpoints

1. Add endpoint to `src/shared/constants/end-point.ts`
2. Add query/mutation keys to `src/shared/constants/query-keys.ts`
3. Create query/mutation in appropriate domain folder under `src/shared/apis/`
4. Use `queryOptions` pattern for type-safe queries
5. API functions should use the wrapper functions (`get`, `post`, `patch`, `put`, `del`) from `@apis/base/client`

### When Creating New Pages

1. Add page component to `src/pages/[feature-name]/`
2. Lazy import in `src/shared/routes/router.tsx`
3. Add route constant to `src/shared/routes/routes-config.ts`
4. Add route configuration to router

### TypeScript Configuration

- Strict mode enabled
- Target: ES2020
- Module: ESNext with bundler resolution
- React JSX transform (no React import needed)
- Unused locals and parameters checked
