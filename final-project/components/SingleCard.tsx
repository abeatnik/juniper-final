import { Card, User } from "@prisma/client";
import CardView from "./CardView";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface SingleCardProps {
    card: Card;
    deleteCard: (cardId: string) => void;
    stackName: string | null;
    updateStacks: (
        cardId: string | undefined,
        oldStackId: string | undefined,
        newStackId: string | undefined
    ) => void;
    updateCard: (card: Card) => void;
}

const SingleCard: React.FC<SingleCardProps> = ({
    card,
    stackName,
    deleteCard,
    updateStacks,
    updateCard,
}) => {
    const [showCard, setShowCard] = useState(false);
    const { data: session, status } = useSession();
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const toggleCard = () => {
        setShowCard(!showCard);
    };

    useEffect(() => {
        session?.user && getUserInfo(session?.user.email);
    }, [session]);

    const getUserInfo = async (email: string | null | undefined) => {
        try {
            const data = await fetch(`/api/user/email/${email}`);
            const result = await data.json();
            result && setUserInfo(result);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className="card" onClick={toggleCard}>
                <h4>{card.title}</h4>
                {userInfo && userInfo.id === card.userId ? (
                    <div className="user-icon">
                        <div className="member-pic">
                            <img
                                src={userInfo.image || undefined}
                                alt={userInfo.name || undefined}
                            />
                        </div>
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
            {showCard && (
                <CardView
                    updateCard={updateCard}
                    card={card}
                    toggleCard={toggleCard}
                    stackName={stackName}
                    deleteCard={deleteCard}
                    updateStacks={updateStacks}
                />
            )}
        </>
    );
};

export default SingleCard;
