import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";

const LoginLogout: React.FC = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const isActive: (pathname: string) => boolean = (pathname) =>
        router.pathname === pathname;
    let right;
    if (!session) {
        return (
            <button id="login-button" onClick={() => signIn()}>
                Login
            </button>
        );
    } else {
        return (
            <button id="logout-button">
                <Link
                    href="/"
                    onClick={() => {
                        router.push("/");
                        setTimeout(() => signOut(), 100);
                    }}
                >
                    Logout
                </Link>
            </button>
        );
    }
};

export default LoginLogout;
