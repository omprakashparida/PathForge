import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";

function VerifyOTP() {
    const [otp, setOTP] = useState("");

    // Added dual loading states
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const handleVerify = async (e) => {
        if (e) e.preventDefault();
        setIsVerifying(true);


        try {
            const response = await axios.post("/api/auth/verify-signup-otp", {
                email,
                otp
            });

            toast.success(response.data.message);
            navigate("/login");

        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid OTP");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        setIsResending(true);



        try {
            const response = await axios.post("/api/auth/resend-otp", {
                email
            });

            toast.success(response.data.message);

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to resend");
        } finally {
            setIsResending(false);
        }
    };

    return (

        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden flex items-center justify-center px-4 sm:px-6 lg:px-10 py-6">

            {/* Background Glow Effects */}

            <div className="absolute top-10 left-0 sm:left-20 w-52 sm:w-72 lg:w-96 h-52 sm:h-72 lg:h-96 bg-blue-500 opacity-20 blur-3xl rounded-full"></div>

            <div className="absolute bottom-10 right-0 sm:right-20 w-52 sm:w-72 lg:w-96 h-52 sm:h-72 lg:h-96 bg-purple-500 opacity-20 blur-3xl rounded-full"></div>


            {/* OTP Card */}

            <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 p-6 sm:p-8 lg:p-10 rounded-3xl w-full max-w-md z-10">

                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">

                    Verify OTP 🚀

                </h1>

                <p className="text-gray-400 mb-6 text-sm sm:text-base leading-relaxed">

                    Enter OTP sent to:

                    <br />

                    <span className="text-blue-400 break-all">

                        {email}

                    </span>

                </p>


                {/* Verify Form */}

                <form
                    onSubmit={handleVerify}
                    className="space-y-5"
                >

                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOTP(e.target.value)}
                        maxLength="6"
                        className="
        w-full
        p-3 sm:p-4
        rounded-xl
        bg-gray-800
        border
        border-gray-700
        text-white
        outline-none
        focus:border-blue-500
        tracking-[0.3em]
        sm:tracking-[0.5em]
        text-center
        text-lg
        sm:text-xl
        font-bold
        "
                    />


                    {/* Verify Button */}

                    <button
                        type="submit"
                        disabled={isVerifying || isResending}
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
        
        ${isVerifying
                                ? "bg-blue-800 cursor-not-allowed opacity-80"
                                : "bg-blue-600 hover:scale-[1.02] text-white"
                            }
        
        `}
                    >

                        {isVerifying ? (

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

                            "Verify OTP"

                        )}

                    </button>

                </form>


                {/* Resend Button */}

                <button
                    type="button"
                    onClick={handleResend}
                    disabled={isVerifying || isResending}
                    className={`
        
        w-full
        h-12 sm:h-14
        mt-4
        rounded-xl
        flex
        justify-center
        items-center
        border
        font-medium
        transition-all
        duration-300
        
        ${isResending
                            ? "bg-gray-800 border-gray-700 cursor-not-allowed opacity-80"
                            : "border-gray-700 text-white hover:border-blue-500 hover:bg-gray-800/50"
                        }
        
        `}
                >

                    {isResending ? (

                        <div className="flex gap-1.5 items-center justify-center">

                            <div
                                className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0ms" }}
                            ></div>

                            <div
                                className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "150ms" }}
                            ></div>

                            <div
                                className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "300ms" }}
                            ></div>

                        </div>

                    ) : (

                        "Resend OTP"

                    )}

                </button>
                <p className="text-xs text-gray-400 text-center mt-3">
                    Didn't receive OTP? Check Spam/Junk folder.
                </p>

            </div>

        </div>

    );
}

export default VerifyOTP;