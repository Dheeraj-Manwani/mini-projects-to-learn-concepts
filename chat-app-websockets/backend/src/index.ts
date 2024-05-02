import { WebSocketServer, WebSocket } from "ws";
import express from "express";
import { v4 as uuidv4 } from "uuid";
const url = require("url");
const app = express();

const httpServer = app.listen(8080, function () {
  console.log(new Date() + " Server is listening on port 8080");
});

const wss = new WebSocketServer({ server: httpServer });

interface ExtWebSocket extends WebSocket {
  id: string;
}

let lobbies = new Map<string, string[]>();

wss.on("connection", function connection(ws: ExtWebSocket, req) {
  ws.on("error", console.error);
  if (!ws.id) {
    ws.id = uuidv4();
    console.log(ws.id);
  }

  const lobbyCode: string = url.parse(req.url, true).query.lobby;
  console.log("lobbyCode", lobbyCode);

  if (lobbies.get(lobbyCode)) {
    lobbies.get(lobbyCode)?.push(ws.id);
  } else {
    lobbies.set(lobbyCode, [ws.id]);
  }

  wss.clients.forEach((client) => {
    const extWs = client as ExtWebSocket;
  });

  ws.on("message", function message(data, isBinary) {
    console.log(lobbies);
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        const extWs = client as ExtWebSocket;

        if (
          extWs.id !== ws.id &&
          lobbies.has(lobbyCode) &&
          // @ts-ignore
          lobbies.get(lobbyCode).includes(extWs.id)
        ) {
          console.log("senders id", ws.id);
          client.send(data, { binary: isBinary });
        }
      }
    });
  });

  ws.send("Hello From the server");
});
