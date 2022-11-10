import Layout from "../components/Layout";
import { GetServerSideProps } from "next";
import prisma from "../lib/prisma";
import { Prisma, User, Board } from "@prisma/client";
import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { useRouter } from "next/router";
import CreateBoard from "../components/CreateBoard";
import { useEffect } from "react";

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

    const result = (userObj && userObj.boards) || [];
    const boards = JSON.parse(JSON.stringify(result));

    return { props: { boards } };
};

const Home: React.FC<{ props: { boards: Board[] | [] } }> = (props) => {
    const router = useRouter();
    //https://www.joshwcomeau.com/nextjs/refreshing-server-side-props/
    const refreshData = () => router.replace(router.asPath);

    useEffect(() => {
        console.log(props);
    });

    const boardList =
        props.props &&
        props.props.boards.map((board) => (
            <li key={board.id}>
                <h4>{board.title}</h4>
                <p>{"created on " + board.createdAt.toDateString()}</p>
            </li>
        ));

    return (
        <>
            <Layout>
                {/* <ul className="board-list">{boardList}</ul> */}
                <CreateBoard refreshData={refreshData} />
            </Layout>
        </>
    );
};

export default Home;
