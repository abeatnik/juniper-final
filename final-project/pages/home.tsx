import Layout from "../components/Layout";
import { GetServerSideProps } from "next";
import prisma from "../lib/prisma";
import { Prisma, User, Board } from "@prisma/client";
import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { useRouter } from "next/router";
import CreateBoard from "../components/CreateBoard";
import { useState, useEffect } from "react";

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
    // const router = useRouter();
    const [userBoards, setUserBoards] = useState<Board[] | []>([]);

    useEffect(() => {
        setUserBoards(props.boards);
    }, []);

    //https://www.joshwcomeau.com/nextjs/refreshing-server-side-props/
    // const refreshData = () => router.replace(router.asPath);

    // console.log("first", props.boards); ?????

    const addNewBoard = (board: Board) => {
        setUserBoards([...userBoards, board]);
    };

    const boardList =
        userBoards &&
        userBoards.map((board) => (
            <li key={board.id}>
                <h4>{board.title}</h4>
                <p>
                    {"created on " + new Date(board.createdAt).toDateString()}
                </p>
            </li>
        ));
    return (
        <>
            <Layout>
                <ul className="board-list">{boardList}</ul>
                <CreateBoard addNewBoard={addNewBoard} />
            </Layout>
        </>
    );
};

export default Home;
