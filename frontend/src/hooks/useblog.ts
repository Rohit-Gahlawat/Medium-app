import { useEffect, useState } from "react"
import axios from "axios";
import { BACKEND_URL } from "../config";
type Blog = {
    title: string;
    content: string;
    id: string;
    published: boolean;
    author: {
        id: string
        name: string
    }
}
export const useBlog = (id: string) => {
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState<Blog>()

    useEffect(() => {
        axios.get(`${BACKEND_URL}blog/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then((res) => {
            setBlog(res.data.blog)
            setLoading(false)
        }).catch(() => {
            setLoading(false)
        })

    }, [id])
    return { loading, blog }
}