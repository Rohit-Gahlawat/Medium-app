import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export default function FollowButton({ creatorId, following }: { creatorId: string; following: boolean }) {
  const [isfollowing, setIsFollowing] = useState(following);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsFollowing(following)
  }, [following])

  const handleFollow = async () => {
    setLoading(true)
    try {
      const res = await axios.post(`${BACKEND_URL}user/follow/${creatorId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      setIsFollowing(res.data.following)
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`text-xs sm:text-sm px-4 sm:px-5 py-2 rounded-full font-medium transition-colors whitespace-nowrap flex items-center gap-2 disabled:opacity-60 ${isfollowing
        ? "border border-gray-900 text-gray-900 hover:bg-gray-100"
        : "bg-gray-900 text-white hover:bg-gray-700"
        }`}
    >
      {loading && (
        <span className={`h-3.5 w-3.5 rounded-full border-2 animate-spin ${isfollowing ? "border-gray-200 border-t-gray-600" : "border-gray-500 border-t-white"}`} />
      )}
      {isfollowing ? "Following" : "Follow"}
    </button>
  );
}
