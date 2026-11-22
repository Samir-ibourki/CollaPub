import { Server as SocketIOServer, Socket } from "socket.io";
import type { Server as HTTPServer } from "http";
import jwt from "jsonwebtoken";

let io: SocketIOServer | null = null;

interface SocketUserPayload {
  userId: string;
  role: string;
}

// initialize socket.io server with http server and cors
export function initSocket(httpServer: HTTPServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    },
  });


  io.use((socket: Socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace("Bearer ", "");

      if (!token) {
        return next(new Error("authentication error: token missing"));
      }

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        return next(new Error("server error: jwt secret missing"));
      }

      const decoded = jwt.verify(token, secret) as SocketUserPayload;
      socket.data.user = decoded;
      next();
    } catch (error) {
      next(new Error("authentication error: invalid or expired token"));
    }
  });

  // handle client connection
  io.on("connection", (socket: Socket) => {
    const user = socket.data.user as SocketUserPayload;

    // join user specific room for targeted notifications
    const userRoom = `user:${user.userId}`;
    socket.join(userRoom);

    // client disconnect event
    socket.on("disconnect", () => {
      // client disconnected
    });
  });

  return io;
}

// get current initialized socket server instance
export function getIO(): SocketIOServer {
  if (!io) {
    throw new Error("socket.io is not initialized yet");
  }
  return io;
}

// helper to emit realtime notification to a specific user
export function sendRealtimeNotification(userId: string, payload: any): void {
  if (!io) return;
  io.to(`user:${userId}`).emit("notification:new", payload);
}

// helper to emit realtime collaboration status update
export function sendRealtimeCollaborationUpdate(
  userId: string,
  payload: any
): void {
  if (!io) return;
  io.to(`user:${userId}`).emit("collaboration:update", payload);
}
