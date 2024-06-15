
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { CurrentUser } from "../types/CurrentUser";

export const fetchUserData = async function(uid: string) {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("-> Users data by uid:", docSnap.data());
            return { data: { uid, ...docSnap.data() } as CurrentUser };
        } else {
            console.log("-> No such `users` document!");
            return { data: null };
        }
    } catch (error: unknown) {
        console.error(`Error in getting 'users' doc: ${(error as Error).message}`);
        return { error: (error as Error).message };
    }
}