import React, { useEffect, useState } from "react";
import { Board, User } from "@prisma/client";
import { useRouter } from "next/router";

const AssignCard: React.FC<{ cardId: string }> = ({ cardId }) => {
    const [members, setMembers] = useState<User[] | null>(null);
    const [hidden, setHidden] = useState(true);
    const router = useRouter();
    const boardId = router.asPath.split("/")[2];

    useEffect(() => {
        getMembers();
    }, []);

    const getMembers = async () => {
        const data = await fetch(`/api/members/${boardId}`);
        const result = await data.json();
        const boardMembers: User[] = result && result.users;
        setMembers(boardMembers);
    };

    const assignUser = (userId: string) => async () => {
        const data = await fetch("/api/update/card-assign", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, cardId }),
        });
        setHidden(true);
    };

    const showMembers =
        members &&
        members.map((user) => {
            return (
                <li key={user.id} onClick={assignUser(user.id)}>
                    <div className="member-pic">
                        <img
                            src={user.image || undefined}
                            alt={user.name || undefined}
                        />
                    </div>
                    <p>{user.name}</p>
                </li>
            );
        });

    return (
        <>
            <button
                id="members-button"
                onClick={() => {
                    setHidden(!hidden);
                }}
            >
                assign person
            </button>
            {!hidden && (
                <div className="move-popup">
                    <button
                        className="nav-button"
                        onClick={() => {
                            setHidden(true);
                        }}
                    >
                        x
                    </button>
                    <ul>{showMembers}</ul>
                </div>
            )}
        </>
    );
};

export default AssignCard;
