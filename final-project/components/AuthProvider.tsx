import React from "react";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

interface AuthProviderProps {
    session: Session;
    children?: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
    children,
    session,
}) => {
    return <SessionProvider session={session}>{children}</SessionProvider>;
};
