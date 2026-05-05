# workflowapp-frontend

業務ワークフロー（申請・承認）を想定したフロントエンドアプリケーションです。  
React + TypeScript + Vite で構築しており、ASP.NET Core Web API と連携して動作します。

現在は、認証機能、申請一覧、申請詳細、申請作成、申請編集、申請削除の基本的な CRUD 操作を実装しています。

---

## 作成背景

これまでデスクトップアプリケーション中心の開発経験が多かったため、Web アプリケーション開発、特にフロントエンド実装の習得を目的として作成しています。

本プロジェクトでは、以下の習得を意識しています。

- React + TypeScript による画面実装
- React Router を用いた画面遷移とアクセス制御
- Axios を用いた Web API 連携
- JWT を使った認証状態管理
- MUI を用いた UI 構築
- Vitest / Testing Library を用いたフロントエンドテスト
- API 通信を含む画面単位の状態管理
- バリデーション、エラー表示、ローディング表示の実装

---

## 使用技術

- React 19
- TypeScript
- Vite
- React Router DOM
- Axios
- MUI
- Vitest
- Testing Library
- ESLint

---

## 現在の実装機能

### 認証

- ログイン画面
- ユーザー登録画面
- JWT の localStorage 保存 / 削除
- Axios インターセプターによる JWT 自動付与
- 認証済み・未認証でのルート制御
  - `ProtectedRoute` により未認証時は `/login` へリダイレクト
  - `PublicRoute` により認証済み時は `/applications` へリダイレクト
- ヘッダーからのログアウト

### 申請一覧

- API から申請一覧を取得
- 読み込み中表示
- エラー表示
- データ 0 件時のメッセージ表示
- 申請作成画面への遷移リンク
- 申請一覧テーブルの表示
  - ID
  - タイトル
  - ステータス
  - 作成日時
  - 操作ボタン

### 申請詳細

- URL パラメータから申請 ID を取得
- API から申請詳細を取得
- 申請内容の表示
  - ID
  - タイトル
  - 内容
  - ステータス
  - 作成日時
- 不正な ID のエラー表示
- API 取得失敗時のエラー表示
- 一覧画面への戻るボタン
- 編集画面への遷移ボタン

### 申請作成

- 申請作成画面
- タイトル / 内容の入力
- 入力値のトリム処理
- タイトル未入力時のバリデーション
- 内容未入力時のバリデーション
- 入力項目ごとのエラーメッセージ表示
- `aria-invalid` / `aria-describedby` によるアクセシビリティ対応
- 申請作成 API の呼び出し
- 作成成功後、申請一覧画面へ遷移
- 作成失敗時のエラーメッセージ表示
- 送信中のボタン無効化
  - 申請ボタン
  - 一覧へ戻るボタン

### 申請編集

- URL パラメータから申請 ID を取得
- API から既存の申請内容を取得
- タイトル / 内容をフォームに表示
- タイトル未入力時のバリデーション
- 内容未入力時のバリデーション
- 申請更新 API の呼び出し
- 更新成功後、申請詳細画面へ遷移
- 更新失敗時のエラーメッセージ表示
- 不正な ID のエラー表示
- API 取得失敗時のエラー表示
- 一覧画面 / 詳細画面への戻るボタン

### 申請削除

- 申請一覧画面から削除操作を実行
- 削除前の確認ダイアログ表示
- 削除 API の呼び出し
- 削除成功後、一覧から対象データを除外
- 削除キャンセル時は API を呼び出さない
- 削除失敗時のエラーメッセージ表示
- 不正な申請 ID のチェック

### ユーザー情報表示

- ダッシュボード画面
- 認証済みユーザー情報の取得
- トークン未保持 / 401 / その他失敗のメッセージ切り分け

---

## ルーティング

現在の主なルート構成は以下の通りです。

| パス                     | 画面                                                     |
| ------------------------ | -------------------------------------------------------- |
| `/login`                 | ログイン画面                                             |
| `/register`              | ユーザー登録画面                                         |
| `/applications`          | 申請一覧画面                                             |
| `/applications/new`      | 申請作成画面                                             |
| `/applications/:id`      | 申請詳細画面                                             |
| `/applications/:id/edit` | 申請編集画面                                             |
| `/dashboard`             | ダッシュボード画面                                       |
| `/`                      | 認証済みなら `/applications`、未認証なら `/login` へ遷移 |

---

## API 連携

本アプリケーションは、以下のバックエンド API と連携する想定です。

