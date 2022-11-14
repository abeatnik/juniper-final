import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Stack, Card } from "@prisma/client";

interface MoveCardProps {
    updateStacks: (
        cardId: string | undefined,
        oldStackId: string | undefined,
        newStackId: string | undefined
    ) => void;
    stackName: string | null;
    card: Card | null;
    toggleOptions: () => void;
    toggleCard: () => void;
}

const MoveCard: React.FC<MoveCardProps> = ({
    stackName,
    card,
    updateStacks,
    toggleOptions,
    toggleCard,
}) => {
    const [otherStacks, setOtherStacks] = useState<Stack[] | null>(null);
    const [hidden, setHidden] = useState(true);
    const router = useRouter();
    const boardId = router.asPath.split("/")[2];
    const cardId = card?.id;
    const oldStackId = card?.stackId;

    useEffect(() => {
        getStacks();
    }, []);

    const getStacks = async () => {
        const data = await fetch(`/api/stacks/${boardId}`);
        const result = await data.json();
        const allStacks: Stack[] = result && result.stacks;
        const stacks =
            allStacks && allStacks.filter((stack) => stack.title !== stackName);
        setOtherStacks(stacks);
    };

    const moveCard =
        (stackId: string) => async (e: React.MouseEvent<HTMLButtonElement>) => {
            const update = await fetch("/api/update/card", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ stackId, cardId }),
            });
            const res = await update.json();
            setHidden(true);
            toggleOptions();
            toggleCard();
            updateStacks(cardId, oldStackId, stackId);
        };

    const showStacks =
        otherStacks &&
        otherStacks.map((stack) => {
            return (
                <li key={stack.id}>
                    <button onClick={moveCard(stack.id)}>{stack.title}</button>
                </li>
            );
        });

    return (
        <>
            <button onClick={() => setHidden(!hidden)}>move card</button>
            {!hidden && (
                <div className="popup">
                    <button onClick={() => setHidden(true)}>x</button>
                    {showStacks}
                </div>
            )}
        </>
    );
};

export default MoveCard;
