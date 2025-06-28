import { Router } from "express";
import CarroController from "./controllers/CarroController.js"
import ClienteController from "./controllers/ClienteController.js";
import LocacaoController from "./controllers/LocacaoController.js";

const routes = new Router();

routes.get("/carros", CarroController.index);
routes.get("/carros/:id", CarroController.show);
routes.post("/carros", CarroController.store);
routes.put("/carros/:id", CarroController.update);
routes.delete("/carros/:id", CarroController.destroy);

routes.get("/clientes", ClienteController.index);
routes.get("/clientes/:id", ClienteController.show);
routes.post("/clientes", ClienteController.store);
routes.put("/clientes/:id", ClienteController.update);
routes.delete("/clientes/:id", ClienteController.destroy);


routes.get("/locacoes", LocacaoController.index);
routes.get("/locacoes/:id", LocacaoController.show);
routes.post("/locacoes", LocacaoController.store);
routes.put("/locacoes/:id", LocacaoController.update);
routes.delete("/locacoes/:id", LocacaoController.destroy);



routes.use("/*splat", (req, res, next) => {
    res.json({error: "invalid route." });
});

export default routes;