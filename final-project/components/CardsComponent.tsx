import { Stack, Card } from "@prisma/client";
import { useState } from "react";
import DeleteCard from "./DeleteCard";
import SingleCard from "./SingleCard";
import { Droppable, Draggable } from "react-beautiful-dnd";

interface CardProps {
    cards: Card[] | [];
    stackName: string | null;
    deleteCard: (cardId: string) => void;
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
                <>
                    <Draggable
                        key={card.id}
                        draggableId={card.id}
                        index={index}
                    >
                        {(provided) => (
                            <li
                                key={card.id}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                            >
                                <SingleCard
                                    card={card}
                                    stackName={props.stackName}
                                    deleteCard={props.deleteCard}
                                    updateStacks={props.updateStacks}
                                />
                            </li>
                        )}
                    </Draggable>
                </>
            );
        });

    return (
        <>
            <Droppable droppableId={"stack-field"}>
                {(provided) => (
                    <ul
                        className={"stacklist " + props.stackName || ""}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {showCards}
                    </ul>
                )}
            </Droppable>
        </>
    );
};

export default CardsComponent;
