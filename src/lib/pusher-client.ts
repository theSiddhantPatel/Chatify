import Pusher from "pusher-js";
import { axiosInstance } from "./axios";

export const getPusherClient = (): Pusher | null => {
  if (typeof window === "undefined") return null;

  const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "mt1";

  if (!pusherKey) {
    console.warn(
      "NEXT_PUBLIC_PUSHER_KEY is not defined. Real-time updates via Pusher are disabled."
    );
    return null;
  }

  return new Pusher(pusherKey, {
    cluster,
    channelAuthorization: {
      customHandler: (params, callback) => {
        axiosInstance
          .post("/messages/pusher/auth", {
            socket_id: params.socketId,
            channel_name: params.channelName,
          })
          .then((response) => {
            callback(null, response.data);
          })
          .catch((error) => {
            console.error("Pusher auth error:", error);
            callback(error, null);
          });
      },
    },
  });
};
