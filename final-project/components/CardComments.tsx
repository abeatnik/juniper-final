import React from "react";
import { useState, useEffect } from "react";
import { User, Card, Comment } from "@prisma/client";
import Comments from "./Comments";
import AddComment from "./AddComment";

const CardComments: React.FC<{ cardId: string }> = ({ cardId }) => {
    const [comments, setComments] = useState<
        (Comment & { user: User })[] | null
    >(null);

    useEffect(() => {
        getComments(cardId);
    }, []);

    const getComments = async (cardId: string) => {
        const data = await fetch(`/api/comments/${cardId}`);
        const cardComments: (Comment & {
            user: User;
        })[] = await data.json();
        setComments(cardComments);
    };

    const addNewComment = (comment: (Comment & { user: User }) | null) => {
        const allComments =
            comments && comment
                ? [comment, ...comments.map((item) => item)]
                : null;
        allComments && setComments(allComments);
    };

    return (
        <div className="comments">
            <AddComment cardId={cardId} addNewComment={addNewComment} />
            <h4>Comments</h4>
            <Comments comments={comments && comments} />
        </div>
    );
};

export default CardComments;
