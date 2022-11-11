import { Stack, Card } from "@prisma/client";
import CardsComponent from "./CardsComponent";

interface StackProps {
    stackData: (Stack & { cards: Card[] })[] | null;
}

const StacksComponent: React.FC<StackProps> = (props: StackProps) => {
    const showStacks =
        props.stackData &&
        props.stackData.map((stack) => {
            return (
                <div className="stack" key={stack.id}>
                    <h2>{stack.title}</h2>
                    <p>
                        {"created on " +
                            new Date(stack.createdAt).toDateString()}
                    </p>
                    <CardsComponent cards={stack.cards} />
                </div>
            );
        });

    return (
        <>
            <div className="stack-container">{showStacks && showStacks}</div>
        </>
    );
};

export default StacksComponent;
