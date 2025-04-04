import app from "../index.js";
import { createServer } from "http";

export default async function handler(req, res) {
  const server = createServer(app);
  server.emit("request", req, res);
}
