import express from "express";
import cors from "cors";
import { jsonError } from "./middlewares/erros.js";
import routes from "./routes.js";
import "./database/index.js";

class App {
    constructor() {
        this.server = express();
        this.middlewares();
        this.routes();
    }

    middlewares(){
        this.server.use(cors());
        this.server.use(express.json());
        this.server.use(jsonError);
    }

    routes() {
        this.server.use(routes);
    }
}

export default new App().server;