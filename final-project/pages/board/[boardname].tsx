import { GetServerSideProps } from "next";
import prisma from "../../lib/prisma";
import { authOptions } from "../api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { useState, useEffect } from "react";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { boardname } = context.query;

    const boardId = typeof boardname === "string" ? boardname : undefined;
    const session = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    );

    const userEmail =
        session && typeof session.user?.email === "string"
            ? session.user.email
            : "";

    const currentBoard = await prisma.board.findUnique({
        include: { users: true },
        where: {
            id: boardId,
            users: { some: { email: userEmail } },
        },
    });
    console.log("currentBoard, ", currentBoard);
    return { props: currentBoard };
};

const Board: React.FC = () => {
    return (
        <>
            <p>Welcome to my board</p>
        </>
    );
};

export default Board;
