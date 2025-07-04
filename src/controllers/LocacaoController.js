import * as Yup from "yup";
import Locacao from "../models/Locacao.js";
import Cliente from "../models/Cliente.js";
import Carro from "../models/Carro.js";

class LocacaoController {

    async index(req, res) {

        const locacoes = await Locacao.findAll({
            attributes: [
                "id",
                "data_inicio",
                "data_fim",
                "valor_total",
            ], include: [
                {
                    model: Cliente,
                    as: "cliente",
                    attributes: [
                        "id",
                        "nome",
                    ],
                },
                {
                    model: Carro,
                    as: "carro",
                    attributes: [
                        "id",
                        "modelo",
                    ],
                }
            ]
        });

        return res.json(locacoes);        
    }
    
    async show(req, res) {
        
        const locacaoId = req.params.id;

        const locacao = await Locacao.findByPk(locacaoId, {
             attributes: [
                "id",
                "data_inicio",
                "data_fim",
                "valor_total",
            ], include: [
                {
                    model: Cliente,
                    as: "cliente",
                    attributes: [
                        "id",
                        "nome",
                    ],
                },
                {
                    model: Carro,
                    as: "carro",
                    attributes: [
                        "id",
                        "modelo",
                    ],
                }
            ],
        });

        if (locacao === null) {
            return res.status(400).json({error: `Não existe locação com o id:${locacaoId}`});
        }
        
        return res.json(locacao);
    }

    async store(req, res) {
        
        const schema = Yup.object().shape({
            cliente_id: Yup.number().required("O cliente é obrigatório"),
            carro_id: Yup.number().required("O carro é obrigatório"),
            data_inicio: Yup.date().required("A data de início é obrigatório"),
            data_fim: Yup.date().required("A data de fim é obrigatório"),
            valor_total: Yup.number().required("O valor total é obrigatório").positive("O valor total deve ser positivo"),
        });

        let data;
        try {
            data = await schema.validate(req.body, {
            stripUnknown: true,
            abortEarly: false,
            });
        } catch (error) {
            return res.status(400).json({error: error.message})
        }

        const { cliente_id, carro_id, data_inicio, data_fim, valor_total } = data;

        const cliente = await Cliente.findByPk(cliente_id);
        if (cliente === null) {
            return res.status(400).json({error: `Não existe cliente com o id:${cliente_id}`});
        }

        const carro = await Carro.findByPk(carro_id);
        if (carro === null){
            return res.status(400).json({error: `Não existe carro com o id:${carro_id}`});
        }

        if (carro.disponivel == false){
            return res.status(400).json({error: `Carro indisponivel`});           
        }

        if (data_inicio > data_fim){
            return res.status(400).json({error: `A data de inicio não pode ser maior que a data do fim da locação`});
        }

        const locacao = await Locacao.create({
            cliente_id, 
            carro_id, 
            data_inicio, 
            data_fim, 
            valor_total,
        })

        await Carro.update({disponivel: false}, {
            where: {id: carro_id},
        })

        return res.json(locacao)
    }

    async update(req, res) {
        
        const schema = Yup.object().shape({
            cliente_id: Yup.number().notRequired(),
            carro_id: Yup.number().notRequired(),
            data_inicio: Yup.date().notRequired(),
            data_fim: Yup.date().notRequired(),
            valor_total: Yup.number().notRequired().positive("O valor total deve ser positivo"),
        });

        let data;
        try {
            data = await schema.validate(req.body, {
            stripUnknown: true,
            abortEarly: false,
            });
        } catch (error) {
            return res.status(400).json({error: error.message})
        }

        const { cliente_id, carro_id, data_inicio, data_fim, valor_total } = data;        
        
        let dados = {};

        const locacaoId = req.params.id;
        const locacao = await Locacao.findByPk(locacaoId);
        if (locacao === null){
            return res.status(400).json({error: `Não existe locação com o id:${cliente_id}`});
        }
        
        if (cliente_id !== undefined && locacao.cliente_id !== cliente_id) {
            const newCliente = await Cliente.findByPk(cliente_id);
            
            if (newCliente === null) {
                return res.status(400).json({error: `Não existe cliente com o id:${cliente_id}`});
            }
            dados.cliente_id = cliente_id;
        }

        if (carro_id != undefined && locacao.carro_id !== carro_id) {
            const newCarro = await Carro.findByPk(carro_id);
            if (newCarro === null) {
                return res.status(400).json({error: `Não existe carro com o id:${carro_id}`});
            }
            if (!newCarro.disponivel){
                return res.status(400).json({error: `Carro indisponivel`});
            }
            dados.carro_id = carro_id;
        }

        let inicio = locacao.data_inicio;
        let fim = locacao.data_fim;

        if (data_inicio !== undefined){
            inicio = data_inicio;
        }
        if (data_fim !== undefined){
            fim = data_fim;
        }
        if (inicio > fim) {
            return res.status(400).json({error: `A data de inicio não pode ser maior que a data do fim da locação`});
        }
        dados.data_inicio = inicio;
        dados.data_fim = fim;
        
        if (valor_total !== undefined) dados.valor_total = valor_total;
        
        await Locacao.update(dados, {
            where: {id: locacaoId},
        });

        await Carro.update({disponivel: true}, {
            where: {id: locacao.carro_id},
        })  

        await Carro.update({disponivel: false}, {
            where: {id: carro_id},
        });        

        return res.status(204).json();
    }

    async destroy(req, res) {
        
        const locacaoId = req.params.id;

        const locacao = await Locacao.findByPk(locacaoId);
        if (locacao === null){
            return res.status(400).json({error: `Não existe locação com o id:${locacaoId}`});
        }

        await Carro.update({disponivel: true}, {
            where: {id: locacao.carro_id},
        });

        await Locacao.destroy({
            where: {id : locacaoId},
        });

        return res.status(204).json();
    }


}

export default new LocacaoController();