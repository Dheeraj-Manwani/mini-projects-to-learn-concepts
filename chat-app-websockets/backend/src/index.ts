import { WebSocketServer, WebSocket } from "ws";
import express from "express";
import { v4 as uuidv4 } from "uuid";

const app = express();
const httpServer = app.listen(8080, function () {
  console.log(new Date() + " Server is listening on port 8080");
});

const wss = new WebSocketServer({ server: httpServer });

interface ExtWebSocket extends WebSocket {
  id: string;
}

// wss.getUniqueID = function () {
//   function s4() {
//     return Math.floor((1 + Math.random()) * 0x10000)
//       .toString(16)
//       .substring(1);
//   }
//   return s4() + s4() + "-" + s4();
// };

wss.on("connection", function connection(ws: ExtWebSocket) {
  ws.on("error", console.error);
  if (!ws.id) {
    ws.id = uuidv4();
    console.log(ws.id);
  }

  wss.clients.forEach((client) => {
    const extWs = client as ExtWebSocket;
  });

  ws.on("message", function message(data, isBinary) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        const extWs = client as ExtWebSocket;
        console.log("senders id", ws.id);
        console.log("data", data);

        if (extWs.id !== ws.id) {
          client.send(data, { binary: isBinary });
        }
      }
    });
  });

  ws.send("Hello From the server");
});
