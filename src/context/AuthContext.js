"use client";
import { createContext, useContext, useEffect, useState } from "react";
import client from "@/graphql/graphqlClient";
import { ApolloProvider } from "@apollo/client/react"; 
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      <ApolloProvider client={client}>
        {children}
      </ApolloProvider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
