type TagListProps = {
  tags: string[];
};

export function TagList({ tags }: TagListProps) {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span key={tag} className="rounded-full border border-line bg-surface-soft/72 px-3 py-1 text-xs text-muted-ink">
          {tag}
        </span>
      ))}
    </div>
  );
}
