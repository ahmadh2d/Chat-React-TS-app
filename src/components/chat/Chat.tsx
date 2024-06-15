import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import {
    arrayUnion,
    doc,
    getDoc,
    onSnapshot,
    updateDoc,
} from "firebase/firestore";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { db } from "../../lib/firebase";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Chat as ChatType } from "../../types/Chat";
import { UserChat } from "../../types/UserChat";
import { convertTimestampToTimeAgo } from "../../utils/helper";
import { ImageInfo } from "../../types/ImageInfo";
import { uploadFile } from "../../lib/upload";

const Chat = () => {
    const [text, setText] = useState("");
    const [img, setImg] = useState<ImageInfo>({
        file: null,
        url: "",
    });
    const [openEmoji, setOpenEmoji] = useState(false);
    const endRef = useRef<HTMLDivElement>(null);
    const [chat, setChat] = useState<ChatType | null>(null);

    const {
        auth: { currentUser },
        chat: { chatId, receiverUser, isReceiverBlocked },
    } = useSelector((state: RootState) => state);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    function handleEmojiClick(emoji: EmojiClickData): void {
        setText((prev) => prev + emoji.emoji);
    }

    useEffect(() => {
        const unSub = onSnapshot(
            doc(db, "chats", chatId || ""),
            async (res) => {
                console.log("-> Current Chat Data", res.data());
                setChat(res.data() as ChatType);
            }
        );

        return () => unSub();
    }, [chatId]);

    async function handleSendMessage(): Promise<void> {
        let imageUrl;
        if (img?.file) {
            imageUrl = await uploadFile(img.file);
        }

        await updateDoc(doc(db, "chats", chatId || ""), {
            messages: arrayUnion({
                senderId: currentUser?.id,
                text: text,
                chatId: chatId,
                createdAt: Date.now(),
                ...(imageUrl ? { image: imageUrl } : {})
            })
        });

        const userIds = [currentUser?.id, receiverUser?.id];

        userIds.forEach(async (userId) => {
            const userChatRef = doc(db, "user_chats", userId || "");
            const userChatSnapshot = await getDoc(userChatRef);
            const userChats = userChatSnapshot.data() as UserChat;

            const userChatIndex = userChats.chats?.findIndex(
                (i) => i.chatId === chatId
            );

            const currentUserChat = userChats.chats[userChatIndex];

            currentUserChat.isSeen = userId === currentUser?.id ? true : false;
            currentUserChat.updatedAt = Date.now();
            currentUserChat.lastMessage = text;
            await updateDoc(userChatRef, {
                chats: userChats.chats,
            });
        });

        setImg({
            file: null,
            url: ''
        });
    }

    function handleImgUpload(e: ChangeEvent<HTMLInputElement>): void {
        if (e.target?.files && e.target.files.length) {
            setImg({
                url: URL.createObjectURL(e.target.files[0]),
                file: e.target.files[0],
            });
        }
    }

    const renderChatMessages = chat?.messages.map((message) => {
        if (message.senderId === receiverUser?.id) {
            return (
                <div
                    key={message.createdAt}
                    className="flex items-start justify-between gap-3 max-w-lg"
                >
                    <div className="flex flex-col gap-1 items-start">
                        {message.image && (
                            <img
                                src={message.image}
                                alt="Image"
                                className="object-cover rounded-lg"
                            />
                        )}
                        <p className="bg-gray-700/50 rounded-lg p-3">
                            {message.text}
                        </p>
                        <span className="text-sm">
                            {convertTimestampToTimeAgo(message.createdAt)}
                        </span>
                    </div>
                </div>
            );
        } else if (message.senderId === currentUser?.id) {
            return (
                <div
                    key={message.createdAt}
                    className="flex items-start justify-between gap-3 max-w-lg self-end"
                >
                    <div className="flex flex-col gap-1 items-end">
                        {message.image && (
                            <img
                                src={message.image}
                                alt="Image"
                                className="object-cover rounded-lg"
                            />
                        )}
                        <p className="bg-blue-500 rounded-lg p-3">
                            {message.text}
                        </p>
                        <span className="text-sm">
                            {convertTimestampToTimeAgo(message.createdAt)}
                        </span>
                    </div>
                </div>
            );
        }
    });

    return (
        <div className="flex-[2] border-l-gray-300/35 border-l relative">
            <div className="flex flex-col justify-between h-full">
                <header className="flex flex-row justify-between items-center py-5 px-3 border-b-gray-300/35 border-b">
                    <div className="flex items-start gap-4">
                        <img
                            src={(isReceiverBlocked ? "./avatar.png" : receiverUser?.avatar || "./avatar.png")}
                            alt="avatar"
                            className="w-14 h-14 rounded-full object-cover mt-0"
                        />
                        <div className="flex flex-col justify-center">
                            <strong className="font-semibold text-lg">
                                {!isReceiverBlocked ? receiverUser?.username : '-'}
                            </strong>
                            <p className="text-sm text-gray-400">
                                Lorem ipsum dolor, sit amot.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-5">
                        <button>
                            <img
                                src="./phone.png"
                                alt="phone icon"
                                className="object-cover w-5 h-5"
                            />
                        </button>
                        <button>
                            <img
                                src="./video.png"
                                alt="video icon"
                                className="object-cover w-5 h-5"
                            />
                        </button>
                        <button>
                            <img
                                src="./info.png"
                                alt="Info icon"
                                className="object-cover w-5 h-5"
                            />
                        </button>
                    </div>
                </header>
                <main className="flex-1 overflow-y-hidden hover:overflow-y-auto">
                    <div className="flex flex-col justify-between pl-2 py-2 pr-1 gap-5">
                        {renderChatMessages}
                        {img?.url && (
                            <div className="flex items-start justify-between gap-3 max-w-lg self-end">
                                <img src={img?.url} alt="Image"
                                    className="object-cover rounded-lg" />
                            </div>
                        )}
                        <div ref={endRef}></div>
                    </div>
                </main>
                <footer className="flex flex-row justify-between gap-3 px-3 mt-auto border-t-gray-300/35 border-t py-4">
                    <div className="flex flex-row items-center justify-between gap-4">
                        <label htmlFor="file" className="cursor-pointer">
                            <img
                                src="img.png"
                                alt="image icon"
                                className="w-5 h-5 object-cover"
                            />
                        </label>
                        <input
                            type="file"
                            name="file"
                            id="file"
                            className="hidden"
                            onChange={handleImgUpload}
                        />
                        <button>
                            <img
                                src="camera.png"
                                alt="camera icon"
                                className="w-5 h-5 object-cover"
                            />
                        </button>
                        <button>
                            <img
                                src="mic.png"
                                alt="mic icon"
                                className="w-5 h-5 object-cover"
                            />
                        </button>
                    </div>
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={text}
                        onChange={(e) => setText(e.currentTarget.value)}
                        className="flex-[1] border-none outline-none bg-gray-700/60 py-3 px-2 text-base text-white rounded-lg"
                    />
                    <div className="flex items-center justify-between gap-3">
                        <button onClick={() => setOpenEmoji((prev) => !prev)}>
                            <img
                                src="./emoji.png"
                                alt="Emoji icon"
                                className="w-5 h-5 object-cover"
                            />
                        </button>
                        <div className="absolute bottom-[70px] right-[10px]">
                            <EmojiPicker
                                open={openEmoji}
                                theme={Theme.AUTO}
                                onEmojiClick={handleEmojiClick}
                            />
                        </div>
                        <button
                            type="button"
                            className="bg-blue-500 rounded-[4px] px-3 py-2 text-base disabled:cursor-not-allowed disabled:bg-blue-500/40"
                            disabled={isReceiverBlocked}
                            onClick={handleSendMessage}
                        >
                            Send
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Chat;
