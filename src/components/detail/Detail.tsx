import { useSelector } from "react-redux";
import { auth, db } from "../../lib/firebase";
import { RootState } from "../../store";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";

const Detail = () => {
    const {receiverUser, isReceiverBlocked} = useSelector((state: RootState) => {
        return state.chat;
    });
    const currentUser = useSelector((state: RootState) => {
        return state.auth.currentUser;
    });

    async function handleBlockUser(): Promise<void> {
        const userRef = doc(db, 'users', currentUser?.id || '');

        await updateDoc(userRef, {
            blocked: arrayUnion(receiverUser?.id)
        })
    }

    return (
        <div className="flex-[1] flex flex-col gap-5 border-l-gray-300/35 border-l pt-6">
            <header className="flex flex-col justify-between gap-1 items-center border-b border-b-gray-300/35 pb-7">
                <img
                    src={isReceiverBlocked ? "./avatar.png" : receiverUser?.avatar || "./avatar.png"}
                    alt="Profile photo"
                    className="w-20 h-20 rounded-full object-cover mb-1"
                />
                <strong className="text-xl font-bold">{!isReceiverBlocked && receiverUser?.username}</strong>
                <p className="text-base">Lorem ipsum dolor sit, amet.</p>
            </header>
            <main className="flex flex-col justify-between gap-6 px-4 mb-5">
                <div className="flex justify-between items-center">
                    <span className="text-lg">Chat Settings</span>
                    <button
                        type="button"
                        className="w-6 h-6 bg-slate-600/50 p-1.5 rounded-full"
                    >
                        <img src="./arrowUp.png" alt="Arrow up icon" />
                    </button>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-lg">Privacy & Help</span>
                    <button
                        type="button"
                        className="w-6 h-6 bg-slate-600/50 p-1.5 rounded-full"
                    >
                        <img src="./arrowUp.png" alt="Arrow up icon" />
                    </button>
                </div>
                <div className="flex flex-col justify-between gap-3">
                    <div className="flex justify-between items-center">
                        <span className="text-lg">Shared photos</span>
                        <button
                            type="button"
                            className="w-6 h-6 bg-slate-600/50 p-1.5 rounded-full"
                        >
                            <img src="./arrowDown.png" alt="Arrow down icon" />
                        </button>
                    </div>
                    <div className="flex flex-col justify-between gap-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <img
                                    className="w-8 h-8 object-cover rounded-md"
                                    src="https://images.pexels.com/photos/18781953/pexels-photo-18781953/free-photo-of-landscape-of-dolomites.jpeg?auto=compress&cs=tinysrgb&w=600&h=426&dpr=2"
                                    alt="mountains"
                                />
                                <span className="text-sm">
                                    photos_2024_2.png
                                </span>
                            </div>
                            <button
                                type="button"
                                className="w-6 h-6 p-1.5 rounded-full bg-slate-600/50"
                            >
                                <img src="./download.png" alt="download icon" />
                            </button>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <img
                                    className="w-8 h-8 object-cover rounded-md"
                                    src="https://images.pexels.com/photos/18781953/pexels-photo-18781953/free-photo-of-landscape-of-dolomites.jpeg?auto=compress&cs=tinysrgb&w=600&h=426&dpr=2"
                                    alt="mountains"
                                />
                                <span className="text-sm">
                                    photos_2024_2.png
                                </span>
                            </div>
                            <button
                                type="button"
                                className="w-6 h-6 p-1.5 rounded-full bg-slate-600/50"
                            >
                                <img src="./download.png" alt="download icon" />
                            </button>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <img
                                    className="w-8 h-8 object-cover rounded-md"
                                    src="https://images.pexels.com/photos/18781953/pexels-photo-18781953/free-photo-of-landscape-of-dolomites.jpeg?auto=compress&cs=tinysrgb&w=600&h=426&dpr=2"
                                    alt="mountains"
                                />
                                <span className="text-sm">
                                    photos_2024_2.png
                                </span>
                            </div>
                            <button
                                type="button"
                                className="w-6 h-6 p-1.5 rounded-full bg-slate-600/50"
                            >
                                <img src="./download.png" alt="download icon" />
                            </button>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <img
                                    className="w-8 h-8 object-cover rounded-md"
                                    src="https://images.pexels.com/photos/18781953/pexels-photo-18781953/free-photo-of-landscape-of-dolomites.jpeg?auto=compress&cs=tinysrgb&w=600&h=426&dpr=2"
                                    alt="mountains"
                                />
                                <span className="text-sm">
                                    photos_2024_2.png
                                </span>
                            </div>
                            <button
                                type="button"
                                className="w-6 h-6 p-1.5 rounded-full bg-slate-600/50"
                            >
                                <img src="./download.png" alt="download icon" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-between gap-3">
                    <div className="flex justify-between items-center">
                        <span className="text-lg">Shared Files</span>
                        <button
                            type="button"
                            className="w-6 h-6 bg-slate-600/50 p-1.5 rounded-full"
                        >
                            <img src="./arrowUp.png" alt="Arrow up icon" />
                        </button>
                    </div>
                </div>
            </main>
            <footer className="flex flex-col justify-between items-stretch px-3 gap-6">
                <button className="bg-red-900/50 rounded-md py-2 hover:bg-red-800/80" onClick={handleBlockUser}>
                    {isReceiverBlocked ? 'Unblock User' : 'Block User'}
                </button>
                <button className="bg-blue-600/50 rounded-md py-2 hover:bg-blue-600/80" onClick={() => auth.signOut()}>
                    Logout
                </button>
            </footer>
        </div>
    );
};

export default Detail;
