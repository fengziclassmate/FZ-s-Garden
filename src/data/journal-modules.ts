export type MomentEntry = {
  id: string;
  date: string;
  text: string;
  location?: string;
  mood?: string;
  images?: string[];
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
    description: "像轻量朋友圈一样收纳日常片段、照片、地点和当天的小高光。",
    mark: "M",
  },
  {
    href: "/journal/whispers",
    label: "Whispers",
    eyebrow: "Tiny thoughts",
    description: "存放没必要写成长文章的短句、灵感、心情和自言自语。",
    mark: "W",
  },
];

export const moments: MomentEntry[] = [];

export const whispers: WhisperEntry[] = [];
