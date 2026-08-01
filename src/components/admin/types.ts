export type AdminPost = {
  slug: string;
  title: string;
  date: string;
  updated: string;
  category: string;
  tags: string;
  cover: string;
  excerpt: string;
  content: string;
};

export type PostListItem = Omit<AdminPost, "tags"> & {
  tags: string[];
};

export type ImageEntry = {
  name: string;
  size: number;
};
