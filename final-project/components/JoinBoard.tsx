import React, { FormEvent, useState } from "react";
import { Board } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";

const JoinBoard = () => {
    const [showPopup, setShopPopup] = useState(false);
    const [code, setCode] = useState("");
    const [approved, setApproved] = useState(false);
    const [url, setUrl] = useState("");
    const [boardName, setBoardName] = useState("");
    const { data: session, status } = useSession();
    const userEmail = session?.user?.email;

    const togglePopup = () => {
        setShopPopup(!showPopup);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/join-board", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail, inviteId: code }),
            });
            const joinedBoard: Board | null = await res.json();
            if (joinedBoard) {
                setUrl(`/board/${joinedBoard.id}`);
                setBoardName(joinedBoard.title);
                setApproved(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <button onClick={togglePopup}>Join Board</button>
            {showPopup && (
                <div className="nav-popup">
                    {!approved && (
                        <form onSubmit={handleSubmit}>
                            <p>insert invite code: </p>
                            <input
                                type="text"
                                onChange={(e) => {
                                    setCode(e.target.value);
                                }}
                            />
                            <button type="submit">join board</button>
                        </form>
                    )}
                    {approved && (
                        <p>
                            Success!You are now a member of{" "}
                            <Link href={url}>{boardName}</Link>
                        </p>
                    )}
                    <button className="nav-button" onClick={togglePopup}>
                        x
                    </button>
                </div>
            )}
        </>
    );
};

export default JoinBoard;
