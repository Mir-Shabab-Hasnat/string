import Pusher from "pusher";

export const pusherServer = new Pusher({
  appId: "0407ee09-baba-4665-9b6c-1c93ac5c9e1a",
  key: "383695B904BA4C09801C776382132DD6471242DB28E2CF357999149D56495D33",
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true, // Ensure secure connections
});
