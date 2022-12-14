import React from "react";
import Link from "next/link";
import { useState } from "react";

const HomeButton: React.FC<{
    email: string | null | undefined;
    name: string | null | undefined;
}> = ({ email, name }) => {
    const [content, setContent] = useState(name);

    return (
        <button id="home-button">
            <Link
                href="/"
                onMouseEnter={() => {
                    setContent(email);
                }}
                onMouseLeave={() => {
                    setContent(name);
                }}
            >
                {content || name}
            </Link>
        </button>
    );
};

export default HomeButton;
