import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { FormEvent, useState } from "react";
import { db } from "../../lib/firebase";
import type { CurrentUser } from "../../types/CurrentUser";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const AddUser = () => {
    const [foundUser, setFoundUser] = useState<CurrentUser | null>(null);
    const currentUser = useSelector(
      (state: RootState) => state.auth.currentUser
  );

    async function handleSearch(
        event: FormEvent<HTMLFormElement>
    ): Promise<void> {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const { username } = Object.fromEntries(formData);

        try {
          const q = query(
              collection(db, "users"),
              where("username", "==", username)
          );
  
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
              const userFound: CurrentUser =
                  querySnapshot.docs[0].data() as CurrentUser;
              setFoundUser(userFound);
          } else {
              setFoundUser(null);
          }
        } catch (error: unknown) {
          console.error('-> Error: ' + (error as Error).message);
        }
    }

    async function handleAddUser(): Promise<void> {
      try {
        const userChatRef = collection(db, 'user_chats');
        const chatsRef = collection(db, 'chats');

        const newChatRef = doc(chatsRef);
        await setDoc(newChatRef, {
          createdAt: serverTimestamp(),
          messages: []
        });

        await setDoc(doc(userChatRef, currentUser?.id), {
          chats: arrayUnion({
            chatId: newChatRef.id,
            receiverId: foundUser?.id,
            lastMessage: '',
            updatedAt: Date.now()
          })
        }, {merge: true});

        await setDoc(doc(userChatRef, foundUser?.id), {
          chats: arrayUnion({
            chatId: newChatRef.id,
            receiverId: currentUser?.id,
            lastMessage: '',
            updatedAt: Date.now()
          })
        }, {merge: true});
      } catch (error: unknown) {
        console.error('-> Error: ' + (error as Error).message);
      }
    }

    return (
        <div className="flex flex-col p-7 justify-between gap-16 absolute m-auto top-0 left-0 bottom-0 right-0 w-max h-max bg-gray-800/70 rounded-lg z-10">
            <form
                className="flex items-center justify-between gap-3"
                onSubmit={handleSearch}
            >
                <input
                    type="text"
                    placeholder="Username"
                    name="username"
                    className="px-3 py-4 border-none outline-none text-black rounded-lg"
                />
                <button type="submit" className="bg-blue-500 p-4 rounded-lg">
                    Search
                </button>
            </form>
            {foundUser && (
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <img
                            src={foundUser?.avatar || "./avatar.png"}
                            alt="Profile photo"
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <strong className="text-sm">
                            {foundUser?.username}
                        </strong>
                    </div>
                    <button
                        type="button"
                        className="rounded-lg bg-blue-500 py-1 px-2"
                        onClick={handleAddUser}
                    >
                        Add User
                    </button>
                </div>
            )}
        </div>
    );
};

export default AddUser;
