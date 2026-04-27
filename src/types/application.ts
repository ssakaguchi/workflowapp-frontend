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

export type UpdateApplicationRequest = {
  title: string;
  content: string;
};
