export type ApplicationListItem = {
  id: number;
  title: string;
  status: ApplicationStatus;
  createdAt: string;
};

export type ApplicationDetail = {
  id: number;
  title: string;
  content: string;
  status: ApplicationStatus;
  applicantUserId: number; // 最終的には使用しない可能性がある
  createdAt: string;
  approvalSteps: ApprovalStepResponse[];
};

// 申請の一覧表示やフィルタリングに使用する型
export type ApplicationStatus = "Pending" | "Approved" | "Rejected";
export type StatusFilter = "All" | ApplicationStatus;

// ページネーションされた結果を表す型
export type PagedResponse<T> = {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

// 申請の新規作成に使用するリクエストの型
type ApplicationRequestBase = {
  title: string;
  content: string;
  approverUserId: number;
};

// 申請の更新に使用するリクエストの型
type ApplicationUpdateRequestBase = {
  title: string;
  content: string;
};

// 承認ステップのレスポンスの型
export type ApprovalStepResponse = {
  id: number;
  stepOrder: number;
  approverUserId: number;
  status: ApplicationStatus;
};

// 承認者の情報を表す型
export type Approver = {
  userId: number;
  displayName: string;
};

// 申請作成時は承認者IDを含める
export type CreateApplicationRequest = ApplicationRequestBase;

// 申請更新時はタイトルと内容のみ更新する
export type UpdateApplicationRequest = ApplicationUpdateRequestBase;

// 申請一覧の表示に使用する型
export type ListView = "myApplications" | "approvalRequests" | "admin";
