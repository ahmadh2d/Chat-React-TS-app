import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { useDispatch, useSelector } from "react-redux";
import { RootState, changeChat } from "../../store";
import type { UChat } from "../../types/UChat";
import { CurrentUser } from "../../types/CurrentUser";

const ChatList = () => {
    const [chats, setChats] = useState<UChat[]>([]);
    const currentUser = useSelector(
        (state: RootState) => state.auth.currentUser
    );
    const dispatch = useDispatch();

    async function handleShowUserChat(chat: UChat): Promise<void> {
        const userChatRef = doc(db, "user_chats", currentUser?.id || "");
        const userChats = chats.map((item) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { receiverUser, ...rest } = item;
            return rest;
        });
        const userChatIndex = userChats?.findIndex(
            (i) => i.chatId === chat.chatId
        );
        const currentUserChat = userChats[userChatIndex];

        currentUserChat.isSeen = true;
        try {
            await updateDoc(userChatRef, {
                chats: userChats,
            });

            dispatch(
                changeChat({
                    chatId: chat.chatId,
                    receiverUser: chat.receiverUser,
                    senderUser: currentUser,
                })
            );
        } catch (error) {
            console.log("-> Error in handle show user chat:", error);
        }
    }

    useEffect(() => {
        const unSub = onSnapshot(
            doc(db, "user_chats", currentUser?.id || ""),
            async (res) => {
                console.log("Current data: ", res.data());
                const userChats: UChat[] = res.data()?.chats;

                if (!userChats) return;

                const promises = userChats.map(async (chat) => {
                    const docRef = doc(db, "users", chat.receiverId);
                    const docSnap = await getDoc(docRef);

                    const user = docSnap.data() as CurrentUser;
                    chat.receiverUser = user;

                    return chat;
                });

                const chatData = await Promise.all(promises);

                setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
            }
        );

        return () => unSub();
    }, [currentUser]);

    const renderChats = chats.map((chat) => (
        <div
            key={chat.chatId}
            className={
                "cursor-pointer flex flex-row items-center px-5 pb-4 pt-2 border-b-gray-300/35 border-b" +
                (!chat.isSeen ? " bg-blue-400" : "")
            }
            onClick={() => handleShowUserChat(chat)}
        >
            <img
                src={chat.receiverUser?.avatar || "./avatar.png"}
                alt="other-user-avatar"
                className="w-10 h-10 rounded-full mr-3 object-cover"
            />
            <div>
                <strong className="text-sm mb-1">
                    {chat.receiverUser?.username}
                </strong>
                <p className="text-xs">{chat.lastMessage}</p>
            </div>
        </div>
    ));

    return <div className="flex flex-col">{renderChats}</div>;
};

export default ChatList;