### 認証 API

| メソッド | エンドポイント       | 内容                       |
| -------- | -------------------- | -------------------------- |
| `POST`   | `/api/auth/register` | ユーザー登録               |
| `POST`   | `/api/auth/login`    | ログイン                   |
| `GET`    | `/api/auth/me`       | ログイン中ユーザー情報取得 |

### 申請 API

| メソッド | エンドポイント          | 内容         |
| -------- | ----------------------- | ------------ |
| `GET`    | `/api/applications`     | 申請一覧取得 |
| `GET`    | `/api/applications/:id` | 申請詳細取得 |
| `POST`   | `/api/applications`     | 申請作成     |
| `PUT`    | `/api/applications/:id` | 申請更新     |
| `DELETE` | `/api/applications/:id` | 申請削除     |

フロントエンドでは Axios インターセプターを利用して、必要なリクエストに JWT を自動付与する実装を入れています。

環境変数 `VITE_API_BASE_URL` を指定しない場合、API のベース URL は以下を使用します。

```txt
http://localhost:5071/api
```

---

## 主なディレクトリ構成

```txt
src/
  api/
    apiClient.ts
    applicationsApi.ts
    authApi.ts
  components/
    applications/
      ApplicationListTable.tsx
    auth/
      ProtectedRoute.tsx
      PublicRoute.tsx
    layout/
      Header.tsx
  pages/
    ApplicationCreatePage.tsx
    ApplicationDetailPage.tsx
    ApplicationEditPage.tsx
    ApplicationListPage.tsx
    DashboardPage.tsx
    HomePage.tsx
    LoginPage.tsx
    RegisterPage.tsx
  services/
    authService.ts
  types/
    application.ts
    auth.ts
  utils/
    auth.ts
    logout.ts
    tokenStorage.ts
  test/
    setupTests.ts
```

---

## テスト

Vitest と Testing Library を使用して、画面表示、ユーザー操作、API 呼び出し、画面遷移、エラー表示をテストしています。

### 主なテスト対象

- `ApplicationListPage`
  - 初期表示
  - 一覧表示
  - 0 件表示
  - API エラー表示
  - 申請削除
  - 削除キャンセル
  - 削除失敗時のエラー表示
  - 申請作成画面へのリンク表示

- `ApplicationListTable`
  - 詳細 / 編集 / 削除ボタンの表示
  - 詳細リンクの遷移先確認
  - 編集リンクの遷移先確認
  - 削除ボタンクリック時のコールバック確認

- `ApplicationDetailPage`
  - 初期表示
  - 申請詳細表示
  - API エラー表示
  - 不正 ID のエラー表示
  - 一覧画面への遷移
  - 編集画面への遷移

- `ApplicationCreatePage`
  - 入力欄の表示
  - タイトル未入力時のバリデーション
  - 内容未入力時のバリデーション
  - 申請作成成功
  - 申請作成失敗
  - 一覧画面への遷移
  - 申請中のボタン無効化

- `ApplicationEditPage`
  - 取得した申請内容の表示
  - タイトル未入力時のバリデーション
  - 内容未入力時のバリデーション
  - 申請更新成功
  - 申請更新失敗
  - 詳細取得失敗時のエラー表示
  - 不正 ID のエラー表示

- `ApplicationApi`
  - 申請作成 API 呼び出し
  - 申請更新 API 呼び出し
  - 申請削除 API 呼び出し

### テスト実行

```bash
npm run test
```

一括実行:

```bash
npm run test:run
```

---

## セットアップ手順

### 1. リポジトリをクローン

```bash
git clone https://github.com/ssakaguchi/workflowapp-frontend.git
cd workflowapp-frontend
```

### 2. パッケージをインストール

```bash
npm install
```

### 3. 開発サーバーを起動

```bash
npm run dev
```

### 4. ビルド

```bash
npm run build
```

---

## 今後の実装候補

- 申請種別の追加
  - 汎用申請
  - 出張旅費申請
- 申請種別ごとの入力フォーム切り替え
- 申請ステータス変更機能
  - 申請中
  - 承認
  - 却下
- 申請一覧の検索 / 絞り込み
- 申請一覧のソート
- 作成日時の表示形式改善
- UI デザインの改善

---

## 補足

本リポジトリは、学習およびポートフォリオ用途で作成しています。  
ASP.NET Core Web API 側の実装とあわせて、段階的に機能を拡張していく予定です。
