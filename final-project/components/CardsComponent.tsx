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
                    <p>
                        <span>{new Date(card.createdAt).toUTCString()}</span>
                    </p>
                    <p>{card.description}</p>
                </div>
            );
        });

    return <div className="cards-container">{showCards}</div>;
};

export default CardsComponent;
