import { Stack, Card } from "@prisma/client";
import { useState } from "react";
import DeleteCard from "./DeleteCard";
import SingleCard from "./SingleCard";
import { Droppable, Draggable } from "react-beautiful-dnd";

interface CardProps {
    cards: Card[] | [];
    stackName: string | null;
    deleteCard: (cardId: string) => void;
    stackId: string | null;
    updateStacks: (
        cardId: string | undefined,
        oldStackId: string | undefined,
        newStackId: string | undefined
    ) => void;
    updateCard: (card: Card) => void;
}

const CardsComponent: React.FC<CardProps> = (props: CardProps) => {
    return (
        <Droppable droppableId={props.stackId || "droppable"}>
            {(provided) => (
                <>
                    <div
                        className={"stacklist id-" + props.stackId || ""}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {props.cards &&
                            props.cards.map((card, index) => {
                                return (
                                    <Draggable
                                        key={card.id}
                                        draggableId={card.id}
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <SingleCard
                                                    card={card}
                                                    stackName={props.stackName}
                                                    deleteCard={
                                                        props.deleteCard
                                                    }
                                                    updateStacks={
                                                        props.updateStacks
                                                    }
                                                    updateCard={
                                                        props.updateCard
                                                    }
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                );
                            })}
                        {provided.placeholder}
                    </div>
                </>
            )}
        </Droppable>
    );
};

export default CardsComponent;
