import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { BACKEND_URL } from "../config"
import SignOut from "../components/signout"

export const CreateBlog = () => {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [publishing, setPublishing] = useState(false)
    const navigate = useNavigate()

    const handlePublish = async () => {
        if (!title.trim() || !content.trim()) return
        setPublishing(true)
        try {
            const res = await axios.post(
                `${BACKEND_URL}blog`,
                { title, content },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            navigate(`/blog/${res.data.id}`)
        } catch (e) {
            alert("Error while publishing blog or you have not signedin yet")
        } finally {
            setPublishing(false)
        }
    }

    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
    const readTime = Math.max(1, Math.floor(wordCount / 200))

    return (
        <div className="min-h-screen bg-white">

            {/* Navbar */}
            <nav className="flex items-center justify-between px-4 sm:px-8 md:px-12 py-3 border-b border-gray-100">

                {/* Left */}
                <div className="flex items-center gap-3 sm:gap-4">
                    <span
                        onClick={() => navigate("/bloghome")}
                        className="text-xl sm:text-2xl font-semibold tracking-tight cursor-pointer"
                    >
                        Sayit
                    </span>
                    <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
                        <span>Draft</span>
                        {title && (
                            <>
                                <span>·</span>
                                <span className="text-green-600">Saved</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Read time preview */}
                    {content && (
                        <span className="hidden sm:block text-xs text-gray-400">
                            {readTime} min read
                        </span>
                    )}

                    <button
                        onClick={handlePublish}
                        disabled={publishing || !title.trim() || !content.trim()}
                        className="text-sm bg-green-700 text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-full font-medium hover:bg-green-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {publishing ? "Publishing..." : "Publish"}
                    </button>

                    <SignOut />

                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700 cursor-pointer flex-shrink-0">
                        {(localStorage.getItem("name") || "U")[0].toUpperCase()}
                    </div>
                </div>
            </nav>

            {/* Editor */}
            <div className="flex justify-center px-4 sm:px-8">
                <div className="w-full max-w-2xl pt-10 sm:pt-16 pb-32">

                    {/* Title */}
                    <textarea
                        placeholder="Title"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value)
                            // auto resize
                            e.target.style.height = "auto"
                            e.target.style.height = e.target.scrollHeight + "px"
                        }}
                        rows={1}
                        className="w-full resize-none overflow-hidden bg-transparent outline-none text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 placeholder:text-gray-300 leading-tight mb-6"
                    />

                    {/* Divider */}
                    {title && (
                        <div className="border-t border-gray-100 mb-6" />
                    )}

                    {/* Content */}
                    <textarea
                        placeholder="Tell your story..."
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value)
                            e.target.style.height = "auto"
                            e.target.style.height = e.target.scrollHeight + "px"
                        }}
                        rows={10}
                        className="w-full bg-transparent outline-none resize-none text-lg sm:text-xl leading-8 sm:leading-9 text-gray-700 placeholder:text-gray-300"
                    />

                </div>
            </div>

            {/* Bottom bar — mobile only */}
            <div className="fixed bottom-0 left-0 right-0 sm:hidden border-t border-gray-100 bg-white px-4 py-3 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                    {wordCount} words · {readTime} min read
                </span>
                <button
                    onClick={handlePublish}
                    disabled={publishing || !title.trim() || !content.trim()}
                    className="text-sm bg-green-700 text-white px-4 py-1.5 rounded-full font-medium disabled:opacity-40"
                >
                    {publishing ? "Publishing..." : "Publish"}
                </button>
            </div>

        </div>
    )
}
