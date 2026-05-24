export type ContentType = "journal" | "research" | "reading" | "project" | "behind";

export type BaseContent = {
  slug: string;
  title: string;
  date: string;
  type: ContentType;
  summary: string;
  tags: string[];
  category?: string;
  pinned?: boolean;
  draft?: boolean;
  readingMinutes: number;
  html: string;
};

export type ReadingContent = BaseContent & {
  type: "reading";
  itemType?: "paper" | "book" | "article";
  authors?: string[];
  year?: number;
  source?: string;
  doi?: string;
  url?: string;
  oneLine?: string;
  readingStatus?: string;
  importance?: string;
  relatedProjects?: string[];
};

export type ProjectContent = BaseContent & {
  type: "project";
  projectType?: "research" | "code" | "personal-tool" | "writing" | "website";
  status?: "idea" | "building" | "paused" | "finished" | "archived";
  startDate?: string;
  endDate?: string;
  links?: {
    demo?: string;
    github?: string;
  };
};

export type GardenContent = BaseContent | ReadingContent | ProjectContent;

export type ContentMeta = Omit<GardenContent, "html">;

export type NowStatus = {
  updatedAt: string;
  focus: string;
  reading: string[];
  writing: string[];
  researching: string[];
  thinking: string[];
  life: string[];
};
