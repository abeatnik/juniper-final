import React from "react";
import { Comment, User } from "@prisma/client";

const Comments: React.FC<{
    comments: (Comment & { user: User })[] | null;
}> = ({ comments }) => {
    const showComments =
        comments &&
        comments.map((comment) => {
            return (
                <li className="comment" key={comment.id}>
                    <div className="user-pic">
                        <img src={comment.user.image || undefined} alt="" />
                    </div>
                    <div className="content">
                        <p>
                            {comment.user.name || undefined}
                            <span>
                                {" on " +
                                    new Date(
                                        comment.user.createdAt
                                    ).toUTCString()}
                            </span>
                        </p>
                        <p>{comment.text}</p>
                    </div>
                </li>
            );
        });

    return <ul className="comments-list">{showComments}</ul>;
};

export default Comments;
