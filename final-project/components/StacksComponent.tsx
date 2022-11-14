import { Stack, Card } from "@prisma/client";
import CreateStack from "./CreateStack";
import SingleStackComponent from "./SingleStack";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface StackProps {
    stackData: (Stack & { cards: Card[] })[] | null;
    boardId: string | null;
}

const StacksComponent: React.FC<StackProps> = (props: StackProps) => {
    const [allStacks, setAllStacks] = useState<
        (Stack & { cards: Card[] })[] | null
    >([]);

    useEffect(() => {
        props.stackData && setAllStacks(props.stackData);
    }, []);

    const addNewStack = (stack: Stack & { cards: Card[] }) => {
        allStacks && setAllStacks([...allStacks, stack]);
    };

    const showStacks =
        allStacks &&
        allStacks.map((stack, index) => {
            return (
                <Draggable key={stack.id} draggableId={stack.id} index={index}>
                    {(provided) => (
                        <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                        >
                            <SingleStackComponent stack={stack} />
                        </li>
                    )}
                </Draggable>
            );
        });

    return (
        <>
            <>
                {showStacks}
                <CreateStack
                    addNewStack={addNewStack}
                    boardId={props.boardId}
                />
            </>
        </>
    );
};

export default StacksComponent;
