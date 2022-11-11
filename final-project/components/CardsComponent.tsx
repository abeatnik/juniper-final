import { Stack, Card } from "@prisma/client";

interface CardProps {
    cards: Card[] | [];
}

const CardsComponent: React.FC<CardProps> = (props: CardProps) => {
    const showCards =
        props.cards &&
        props.cards.map((card) => {
            return (
                <div className="card" key={card.id}>
                    <h4>{card.title}</h4>
                    <p>{"created at " + new Date(card.createdAt).toString()}</p>
                    <p>{card.description}</p>
                </div>
            );
        });

    return <div className="cards-container">{showCards}</div>;
};

export default CardsComponent;
