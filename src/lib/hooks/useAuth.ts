import { useEffect, useState } from "react";
import { auth } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

interface UserData {
  email: string;
  name: string;
  role: string;
}

export function useAuth() {
  const [loggedUser, setLoggedUser] = useState<UserData | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, "/users", firebaseUser.email!);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setLoggedUser(userDoc.data() as UserData);
          } else {
            setLoggedUser(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setLoggedUser(null);
        }
      } else {
        setLoggedUser(null);
      }
      setUserLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { loggedUser, userLoading };
}