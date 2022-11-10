import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
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
                <Link href="api/auth/signin">Login</Link>
            </div>
        );
    } else {
        right = <p>you are now signed in</p>;
    }

    return <nav>{right}</nav>;
};

export default Header;
