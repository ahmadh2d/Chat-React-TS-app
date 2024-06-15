import { createUserWithEmailAndPassword } from "firebase/auth";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { uploadFile } from "../../lib/upload";

interface AvatarType {
    url: string;
    file: File | null;
}

const Register = () => {
    const [avatar, setAvatar] = useState<AvatarType>({
        url: "",
        file: null,
    });

    const [loading, setLoading] = useState(false);

    function handleAvatar(e: ChangeEvent<HTMLInputElement>): void {
        if (e.target?.files && e.target.files.length) {
            setAvatar({
                url: URL.createObjectURL(e.target.files[0]),
                file: e.target.files[0],
            });
        }
    }

    async function handleRegister(
        event: FormEvent<HTMLFormElement>
    ): Promise<void> {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);

        const { email, username, password } = Object.fromEntries(formData);

        try {
            const res = await createUserWithEmailAndPassword(
                auth,
                email as string,
                password as string
            );

            const imageUrl = await uploadFile(avatar.file);

            await setDoc(doc(db, "users", res.user.uid), {
                id: res.user.uid,
                username,
                email,
                avatar: imageUrl,
                blocked: [],
            });

            await setDoc(doc(db, "user_chats", res.user.uid), {
                chats: [],
            });

            toast.success("Account created! You can login now!");
        } catch (error) {
            console.log(error);
            if (error instanceof Error) toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="flex-1 flex flex-col items-center justify-center gap-5">
            <h2 className="text-3xl font-bold">Create an Account</h2>
            <form
                className="w-96 flex flex-col items-center justify-between gap-3"
                autoComplete="off"
                onSubmit={handleRegister}
            >
                <div className="flex items-center justify-between gap-8">
                    <img
                        src={avatar.url || "./avatar.png"}
                        alt="Profile photo"
                        className="w-12 h-12 object-cover rounded-lg opacity-70"
                    />
                    <label
                        htmlFor="profileImage"
                        className="underline cursor-pointer"
                    >
                        Upload an image
                    </label>
                    <input
                        type="file"
                        id="profileImage"
                        name="profileImage"
                        className="hidden"
                        onChange={handleAvatar}
                    />
                </div>
                <input
                    type="text"
                    placeholder="Username"
                    name="username"
                    className="auth-input"
                    required
                />
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
                    {loading ? "Registering..." : "Sign Up"}
                </button>
            </form>
        </section>
    );
};

export default Register;
