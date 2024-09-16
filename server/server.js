import { createServer } from "node:http";
import app from "./index.js";

const server =  createServer(app)

const port = process.env.PORT 
server.listen(port, () => {
   console.log(`Server running on http://localhost:${port}`)
})