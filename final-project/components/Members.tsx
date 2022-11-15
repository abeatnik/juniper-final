import React, { useEffect, useState } from "react";
import { Board, User } from "@prisma/client";

const Members: React.FC<{ boardId: string }> = ({ boardId }) => {
    const [members, setMembers] = useState<User[] | null>(null);
    const [hidden, setHidden] = useState(true);

    useEffect(() => {
        getMembers();
    }, []);

    const getMembers = async () => {
        const data = await fetch(`/api/members/${boardId}`);
        const result = await data.json();
        const boardMembers: User[] = result && result.users;
        setMembers(boardMembers);
    };

    const showMembers =
        members &&
        members.map((user) => {
            return (
                <li key={user.id}>
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
                Members
            </button>
            {!hidden && (
                <div className="nav-popup">
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

export default Members;
