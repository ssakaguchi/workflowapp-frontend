export type ApplicationListItem = {
  id: number;
  title: string;
  content: string; // 削除予定
  createdAt: string;
  updatedAt: string;
};

export type ApplicationDetail = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateApplicationRequest = {
  title: string;
  content: string;
};
