import { getSession } from "next-auth/react";
import { Server } from "socket.io";
import type { NextApiRequest } from "next";
import type { NextApiResponseServerIO } from "../../types/response";
// code from redbaron76 bc of problems with typescript: https://codesandbox.io/s/piffv?file=/src/pages/api/socketio.ts:145-189

const socketHandler = async (
    req: NextApiRequest,
    res: NextApiResponseServerIO
) => {
    if (!res.socket.server.io) {
        const io = new Server(res.socket.server as any);
        res.socket.server.io = io;

        io.on("connection", (socket) => {
            socket.on("room", function (room) {
                socket.join(room);
            });
        });
    }
    // console.log(Array.from(res.socket.server.io.sockets.sockets));
    res.end();
};

export const config = {
    api: {
        bodyParser: false,
    },
};

export default socketHandler;
