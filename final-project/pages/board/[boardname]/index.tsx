import { GetServerSideProps } from "next";
import prisma from "../../../lib/prisma";
import { authOptions } from "../../api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { Board, User, Stack, Card } from "@prisma/client";
import { useSession } from "next-auth/react";
import StacksComponent from "../../../components/StacksComponent";

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

    const data = await prisma.board.findUnique({
        where: {
            id: boardId,
        },
        include: {
            stacks: true,
            users: true,
        },
    });

    const authorized =
        data && data.users.some((user) => user.email === userEmail);

    const currentBoard: Board & {
        stacks: Stack[];
        users: User[];
    } = authorized ? JSON.parse(JSON.stringify(data)) : null;

    const allCards = await prisma.stack.findMany({
        where: {
            id: { in: currentBoard.stacks.map((stack) => stack.id) },
        },
        include: {
            cards: true,
        },
    });

    const stackData: (Stack & { cards: Card[] }) | null =
        authorized && JSON.parse(JSON.stringify(allCards));

    return { props: { currentBoard, stackData } };
};

interface BoardProps {
    currentBoard: (Board & { users: User[]; stacks: Stack[] }) | null;
    stackData: (Stack & { cards: Card[] })[] | null;
}

const Board: React.FC<BoardProps> = (props: BoardProps) => {
    const { data: session, status } = useSession();
    const userEmail = session?.user && session?.user.email;
    const currentUser =
        props.currentBoard &&
        props.currentBoard.users.find((user) => user.email === userEmail);

    return (
        <>
            <h1 className="board-title">
                {props.currentBoard && props.currentBoard.title}
            </h1>
            <p>{`Welcome to your board, ${
                session?.user && session.user.name
            }`}</p>
            <p>This is your dashboard</p>
            <StacksComponent
                stackData={props.stackData}
                boardId={props.currentBoard && props.currentBoard.id}
            />
        </>
    );
};

export default Board;
