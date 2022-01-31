import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useFirebase } from "../hooks/useFirebase";

type authContextType = {
  user?: object;
  isLoggedIn?: boolean;
  setIsLoggedIn?: Dispatch<SetStateAction<boolean>>;
  setUser?: Dispatch<SetStateAction<{}>>;
};

const authContextDefaultValues = {};

const AuthContext = createContext<authContextType>(authContextDefaultValues);

export function useAuth() {
  return useContext(AuthContext);
}

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const { onAuthStateChanged, auth } = useFirebase();
  const [user, setUser] = useState<{}>({});
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const value = { user, isLoggedIn, setUser, setIsLoggedIn };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user != null) {
        setUser(user);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, [auth, onAuthStateChanged]);

  return (
    <>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </>
  );
}
