import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

const avatarColors = [
  "bg-teal-100 text-teal-800",
  "bg-blue-100 text-blue-800",
  "bg-orange-100 text-orange-800"
]

const thumbnails = {
  bread: {
    thumbColor: "bg-red-50",
    thumbIcon: "🍞",
  },
  ice: {
    thumbColor: "bg-blue-50",
    thumbIcon: "🧊",
  },
  salad: {
    thumbColor: "bg-green-50",
    thumbIcon: "🥗",
  },
  lemon: {
    thumbColor: "bg-yellow-50",
    thumbIcon: "🍋",
  },
  grapes: {
    thumbColor: "bg-purple-50",
    thumbIcon: "🍇",
  },
  cupcake: {
    thumbColor: "bg-pink-50",
    thumbIcon: "🧁",
  },
  orange: {
    thumbColor: "bg-orange-50",
    thumbIcon: "🍊",
  },
  galaxy: {
    thumbColor: "bg-indigo-50",
    thumbIcon: "🌌",
  },
  dolphin: {
    thumbColor: "bg-teal-50",
    thumbIcon: "🐬",
  },
  diamond: {
    thumbColor: "bg-cyan-50",
    thumbIcon: "💎",
  },
}


type Article = {
  id: string;

  title: string;
  content: string;
  author: {
    id: string
    name: string
  }

};

export default function ArticleCard({ article, saved, onToggleSave }: { article: Article; saved: boolean; onToggleSave: (id: string) => void }) {
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaving(true)
    try {
      await axios.post(`${BACKEND_URL}blog/save/${article.id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      onToggleSave(article.id)
    } catch (err) {
      console.log(err)
    } finally {
      setSaving(false)
    }
  }

  const initials = (article.author?.name || "USER")
    .toUpperCase()
    .split(" ").map(n => n[0]).join("");



  const readTime = `${Math.max(1, Math.floor((article.content?.length || 0) / 100))} min read`;

  const hash = article.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)

  const color = avatarColors[hash % avatarColors.length]
  const thumbnailList = Object.values(thumbnails)
  const thumbnail = thumbnailList[hash % thumbnailList.length]
  const date = new Date(1700000000000 - (hash * 1000000)).toLocaleDateString("en-US", {
    month: "short", day: "2-digit", year: "numeric"
  })







  return (
    <div className="flex gap-3 sm:gap-4 py-5 sm:py-6 border-b border-gray-100 cursor-pointer group">
      <div className="flex-1 min-w-0">

        <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
          <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${color}`}>
            {initials}
          </div>
          <span className="text-sm text-ink">{article.author?.name || "Anonymous"}</span>
          <span className="text-ink-muted text-sm">·</span>
          <span className="text-[13px] text-ink-muted">{date}</span>
        </div>

        <h2 className="text-lg sm:text-[22px] font-bold text-ink leading-snug sm:leading-[30px] tracking-[-0.2px] mb-1.5 sm:mb-2 group-hover:underline line-clamp-2 sm:line-clamp-none">
          {article.title}
        </h2>

        <p className=" text-sm text-ink-muted leading-relaxed mb-3 line-clamp-2">
          {article.content}
        </p>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-[13px] text-ink-muted">{readTime}</span>
          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`p-1 cursor-pointer rounded hover:bg-gray-100 text-sm disabled:opacity-50 ${saved ? "text-gray-900" : "text-gray-400"}`}
              aria-label={saved ? "Remove from saved" : "Save"}
            >
              {saving
                ? <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-gray-200 border-t-gray-600 animate-spin align-middle" />
                : (saved ? "🔖" : "🏷️")}
            </button>

          </div>
        </div>

      </div>

      <div className={`w-20 h-16 sm:w-28 sm:h-20 rounded-lg flex-shrink-0 flex items-center justify-center text-3xl sm:text-4xl ${thumbnail.thumbColor}`}>
        {thumbnail.thumbIcon}
      </div>
    </div>
  );
}
