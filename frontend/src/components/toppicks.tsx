import { Link } from "react-router-dom";

const avatarColors = [
  "bg-teal-100 text-teal-800",
  "bg-blue-100 text-blue-800",
  "bg-orange-100 text-orange-800"
]

type Blog = {
  id: string;
  title: string;
  content: string;
  author: {
    id: string
    name: string
  }
};

export default function TopPicks({ blogs, skip }: { blogs: Blog[]; skip: number }) {

  const picks = blogs
    .slice(skip)
    .sort((a, b) => (b.content?.length || 0) - (a.content?.length || 0))
    .slice(0, 5);

  if (picks.length === 0) {
    return null;
  }

  return (
    <div className="lg:sticky lg:top-6">

      <p className="text-[13px] font-semibold text-ink uppercase tracking-widest mb-4">
        Top picks
      </p>

      <div className="space-y-5">

        {picks.map((pick) => {

          const initials = (pick.author?.name || "USER")
            .toUpperCase()
            .split(" ").map(n => n[0]).join("");

          const hash = pick.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
          const color = avatarColors[hash % avatarColors.length]
          const readTime = `${Math.max(1, Math.floor((pick.content?.length || 0) / 100))} min read`;

          return (
            <Link key={pick.id} to={`/blog/${pick.id}`} className="block group">

              <div className="flex items-center gap-1.5 mb-1.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium flex-shrink-0 ${color}`}>
                  {initials}
                </div>
                <span className="text-[13px] text-ink truncate">
                  {pick.author?.name || "Anonymous"}
                </span>
              </div>

              <p className="text-sm font-bold text-ink leading-snug group-hover:underline line-clamp-2">
                {pick.title}
              </p>

              <p className="text-[13px] leading-5 text-ink-muted mt-1">
                {readTime}
              </p>

            </Link>
          )
        })}

      </div>
    </div>
  );
}
