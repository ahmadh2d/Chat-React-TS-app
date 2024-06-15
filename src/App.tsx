import "./App.css";
import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import List from "./components/list/List";
import Auth from "./components/auths/Auth";
import Notification from "./components/notification/Notification";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useThunk } from "./hooks/useThunk";
import { fetchUserData } from "./store/thunks/fetchUserData";

function App() {
    const [doFetchUserData, isUserLoading] = useThunk(fetchUserData);

    const {
        auth: { currentUser: authCurrentUser },
        chat: { chatId },
    } = useSelector((state: RootState) => state);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log("-> User detected", user);
            doFetchUserData(user?.uid);
        });

        return () => unsubscribe();
    }, [doFetchUserData]);

    const chatPage = (
        <section className="flex flex-row w-full">
            <List />
            {chatId && (
                <>
                    <Chat />
                    <Detail />
                </>
            )}
        </section>
    );

    return (
        <div className='bg-[url("./bg.jpg")] bg-center w-screen h-screen pt-10 text-white'>
            <main className="mx-auto w-11/12 h-[90vh] bg-blue-950/60 backdrop-blur rounded-md flex">
                {isUserLoading ? (
                    <div className="m-auto text-4xl p-10 bg-blue-950/60 rounded-lg">
                        Loading...
                    </div>
                ) : authCurrentUser ? (
                    chatPage
                ) : (
                    <Auth />
                )}
            </main>
            <Notification />
        </div>
    );
}

export default App;
