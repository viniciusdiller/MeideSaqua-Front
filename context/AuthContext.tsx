"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

interface User {
  usuarioId: number;
  nomeCompleto: string;
  username: string;
  email: string;
  token?: string;
  chosenAvatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (loginData: { user: User; token: string }) => void;
  logout: () => void;
  isLoading: boolean;
  updateUser: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error(
        "Falha ao carregar dados do usuário do localStorage",
        error
      );
      localStorage.removeItem("user");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (loginData: { user: User; token: string }) => {
    //  objeto completo do usuário é salvo, incluindo o token
    const userDataWithToken = { ...loginData.user, token: loginData.token };
    setUser(userDataWithToken);
    localStorage.setItem("user", JSON.stringify(userDataWithToken));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  //  Nova função para atualizar o usuário
  const updateUser = (updatedData: Partial<User>) => {
    setUser((currentUser) => {
      if (currentUser) {
        const newUser = { ...currentUser, ...updatedData };
        localStorage.setItem("user", JSON.stringify(newUser));
        return newUser;
      }
      return null;
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isLoading, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
