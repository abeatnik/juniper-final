import React, { useEffect, useState } from "react";
import { User } from "@prisma/client";

const UserIcon: React.FC<{ userId: string | null }> = ({ userId }) => {
    const [userData, setUserData] = useState<User | null>(null);

    useEffect(() => {
        getUserInfo();
    }, []);

    const getUserInfo = async () => {
        try {
            const data = await fetch(`/api/user/${userId}`);
            const info = await data.json();
            setUserData(info);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        userData && (
            <button className="user-info">
                <div className="member-pic">
                    <img
                        src={userData.image || undefined}
                        alt={userData.name || undefined}
                    />
                </div>
                <p>{userData.name}</p>
            </button>
        )
    );
};

export default UserIcon;
