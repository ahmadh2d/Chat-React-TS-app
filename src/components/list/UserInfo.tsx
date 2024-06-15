import React, { useState } from "react";
import AddUser from "./AddUser";
import { RootState } from "../../store";
import { useSelector } from "react-redux";

const UserInfo = () => {
    const [addMode, setAddMode] = useState(false);
    const currentUser = useSelector(
        (state: RootState) => state.auth.currentUser
    );

    return (
        <div className="px-5 flex flex-col gap-10">
            <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-3">
                    <img
                        src={currentUser?.avatar || "./avatar.png"}
                        alt="avatar"
                        className="rounded-full w-11 h-11 object-cover"
                    />
                    <h2 className="text-lg font-semibold">{currentUser?.username}</h2>
                </div>
                <div className="flex flex-row items-center gap-3">
                    <button>
                        <img src="./more.png" className="w-5" alt="more" />
                    </button>
                    <button>
                        <img src="./video.png" className="w-5" alt="video" />
                    </button>
                    <button>
                        <img src="./edit.png" className="w-5" alt="edit" />
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex flex-row items-center bg-gray-500/50 flex-1 rounded-md px-3">
                    <img
                        src="./search.png"
                        alt="search"
                        className="w-5 h-5 mr-3"
                    />
                    <input
                        type="text"
                        placeholder="Search"
                        className="outline-none border-none bg-transparent py-1 flex-1"
                    />
                </div>
                <button
                    className="bg-gray-500/50 h-8 w-8 p-2 rounded-lg"
                    onClick={() => setAddMode(!addMode)}
                >
                    <img
                        src={addMode ? "minus.png" : "plus.png"}
                        alt="expand"
                    />
                </button>
            </div>
            {addMode && <AddUser />}
        </div>
    );
};

export default UserInfo;
