import * as Yup from "yup";
import Carro from "../models/Carro.js";

class CarroController {
    async index(req, res) {
        let carros = await Carro.findAll({
            attributes: [
                'id',
                'modelo',
                'marca',
                'ano',
                'placa',
                'disponivel',
            ]
        });
        return res.json(carros)
    }

    async show(req, res) {
        const carroId = req.params.id;
        const carro = await Carro.findByPk(carroId, {
            attributes: [
                'id',
                'modelo',
                'marca',
                'ano',
                'placa',
                'disponivel',
            ]
        });
        
        if (carro === null){
            return res.status(400).json({error: "Não existe carro com este id"});
        }

        return res.json(carro);
    }

    async store(req, res) {
       
        const schema = Yup.object().shape({
            marca: Yup.string().required(),
            modelo: Yup.string().required(),
            ano: Yup.number().required().positive(),
            placa: Yup.string().required().length(8),
            disponivel: Yup.boolean().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({error: "Schema is not valid."});
        }

        const { marca, modelo, ano, placa, disponivel } = req.body;

        if (await verificaSePlacaExiste(placa)){
            return res.json({error: "Já existe um carro com esta placa cadastrado"});
        }

        const carro = await Carro.create({
            marca,
            modelo,
            ano,
            placa,
            disponivel,
        });

        return res.json(carro);
    }

    async update(req, res) {
        const carroId = req.params.id;

        const carro = await Carro.findByPk(carroId);
        
        if (carro === null){
            return res.status(400).json({error: "Não existe carro com este id"});
        }

        const schema = Yup.object().shape({
            marca: Yup.string().notRequired(),
            modelo: Yup.string().notRequired(),
            ano: Yup.number().notRequired().positive(),
            placa: Yup.string().notRequired().length(8),
            disponivel: Yup.boolean().notRequired(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({error: "Schema is not valid."});
        }
        
        let dados = {};
         
        const { marca, modelo, ano, placa, disponivel } = req.body;

        if (await verificaSePlacaExiste(placa)){
            return res.json({error: "Já existe um carro com esta placa cadastrado"});
        }

        if (marca !== undefined) dados.marca = marca;
        if (modelo !== undefined) dados.modelo = modelo;
        if (ano !== undefined) dados.ano = ano;
        if (placa !== undefined) dados.placa = placa;
        if (disponivel !== undefined) dados.disponivel = disponivel;


        await Carro.update(dados, {
            where: {id : carroId}
        })

        return res.send();
    }

    async destroy(req, res) {
        const carroId = req.params.id;

        const carro = await Carro.findByPk(carroId);

        if (carro === null){
            return res.status(400).json({error: "Não existe carro com este id"});
        }

        await Carro.destroy(
            {
                where: {id : carroId}
            }
        );

        return res.send();
    }
}

async function verificaSePlacaExiste(placa) {
        let carro = await Carro.findAll({
            where: {placa},
        });        
        
        return carro.length > 0;
}

export default new CarroController();