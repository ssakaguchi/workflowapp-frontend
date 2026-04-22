# workflowapp-frontend

業務ワークフロー（申請・承認）を想定したフロントエンドアプリケーションです。  
React + TypeScript + Vite で構築しており、ASP.NET Core Web API と連携して動作します。

現在は、認証機能に加えて、申請一覧画面・申請詳細画面・ルーティング制御の基本実装まで進んでいます。

---

## 作成背景

これまでデスクトップアプリケーション中心の開発経験が多かったため、
Webアプリケーション開発、特にフロントエンド実装の習得を目的として作成しています。

本プロジェクトでは、以下の習得を意識しています。

- React + TypeScript による画面実装
- React Router を用いた画面遷移とアクセス制御
- Axios を用いた Web API 連携
- JWT を使った認証状態管理
- MUI を用いた UI 構築
- Vitest / Testing Library を用いたフロントエンドテスト

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
- 認証済み・未認証でのルート制御
  - `ProtectedRoute` により未認証時は `/login` へリダイレクト
  - `PublicRoute` により認証済み時は `/applications` へリダイレクト
- ヘッダーからのログアウト

### 申請機能

- 申請一覧画面
  - API から申請一覧を取得
  - 読み込み中表示
  - エラー表示
  - データ0件時のメッセージ表示
- 申請一覧テーブル
  - 詳細ボタン
  - 編集ボタン
  - 削除ボタン（UI とコールバック呼び出しまで実装）
- 申請詳細画面
  - URL パラメータから申請 ID を取得
  - API から申請詳細を取得
  - 不正な ID や取得失敗時のエラー表示
- 申請編集画面
  - 画面枠のみ実装済み

### ユーザー情報表示

- ダッシュボード画面
  - 認証済みユーザー情報の取得
  - トークン未保持 / 401 / その他失敗のメッセージ切り分け

---

## ルーティング

現在の主なルート構成は以下の通りです。

- `/login` : ログイン画面
- `/register` : ユーザー登録画面
- `/applications` : 申請一覧画面
- `/applications/:id` : 申請詳細画面
- `/applications/:id/edit` : 申請編集画面
- `/dashboard` : ダッシュボード画面
- `/` : 認証済みなら `/applications`、未認証なら `/login` へ遷移

---

## API 連携

本アプリケーションは、以下のバックエンド API と連携する想定です。

- `POST /api/auth/register` : ユーザー登録
- `POST /api/auth/login` : ログイン
- `GET /api/auth/me` : ログイン中ユーザー情報取得
- `GET /api/applications` : 申請一覧取得
- `GET /api/applications/:id` : 申請詳細取得

フロントエンドでは、Axios インターセプターを利用して、
必要なリクエストに JWT を自動付与する実装を入れています。

環境変数 `VITE_API_BASE_URL` を指定しない場合、API のベース URL は以下を使用します。

```txt
http://localhost:5071/api
```

---

## テスト

以下の画面 / コンポーネントに対してテストを追加しています。

- `ApplicationListPage`
  - 初期表示
  - 一覧表示
  - 0件表示
  - エラー表示
- `ApplicationDetailPage`
  - 初期表示
  - 詳細表示
  - 不正 ID
  - API エラー
- `ApplicationListTable`
  - 詳細 / 編集 / 削除ボタンの表示
  - リンク先確認
  - 削除ボタンクリック時のコールバック確認

実行コマンド:

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

- 申請編集機能の本実装
- 申請削除機能の API 連携
- 申請作成機能
- 申請一覧の表示改善（日付整形など）
- 共通 API 呼び出しの整理
- 認証まわりのテスト追加
- E2E テスト導入の検討

---

## 補足

本リポジトリは、学習およびポートフォリオ用途で作成しています。  
ASP.NET Core Web API 側の実装とあわせて、段階的に機能を拡張していく予定です。
