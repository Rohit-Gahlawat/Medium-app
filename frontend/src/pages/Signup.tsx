import { QuoteSignup } from "../components/quotesignup";
import { InputForm } from "../components/inputform";
import Buttons from "../components/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { SignupType } from "@night-kernel/sayit-app-common";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";



export const Signup = () => {
    const navigate = useNavigate();
    const [postinputs, setPostInputs] = useState<SignupType>({
        name: "",
        email: "",
        password: ""
    });
    const [showpassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const passwordRules = {
        minLength: postinputs.password.length >= 8,
        uppercase: /[A-Z]/.test(postinputs.password),
        number: /[0-9]/.test(postinputs.password),
    }
    const sendReq = async () => {
        setLoading(true)
        try {
            const response = await axios.post(
                `${BACKEND_URL}user/signup`,
                postinputs)
            console.log(response.data)
            const jwt = response.data.token
            localStorage.setItem("token", jwt);
            localStorage.setItem("name", postinputs.name || postinputs.email.split("@")[0])
            navigate("/bloghome")
        } catch (e: any) {
            alert("Error while Signing up")


            console.log(e.response?.data)
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
                            Create an account
                        </div>

                        <div className="text-sm md:text-lg text-gray-500 flex justify-center text-center leading-tight">
                            Already have any account? <Link className="pl-2 underline" to="/signin">Login</Link>
                        </div>
                    </div>


                    <InputForm

                        label="Account Name"
                        placeholder="Enter Your Account Name "
                        onChange={(e) => {
                            setPostInputs(c => ({
                                ...c,
                                name: e.target.value
                            }))
                        }}
                        value={postinputs.name || ""}
                    />

                    <InputForm
                        label="Email"
                        placeholder="abc@cyz.com"
                        onChange={(e) => {
                            setPostInputs(c => ({
                                ...c,
                                email: e.target.value
                            }
                            ))
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
                        {postinputs.password.length > 0 && <div className="mt-3 space-y-1 text-xs">
                            <p className={passwordRules.minLength ? "text-green-600" : "text-gray-500"}>
                                {passwordRules.minLength ? "✅" : "•"} at least 8 characters
                            </p>

                            <p className={passwordRules.uppercase ? "text-green-600" : "text-gray-500"}>
                                {passwordRules.uppercase ? "✅" : "•"} at least one uppercase letter
                            </p>

                            <p className={passwordRules.number ? "text-green-600" : "text-gray-500"}>
                                {passwordRules.number ? "✅" : "•"} al least one number
                            </p>
                        </div>}

                    </div>



                    <div className="flex justify-center w-full">
                        <Buttons onClick={sendReq} text="Sign Up" loading={loading} loadingText="Creating account..." />
                    </div>

                </div>
            </div>


            <div className="hidden md:block md:w-1/2">
                <QuoteSignup />
            </div>

        </div>
    )
}