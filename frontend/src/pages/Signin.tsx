import { QuoteSignin } from "../components/quotesignin";
import { InputForm } from "../components/inputform";
import Buttons from "../components/button";
import { useState } from "react";
import type { SigninType } from "@night-kernel/sayit-app-common";
import axios from "axios"
import { BACKEND_URL } from "../config"
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


export const Signin = () => {
    const [postinputs, setPostInputs] = useState<SigninType>({
        email: "",
        password: ""
    })
    const [showpassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const sendReq = async () => {
        setLoading(true)
        try {
            const response = await axios.post(
                `${BACKEND_URL}user/signin`,
                postinputs)
            const jwt = response.data.token
            localStorage.setItem("token", jwt)
            localStorage.setItem("name", response.data.name || response.data.email.split("@")[0])
            console.log(response.data)
            navigate("/bloghome")
        } catch (e) {
            alert("Error while signing in")
            console.log(e)
        } finally {
            setLoading(false)
        }
    }




    return (
        <div className="flex flex-col md:flex-row h-screen">


            <div className="w-full md:w-1/2 flex justify-center items-center min-h-screen md:min-h-0 px-6 py-10">
                <div className="w-full max-w-sm space-y-4">

                    <div className="space-y-1">
                        <div className="text-3xl md:text-4xl font-bold flex justify-center text-center">
                            Sign In
                        </div>

                        <div className="text-sm md:text-lg text-gray-500 flex justify-center text-center leading-tight">
                            Don't have an account? <Link className="pl-2 underline" to="/signup">Signup</Link>
                        </div>
                    </div>



                    <InputForm
                        label="Email"
                        placeholder="abc@cyz.com"
                        onChange={(e) => {
                            setPostInputs(c => ({ ...c, email: e.target.value }))
                        }}
                        value={postinputs.email}
                    />

                    <div>
                        <InputForm
                            label="Password"
                            placeholder=""
                            onChange={(e) => {
                                setPostInputs(c => ({
                                    ...c,
                                    password: e.target.value
                                }
                                ))
                            }}
                            value={postinputs.password}
                            type={showpassword ? "text" : "password"}

                        />
                        <label className="show-password mt-2 flex items-center gap-1 text-xs text-gray-700 cursor-pointer">
                            <input
                                type="checkbox"
                                className="h-4 w-4 accent-blue-500 rounded-full border-gray"
                                onChange={() => setShowPassword(!showpassword)}
                            />
                            show password
                        </label>
                    </div>

                    <div className="flex justify-center w-full">
                        <Buttons onClick={sendReq} text="Sign In" loading={loading} loadingText="Signing in..." />
                    </div>

                </div>
            </div>


            <div className="hidden md:block md:w-1/2">
                <QuoteSignin />
            </div>

        </div>
    )
}