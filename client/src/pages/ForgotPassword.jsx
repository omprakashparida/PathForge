import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false); // 1. Added Loading State

    const navigate = useNavigate();

    const handleSendOTP = async (e) => {
        e.preventDefault(); // 2. Prevent page reload
        setIsLoading(true); // 3. Turn loading ON

        try {
            const response = await axios.post("/api/auth/forgot-password", { email });

            toast.success(response.data.message);

            navigate("/forgot-verify-otp", {
                state: { email },
            });
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false); // 4. Turn loading OFF no matter what
        }
    };

    return (

        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden flex items-center justify-center px-4 sm:px-6 lg:px-10 py-6">


            {/* Background Glow Effects */}


            <div className="absolute top-10 left-0 sm:left-20 w-52 sm:w-72 lg:w-96 h-52 sm:h-72 lg:h-96 bg-blue-500 opacity-20 blur-3xl rounded-full"></div>

            <div className="absolute bottom-10 right-0 sm:right-20 w-52 sm:w-72 lg:w-96 h-52 sm:h-72 lg:h-96 bg-purple-500 opacity-20 blur-3xl rounded-full"></div>


            {/* ========================== */}
            {/* Forgot Password Card */}
            {/* ========================== */}

            <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 p-6 sm:p-8 lg:p-10 rounded-3xl w-full max-w-md z-10">

                {/* Header */}

                <h1 className="text-white text-2xl sm:text-3xl font-bold mb-3">

                    Forgot Password 🔐

                </h1>

                <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed">

                    Enter your email address to receive a 6-digit OTP.

                </p>


                {/* ========================== */}
                {/* Form */}
                {/* ========================== */}

                <form
                    onSubmit={handleSendOTP}
                    className="space-y-5 sm:space-y-6"
                >

                    <input
                        type="email"
                        required
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 sm:p-4 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:border-blue-500 text-sm sm:text-base"
                    />


                    {/* ========================== */}
                    {/* Send OTP Button */}
                    {/* ========================== */}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`
    
    w-full
    h-12 sm:h-14
    rounded-xl
    flex
    justify-center
    items-center
    font-semibold
    transition-all
    duration-300

    ${isLoading

                                ? "bg-blue-800 cursor-not-allowed opacity-80"

                                : "bg-blue-600 hover:scale-[1.02] text-white"

                            }
    
    `}
                    >

                        {isLoading ? (

                            <div className="flex gap-1.5 items-center justify-center">

                                <div
                                    className="w-2.5 h-2.5 bg-white rounded-full animate-bounce"
                                    style={{ animationDelay: "0ms" }}
                                ></div>

                                <div
                                    className="w-2.5 h-2.5 bg-white rounded-full animate-bounce"
                                    style={{ animationDelay: "150ms" }}
                                ></div>

                                <div
                                    className="w-2.5 h-2.5 bg-white rounded-full animate-bounce"
                                    style={{ animationDelay: "300ms" }}
                                ></div>

                            </div>

                        ) : (

                            "Send OTP"

                        )}

                    </button>


                    {/* ========================== */}
                    {/* Back To Login */}
                    {/* ========================== */}

                    <div className="text-center pt-2">

                        <Link
                            to="/login"
                            className="text-gray-400 hover:text-blue-400 transition text-sm"
                        >

                            ← Wait, I remember my password

                        </Link>

                    </div>

                </form>

            </div>

        </div>

    );
}

export default ForgotPassword;