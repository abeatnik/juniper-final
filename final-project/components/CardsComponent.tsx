import { Stack, Card } from "@prisma/client";
import { useState } from "react";
import DeleteCard from "./DeleteCard";
import SingleCard from "./SingleCard";
import { Droppable, Draggable } from "react-beautiful-dnd";

interface CardProps {
    cards: Card[] | [];
    stackName: string | null;
    deleteCard: (cardId: string) => void;
    addNewCard: (card: Card) => void;
    updateStacks: (
        cardId: string | undefined,
        oldStackId: string | undefined,
        newStackId: string | undefined
    ) => void;
}

const CardsComponent: React.FC<CardProps> = (props: CardProps) => {
    const showCards =
        props.cards &&
        props.cards.map((card, index) => {
            return (
                <li key={card.id}>
                    <SingleCard
                        card={card}
                        stackName={props.stackName}
                        deleteCard={props.deleteCard}
                        updateStacks={props.updateStacks}
                    />
                </li>
            );
        });

    return (
        <>
            {/* <Droppable droppableId={"stack-field"}>
                {(provided) => ( */}
            <ul
                className={"stacklist " + props.stackName || ""}
                // {...provided.droppableProps}
                // ref={provided.innerRef}
            >
                {showCards}
            </ul>
            {/* )}
            </Droppable> */}
        </>
    );
};

export default CardsComponent;
