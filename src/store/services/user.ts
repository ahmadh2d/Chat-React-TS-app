import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { CurrentUser } from "../../types/CurrentUser";

export const userService = createApi({
    reducerPath: "users",
    baseQuery: fakeBaseQuery(),
    endpoints: (builder) => ({
        observeAuthState: builder.query<CurrentUser | null, void>({
            async queryFn() {
                return new Promise((resolve) => {
                    onAuthStateChanged(auth, async (user) => {
                        if (user) {
                            try {
                                const docRef = doc(db, "users", user.uid);
                                const docSnap = await getDoc(docRef);
                
                                if (docSnap.exists()) {
                                    console.log("-> Users data by uid:", docSnap.data());
                                    resolve({data: {uid: user.uid, ...docSnap.data()} as CurrentUser});
                                } else {
                                    console.log("-> No such `users` document!");
                                    resolve({data: null});
                                }
                            } catch (error: unknown) {
                                console.error(`-> Error in getting 'users' doc: ${(error as Error).message}`);
                                return {error: (error as Error).message}
                            }
                        } else {
                            console.log('-> No data received after login');
                            resolve({ data: null });
                        }
                    });
                });
            },
        }),
        fetchUserDate: builder.query<CurrentUser | null, string>({
            async queryFn(uid) {
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
        })
    }),
});
