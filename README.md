# WorkflowApp.Frontend

業務ワークフロー（申請・承認）を想定したフロントエンドアプリケーションです。
React + TypeScript を用いて開発しており、ASP.NET Core Web API と連携して動作します。

現在は、ユーザー登録・ログインなどの認証機能を中心に実装しています。
今後は、申請・承認フローなどの業務機能を追加予定です。

---

## 作成背景

これまでデスクトップアプリケーション中心の開発経験が多かったため、
Webアプリケーション開発（特にフロントエンド）のスキル習得を目的として作成しています。

本プロジェクトでは、以下の習得を意識しています。

- React + TypeScript によるフロントエンド開発
- ASP.NET Core Web API との連携
- 認証を含むWebアプリケーションの基本構成の理解
- 業務系アプリケーションを想定した設計

---

## 使用技術

- React
- TypeScript
- Vite
- Axios
- React Router
- CSS

---

## 現在の実装機能

- ユーザー登録画面
- ログイン画面
- 入力バリデーション
- API通信（Axios）
- JWTを用いた認証処理
- ログイン状態に応じた画面制御

---

## 今後の実装予定

- 申請作成機能
- 申請一覧画面
- 承認・差戻し機能
- 権限ごとの画面制御
- エラーハンドリングの改善
- テストコードの追加

---

## 画面イメージ

※ 今後追加予定

---

## セットアップ手順

### 1. リポジトリをクローン

```bash
git clone https://github.com/ssakaguchi/workflowapp-frontend.git
cd WorkflowApp.Frontend
```

### 2. パッケージをインストール

```bash
npm install
```

### 3. 開発サーバーを起動

```bash
npm run dev
```

---

## API連携

本アプリケーションは、[ASP.NET Core Web API](https://github.com/ssakaguchi/WorkflowApp.Api) と連携して動作します。

バックエンドでは以下の機能を実装しています。

- ユーザー登録
- ログイン
- JWT認証
- 認証付きAPI

---

## 補足

本リポジトリは、学習およびポートフォリオ用途で作成しています。
今後、バックエンドと連携しながら段階的に機能拡張を行っていく予定です。
