export type MomentEntry = {
  id: string;
  date: string;
  text: string;
  location?: string;
  mood?: string;
  images?: string[];
  comments?: { name: string; text: string }[];
};

export type WhisperEntry = {
  id: string;
  date: string;
  text: string;
  tone?: string;
};

export const journalModules = [
  {
    href: "/journal/moment",
    label: "Moment",
    eyebrow: "Daily fragments",
    description: "像朋友圈一样收纳日常片段、照片、地点和当天的小高光。",
    mark: "M",
  },
  {
    href: "/journal/whisper",
    label: "Whisper",
    eyebrow: "Tiny thoughts",
    description: "存放没必要写成长文章的短句、灵感、心情和自言自语。",
    mark: "W",
  },
  {
    href: "/blogs?type=journal",
    label: "Blogs",
    eyebrow: "Long journal",
    description: "保留完整标题、正文和评论区的长篇 Journal 记录。",
    mark: "B",
  },
];

export const moments: MomentEntry[] = [];

export const whispers: WhisperEntry[] = [];
