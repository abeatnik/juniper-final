import Layout from "../components/Layout";
import { GetServerSideProps } from "next";
import prisma from "../lib/prisma";
import { Board } from "@prisma/client";
import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import CreateBoard from "../components/CreateBoard";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    );

    const userEmail =
        session && typeof session.user?.email === "string"
            ? session.user.email
            : "";

    const userObj = await prisma.user.findUnique({
        where: {
            email: userEmail,
        },
        select: {
            boards: true,
        },
    });

    const data = userObj && userObj.boards;
    const boards = JSON.parse(JSON.stringify(data));
    return { props: { boards } };
};

interface HomeProps {
    boards: Board[];
}

const Home: React.FC<HomeProps> = (props: HomeProps) => {
    const { data: session, status } = useSession();
    const [userBoards, setUserBoards] = useState<Board[] | []>([]);

    useEffect(() => {
        setUserBoards(props.boards);
    }, []);

    const addNewBoard = (board: Board) => {
        setUserBoards([...userBoards, board]);
    };

    const boardList =
        userBoards &&
        userBoards.map((board) => (
            <li key={board.id}>
                <Link href={`/board/${board.id}`}>{board.title}</Link>
                <p>
                    {"created on " + new Date(board.createdAt).toDateString()}
                </p>
            </li>
        ));
    return (
        <>
            <Layout>
                {status === "authenticated" && (
                    <>
                        <ul className="board-list">{boardList}</ul>
                        <CreateBoard addNewBoard={addNewBoard} />
                    </>
                )}
                {status !== "authenticated" && <h1>Welcome</h1>}
            </Layout>
        </>
    );
};

export default Home;
