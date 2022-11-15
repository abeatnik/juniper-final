import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import { isDragActive } from "framer-motion";

const LoginLogout: React.FC = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const isActive: (pathname: string) => boolean = (pathname) =>
        router.pathname === pathname;
    let right;
    if (!session) {
        return <button onClick={() => signIn()}>Login</button>;
    } else {
        return (
            <button>
                <Link
                    href="/"
                    onClick={() => {
                        setTimeout(() => {
                            router.push("/");
                            signOut();
                        }, 100);
                    }}
                >
                    Logout
                </Link>
            </button>
        );
    }
};

export default LoginLogout;
