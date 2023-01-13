import { Stack, Card } from "@prisma/client";
import CardsComponent from "./CardsComponent";
import CreateCard from "./CreateCard";
import { useState, useEffect } from "react";

interface SingleStackProps {
    stack: (Stack & { cards: Card[] }) | null;
    updateStacks: (
        cardId: string | undefined,
        oldStackId: string | undefined,
        newStackId: string | undefined
    ) => void;
    addNewCard: (card: Card) => void;
    updateCard: (card: Card) => void;
}

const SingleStackComponent: React.FC<SingleStackProps> = ({
    stack,
    updateStacks,
    addNewCard,
    updateCard,
}) => {
    const [stackCards, setStackCards] = useState<Card[]>([]);
    const [editable, setEditable] = useState(false);
    const [title, setTitle] = useState("");

    useEffect(() => {
        stack && setStackCards(stack.cards);
    });

    useEffect(() => {
        stack && setTitle(stack.title);
    }, []);

    const deleteCard = (cardId: string) => {
        stackCards &&
            setStackCards(stackCards.filter((card) => card.id !== cardId));
    };

    const handleEdit = (
        e:
            | React.MouseEvent<HTMLDivElement>
            | React.MouseEvent<HTMLHeadingElement>
    ) => {
        if (e.detail < 2) {
            return;
        }
        setEditable(true);
    };

    const handleEditSubmit = async (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key !== "Enter") {
            return;
        }
        const data = await fetch("/api/update/stack-info", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, stackId: stack && stack.id }),
        });
        const newStack = await data.json();
        ///update stack here..
        setEditable(false);
    };

    return (
        <div className="stack">
            {!editable && (
                <h2 onClick={handleEdit}>{title || (stack && stack.title)}</h2>
            )}
            {editable && (
                <>
                    <input
                        name="stackTitle"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={handleEditSubmit}
                    />
                    <button
                        className="nav-button"
                        onClick={() => {
                            setEditable(false);
                            setTitle((stack && stack.title) || "");
                        }}
                    >
                        Cancel
                    </button>
                </>
            )}
            <CardsComponent
                cards={stackCards}
                stackName={stack && stack.title}
                stackId={stack && stack.id}
                deleteCard={deleteCard}
                updateStacks={updateStacks}
                updateCard={updateCard}
            />
            <CreateCard addNewCard={addNewCard} stackId={stack && stack.id} />
        </div>
    );
};

export default SingleStackComponent;
