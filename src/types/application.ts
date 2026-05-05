export type ApplicationListItem = {
  id: number;
  title: string;
  status: string;
  createdAt: string;
};

export type ApplicationDetail = {
  id: number;
  title: string;
  content: string;
  status: string;
  applicantUserId: number; // 最終的には使用しない可能性がある
  createdAt: string;
};

// 申請の新規作成や更新に使用するリクエストの型
type ApplicationRequestBase = {
  title: string;
  content: string;
};

// 新規作成と更新で同じフィールドを使用するため、共通の型を定義
export type CreateApplicationRequest = ApplicationRequestBase;
export type UpdateApplicationRequest = ApplicationRequestBase;
