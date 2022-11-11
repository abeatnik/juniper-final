import { Stack, Card } from "@prisma/client";
import CardsComponent from "./CardsComponent";
import SingleStackComponent from "./SingleStack";
import { useState, useEffect } from "react";

interface StackProps {
    stackData: (Stack & { cards: Card[] })[] | null;
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
        allStacks.map((stack) => {
            return <SingleStackComponent stack={stack} />;
        });

    return (
        <>
            <div className="stack-container">{showStacks}</div>
        </>
    );
};

export default StacksComponent;
