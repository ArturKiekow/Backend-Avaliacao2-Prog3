import { Router } from "express";
import CarroController from "./controllers/CarroController.js"

const routes = new Router();

routes.get("/carros", CarroController.index);
routes.get("/carros/:id", CarroController.show);
routes.post("/carros", CarroController.store);
routes.put("/carros/:id", CarroController.update);
routes.delete("/carros/:id", CarroController.destroy);



routes.use("/*splat", (req, res, next) => {
    res.json({error: "invalid route." });
});

export default routes;