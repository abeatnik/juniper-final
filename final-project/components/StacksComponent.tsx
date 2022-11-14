import { Stack, Card } from "@prisma/client";
import CreateStack from "./CreateStack";
import SingleStackComponent from "./SingleStack";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useRouter } from "next/router";

interface StackProps {
    stackData: (Stack & { cards: Card[] })[] | null;
    boardId: string | null;
}

const StacksComponent: React.FC<StackProps> = (props: StackProps) => {
    const router = useRouter();
    const [allStacks, setAllStacks] = useState<
        (Stack & { cards: Card[] })[] | null
    >(null);
    const [showStacks, setShowStacks] = useState<JSX.Element[] | null>(null);

    useEffect(() => {
        props.stackData && setAllStacks(props.stackData);
    }, []);

    useEffect(() => {
        renderStacks();
    }, [allStacks]);

    const addNewStack = (stack: Stack & { cards: Card[] }) => {
        allStacks && setAllStacks([...allStacks, stack]);
    };

    const updateStacks = (
        cardId: string | undefined,
        oldStackId: string | undefined,
        newStackId: string | undefined
    ) => {
        let cardToUpdate: Card | undefined;

        const removeCard = allStacks?.map((stack) => {
            if (stack.id === oldStackId) {
                stack.cards = [...stack.cards].filter((card) => {
                    if (card.id !== cardId) {
                        return true;
                    } else {
                        cardToUpdate = card;
                        return false;
                    }
                });
            }
            return stack;
        });

        const addCard = removeCard?.map((stack) => {
            if (stack.id === newStackId) {
                stack.cards =
                    stack.cards && cardToUpdate
                        ? [cardToUpdate, ...stack.cards]
                        : cardToUpdate
                        ? [cardToUpdate]
                        : [...stack.cards];
            }
            return stack;
        });
        console.log("changing all stacks to:", addCard);
        // setAllStacks(null);
        addCard && setAllStacks([...addCard]);
        console.log(allStacks);
        // router.replace(router.asPath);
    };

    const renderStacks = () => {
        const renderedStacks =
            allStacks &&
            allStacks.map((stack, index) => {
                console.log(stack.id);
                return (
                    <Draggable
                        key={stack.id}
                        draggableId={stack.id}
                        index={index}
                    >
                        {(provided) => (
                            <li
                                key={stack.id}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                            >
                                <SingleStackComponent
                                    stack={stack}
                                    updateStacks={updateStacks}
                                />
                            </li>
                        )}
                    </Draggable>
                );
            });
        setShowStacks(renderedStacks);
    };

    return (
        <>
            <DragDropContext
                onDragEnd={(result, provided) => {
                    if (!result.destination) return;
                }}
            >
                <>
                    <Droppable droppableId="board">
                        {(provided) => (
                            <ul
                                className="stacks"
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {showStacks}
                                <CreateStack
                                    addNewStack={addNewStack}
                                    boardId={props.boardId}
                                />
                            </ul>
                        )}
                    </Droppable>
                </>
            </DragDropContext>
        </>
    );
};

export default StacksComponent;
