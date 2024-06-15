import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { CurrentUser } from "../../types/CurrentUser";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUserData = createAsyncThunk(
    "auth/fetchData",
    async function (uid: string) {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
          console.log("-> Users data by uid:", docSnap.data());
          return { uid, ...docSnap.data() } as CurrentUser;
      } else {
          console.log("-> No such `users` document!");
          return null;
      }
    }
);
