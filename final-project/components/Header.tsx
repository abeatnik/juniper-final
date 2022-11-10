import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import { isDragActive } from "framer-motion";

const Header: React.FC = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const isActive: (pathname: string) => boolean = (pathname) =>
        router.pathname === pathname;
    let right;
    if (!session) {
        right = (
            <div className="right">
                <button onClick={() => signIn()}>Login</button>
                {/* <Link href="api/auth/signin">Login</Link> */}
            </div>
        );
    } else {
        right = (
            <div className="right">
                <button onClick={() => signOut()}>Logout</button>
            </div>
        );
    }

    return <nav>{right}</nav>;
};

export default Header;
