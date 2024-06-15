import { signInWithEmailAndPassword } from "firebase/auth";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { auth } from "../../lib/firebase";

const Login = () => {
    const [loading, setLoading] = useState(false);
    
    const submitLoginForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const { email, password } = Object.fromEntries(formData);
        try {
            await signInWithEmailAndPassword(auth, email as string, password as string);
            toast.success('Successfully Sign In');
            console.log('Successfully logged in');
        } catch (error) {
            console.log(error);
            if (error instanceof Error)
                toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex-1 flex items-center justify-center">
            <form
                className="w-96 flex flex-col items-center justify-between gap-4"
                onSubmit={submitLoginForm}
                autoComplete="off"
            >
                <h2 className="text-3xl font-bold mb-1">Welcome Back!</h2>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="auth-input"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="auth-input"
                    required
                />
                <button
                    type="submit"
                    className={`auth-submit-btn ${
                        loading &&
                        "disabled:opacity-75 disabled:cursor-not-allowed"
                    }`}
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Sign In"}
                </button>
            </form>
        </section>
    );
};

export default Login;
