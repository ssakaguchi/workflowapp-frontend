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

// 申請の新規作成や更新に使用するリクエストの型
type ApplicationRequestBase = {
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

// 新規作成と更新で同じフィールドを使用するため、共通の型を定義
export type CreateApplicationRequest = ApplicationRequestBase;
export type UpdateApplicationRequest = ApplicationRequestBase;
