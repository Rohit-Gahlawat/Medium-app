import { Link, useNavigate, useParams } from "react-router-dom";
import { useBlog } from "../hooks/useblog";
import { useBlogs } from "../hooks";
import SignOut from "../components/signout";
import FollowButton from "../components/followbutton";

export default function BlogPage() {
  const { id } = useParams<{ id: string }>();
  const { loading, blog } = useBlog(id!);
  const { blogs, followingIds } = useBlogs();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const suggestions = blogs.filter((u) => u.id !== id).slice(0, 3);

  let myId = ""
  try {
    myId = JSON.parse(atob(token!.split(".")[1])).id
  } catch (e) {
    myId = ""
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-4 border-gray-200 border-t-black animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-sm text-gray-400">Blog not found.</p>
      </div>
    );
  }

  const initials = (blog.author?.name || "U")
    .toUpperCase()
    .split(" ")
    .map((n: string) => n[0])
    .join("");

  const readTime = `${Math.max(
    1,
    Math.floor((blog.content?.length || 0) / 200)
  )} min read`;

  return (
    <div className="min-h-screen bg-white font-sans">

      <nav className="flex items-center justify-between px-3 sm:px-6 lg:px-8 py-3 border-b border-gray-100 gap-3">

        <span
          className="text-lg sm:text-2xl font-semibold tracking-tight cursor-pointer whitespace-nowrap"
          onClick={() => navigate("/bloghome")}
        >
          Sayit
        </span>

        <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">

          <button
            onClick={() => navigate("/createblog")}
            className="text-xs sm:text-sm text-gray-500 hover:text-gray-800 px-2 sm:px-3 py-1 rounded-full cursor-pointer whitespace-nowrap"
          >
            ✏️ Write
          </button>

          {!token && (
            <button
              onClick={() => {
                navigate("/signin");
              }}
              className="text-xs sm:text-sm bg-gray-900 text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-full font-medium hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              Sign in
            </button>
          )}

          {token && <SignOut />}
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">

        <div className="flex flex-col lg:flex-row lg:gap-16">

          <article className="flex-1 min-w-0 max-w-[680px]">

            <h1 className="text-3xl sm:text-[42px] font-bold text-ink leading-tight sm:leading-[52px] tracking-[-0.462px] mb-8 break-words">
              {blog.title}
            </h1>

            <div className="flex items-center gap-3 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-100">

              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs sm:text-sm font-semibold text-gray-600 flex-shrink-0">
                {initials}
              </div>

              <div className="min-w-0">
                <p className="text-sm text-ink break-words">
                  {blog.author?.name || "Anonymous"}
                </p>

                <p className="text-[13px] leading-5 text-ink-muted">
                  {readTime}
                </p>
              </div>

            </div>

            <div className="prose prose-gray max-w-none overflow-hidden">

              {blog.content.split("\n").map((para: string, i: number) =>
                para.trim() ? (
                  <p
                    key={i}
                    className="font-serif text-[19px] sm:text-[20px] text-ink leading-8 sm:leading-[32px] tracking-[-0.06px] mb-8 break-words"
                  >
                    {para}
                  </p>
                ) : null
              )}

            </div>

          </article>

          <aside className="mt-10 lg:mt-0 w-full lg:w-64 lg:flex-shrink-0 border-t border-gray-100 pt-8 lg:border-t-0 lg:pt-0">

            <div className="lg:sticky lg:top-8">

              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Author
              </p>

              <div className="flex items-center gap-3 mb-3">

                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 flex items-center justify-center text-sm sm:text-base font-semibold text-gray-600 flex-shrink-0">
                  {initials}
                </div>

                <p className="text-sm sm:text-base font-semibold text-gray-900 break-words">
                  {blog.author?.name || "Anonymous"}
                </p>

              </div>

              {blog.author?.id && blog.author.id !== myId && (
                <FollowButton
                  creatorId={blog.author.id}
                  following={followingIds.includes(blog.author.id)}
                />
              )}

              <div className="border-t border-gray-100 mt-8 pt-8">

                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                  More from Sayit
                </p>

                <div className="space-y-4">

                  {suggestions.map((u) => (
                    <Link
                      key={u.id}
                      to={`/blog/${u.id}`}
                      className="block cursor-pointer group"
                    >

                      <p className="text-sm font-medium text-gray-900 group-hover:underline leading-snug line-clamp-2 break-words">
                        {u.title}
                      </p>

                      <p className="text-xs text-gray-400 mt-0.5">
                        {Math.max(
                          1,
                          Math.floor((u.content?.length || 0) / 200)
                        )}{" "}
                        min read
                      </p>

                    </Link>
                  ))}

                </div>
              </div>

            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}