import { useState } from "react";
import ArticleCard from "../components/blogcard"
import { useBlogs } from "../hooks/index";
import { Link } from "react-router-dom";
import SignOut from "../components/signout";
import TopPicks from "../components/toppicks";
import axios from "axios";
import { BACKEND_URL } from "../config";






export default function BlogHome() {

  const [activeTab, setActiveTab] = useState<"for-you" | "saved" | "following">("for-you");
  const [menuOpen, setMenuOpen] = useState(false);
  const [unfollowing, setUnfollowing] = useState("");
  const { loading, blogs, savedIds, setSavedIds, followingIds, setFollowingIds } = useBlogs();
  const token = localStorage.getItem("token");

  const tabLabels = {
    "for-you": "For you",
    "saved": "Saved",
    "following": "Following"
  }

  // the save button already wrote to the db, this just keeps the ui in sync
  const toggleSave = (id: string) => {
    setSavedIds((c) => c.includes(id) ? c.filter((s) => s !== id) : [...c, id])
  }

  // same endpoint as the follow button, it toggles either way
  const handleUnfollow = async (creatorId: string) => {
    setUnfollowing(creatorId)
    try {
      await axios.post(`${BACKEND_URL}user/follow/${creatorId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      setFollowingIds((c) => c.filter((f) => f !== creatorId))
    } catch (e) {
      console.log(e)
    } finally {
      setUnfollowing("")
    }
  }

  const savedBlogs = blogs.filter((b) => savedIds.includes(b.id))
  const followingBlogs = blogs.filter((b) => followingIds.includes(b.author?.id))

  // you can only follow someone from their blog, so every followed
  // creator shows up here through at least one of their posts
  const followedCreators = followingBlogs.reduce((acc, b) => {
    if (!acc.some((a) => a.id === b.author.id)) {
      acc.push({ id: b.author.id, name: b.author.name })
    }
    return acc
  }, [] as { id: string; name: string }[])




  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">

          <div className="h-10 w-10 rounded-full border-4 border-gray-200 border-t-black animate-spin" />

          <p className="text-sm text-gray-500 font-medium">
            Loading blogs...
          </p>

        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Nav */}
      <nav className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3 sm:gap-6">
          <span className="text-xl sm:text-2xl font-semibold tracking-tight">Sayit</span>
          {/* Tabs — hidden on mobile */}
          <div className="hidden sm:flex">
            {(["for-you", "saved", "following"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm px-4 py-2 border-b-2 cursor-pointer transition-all ${activeTab === tab
                  ? "border-gray-900 text-gray-900 font-medium"
                  : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
              >
                {tabLabels[tab]}
                {tab === "saved" && savedIds.length > 0 && (
                  <span className="ml-1.5 text-xs text-gray-400">{savedIds.length}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop nav right */}
        <div className="hidden sm:flex items-center gap-3">
          <Link to={"/createblog"}><button className="text-sm text-gray-500 flex items-center gap-1 hover:text-gray-800 px-3 py-1 rounded-full cursor-pointer">
            ✏️ Write
          </button>
          </Link>
          {(!token) && <Link to={"/signin"}><button className="text-sm bg-gray-900 text-white px-5 py-2 rounded-full font-medium hover:bg-gray-700 transition-colors cursor-pointer">
            Sign in
          </button>
          </Link>}

          {token && <SignOut />}

        </div>

        {/* Mobile nav right */}
        <div className="flex sm:hidden items-center gap-1">

          {/* Write button */}
          <Link
            to="/createblog"
            className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-gray-100 transition-colors"
          >
            <span className="text-lg">✏️</span>
          </Link>

          {/* Sign in */}
          {!token && (
            <Link
              to="/signin"
              className="text-xs bg-gray-900 text-white px-3 py-2 rounded-full font-medium hover:bg-gray-700 transition-colors whitespace-nowrap"
            >
              Sign in
            </Link>
          )}

          {/* Menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
            aria-label="Menu"
          >
            ☰
          </button>

        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="sm:hidden border-b border-gray-100 px-4 py-3 bg-white space-y-2">
          <Link to={"/createblog"}><button className="block text-sm text-gray-700 py-1 cursor-pointer">✏️ Write</button></Link>
          {token && <SignOut />}
        </div>
      )}

      {/* Mobile tabs */}
      <div className="flex sm:hidden border-b border-gray-100 px-4">
        {(["for-you", "saved", "following"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm px-4 py-2.5 border-b-2 transition-all ${activeTab === tab
              ? "border-gray-900 text-gray-900 font-medium"
              : "border-transparent text-gray-500"
              }`}
          >
            {tabLabels[tab]}
            {tab === "saved" && savedIds.length > 0 && (
              <span className="ml-1.5 text-xs text-gray-400">{savedIds.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Banner */}
      <div className="bg-yellow-400 px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        <span className="text-xs sm:text-sm text-gray-900">
          <strong>Get unlimited access</strong>
          <span className="hidden sm:inline"> to the best of Sayit for less than $1/week.</span>
        </span>
        <span className="text-xs sm:text-sm font-semibold text-gray-900 underline cursor-pointer whitespace-nowrap">
          Become a member →
        </span>
      </div>

      {/* Main layout */}
      <div className="max-w-5xl mx-auto">

        {/* On mobile: stacked. On lg: side by side */}
        <div className="lg:flex">

          {/* Feed */}
          <main className="flex-1 px-4 sm:px-6 lg:border-r lg:border-gray-100">
            {activeTab === "for-you" &&
              blogs.map((article) => (
                <Link key={article.id} to={`/blog/${article.id}`} className="block"  ><ArticleCard article={article} saved={savedIds.includes(article.id)} onToggleSave={toggleSave} />
                </Link>

              ))
            }

            {activeTab === "saved" && (
              savedBlogs.length > 0
                ? savedBlogs.map((article) => (
                  <Link key={article.id} to={`/blog/${article.id}`} className="block"  ><ArticleCard article={article} saved={true} onToggleSave={toggleSave} />
                  </Link>
                ))
                : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">

                    <div className="text-5xl mb-4">
                      🔖
                    </div>

                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Nothing saved yet
                    </h2>

                    <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
                      Tap the tag on any story to save it and read it later.
                    </p>

                    <button onClick={() => {
                      setActiveTab("for-you")
                    }} className="mt-6 px-5 py-2 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors">
                      Browse stories
                    </button>

                  </div>
                )
            )}

            {activeTab === "following" && (
              followedCreators.length > 0
                ? <div className="py-6">

                  {/* Creators you follow */}
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                    Creators you follow
                  </p>

                  <div className="flex flex-wrap gap-2 mb-2">
                    {followedCreators.map((creator) => (
                      <span
                        key={creator.id}
                        className="text-sm text-gray-700 border border-gray-300 px-3 py-1 rounded-full flex items-center gap-2"
                      >
                        {creator.name || "Anonymous"}

                        <button
                          onClick={() => handleUnfollow(creator.id)}
                          disabled={unfollowing === creator.id}
                          className="text-gray-400 hover:text-gray-900 cursor-pointer disabled:opacity-50"
                          aria-label={`Unfollow ${creator.name || "this creator"}`}
                          title="Unfollow"
                        >
                          {unfollowing === creator.id
                            ? <span className="inline-block h-3 w-3 rounded-full border-2 border-gray-200 border-t-gray-600 animate-spin align-middle" />
                            : "✕"}
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Their stories */}
                  <div className="border-t border-gray-100 mt-6">
                    {followingBlogs.map((article) => (
                      <Link key={article.id} to={`/blog/${article.id}`} className="block"  ><ArticleCard article={article} saved={savedIds.includes(article.id)} onToggleSave={toggleSave} />
                      </Link>
                    ))}
                  </div>

                </div>
                : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">

                    <div className="text-5xl mb-4">
                      👥
                    </div>

                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Nothing here yet
                    </h2>

                    <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
                      Follow your favorite writers and publications to see their latest stories here.
                    </p>

                    <button onClick={() => {
                      setActiveTab("for-you")
                    }} className="mt-6 px-5 py-2 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors">
                      Discover writers
                    </button>

                  </div>
                )
            )}

          </main>

          {/* Sidebar — shown below feed on mobile/tablet, beside on lg */}
          <div className="px-4 sm:px-6 py-6 border-t border-gray-100 lg:border-t-0 lg:border-l-0 lg:w-72 lg:flex-shrink-0">

            <TopPicks blogs={blogs} skip={5} />

          </div>

        </div>
      </div>
    </div>
  );
}
