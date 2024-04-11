import express from "express";
import bodyParser from "body-parser";
import cors from "cors"
import { Server } from "socket.io";
import { createServer } from 'node:http';

import systemData from "./routes/manage/systemData.js"
import login from "./routes/login.js"
import userData from "./routes/userData.js"
import testing from "./testing.js"
import municipalities from "./routes/getMunicipalities.js"
import system from "./routes/system.js"
import auditFields from "./routes/manage/auditFields.js"
import newField from "./routes/manage/newField.js"
import field from "./routes/info/field.js"
import archiveField from "./routes/manage/archiveField.js"
import compliance from "./routes/info/compliance.js"
import complianUpdate from "./routes/userData.js"
import bpoc from "./routes/update/updateProps.js"

const port = 3000;

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(cors())
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

io.on('connection', (socket) => {
  console.log('a user connected',socket);
});

app.use("/system", systemData)
app.use("/auth", login)
app.use("/auth", userData)
app.use("/try", testing)
app.use("/data", municipalities)
app.use("/data", system)
app.use("/data", auditFields)
app.use("/data", newField)
app.use("/data", field)
app.use("/data", archiveField)
app.use('/data', compliance)
app.use("/data",bpoc)

server.listen(port, (token) => {
  if(!token){
    console.log("Listening on port:", port);
  }
});
