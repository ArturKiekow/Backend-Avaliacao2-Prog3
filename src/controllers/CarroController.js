import * as Yup from "yup";
import Carro from "../models/Carro.js";
import Locacao from "../models/Locacao.js";

class CarroController {
    async index(req, res) {
        let carros = await Carro.findAll({
            attributes: [
                'id',
                'marca',
                'modelo',
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
                'marca',
                'modelo',
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
        
        let data;
        try {
            data = await schema.validate(req.body, {
            stripUnknown: true,
            abortEarly: false,
            });
        } catch (error) {
            return res.status(400).json({error: error.message})
        }

        const { marca, modelo, ano, placa, disponivel } = data;

        if (await verificaSePlacaJaExiste(placa)){
            return res.status(400).json({error: "Já existe um carro com esta placa cadastrado"});
        }

        const carro = await Carro.create({
            marca,
            modelo,
            ano,
            placa,
            disponivel,
        });

        return res.status(201).json(carro);
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            marca: Yup.string().notRequired(),
            modelo: Yup.string().notRequired(),
            ano: Yup.number().notRequired().positive(),
            placa: Yup.string().notRequired().length(8),
            disponivel: Yup.boolean().notRequired(),
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
        
        const { marca, modelo, ano, placa, disponivel } = data;

        let dados = {};

        const carroId = req.params.id;

        const carro = await Carro.findByPk(carroId);
        
        if (carro === null){
            return res.status(400).json({error: "Não existe carro com este id"});
        }

        if (marca !== undefined) dados.marca = marca;
        if (modelo !== undefined) dados.modelo = modelo;
        if (ano !== undefined) dados.ano = ano;
        if (placa !== undefined && placa !== carro.placa) {
            if (await verificaSePlacaJaExiste(placa)){
                return res.status(400).json({error: "Já existe um carro com esta placa cadastrado"});
            }
            dados.placa = placa;
        }
        if (disponivel !== undefined) {
            const anyLocacao = await Locacao.findOne({
                where: {carro_id: carroId},
            });
            console.log(anyLocacao);
            
            if (anyLocacao !== null) {
                return res.status(400).json({error: "Você não pode atualizar a disponibilidade de um carro locado"});
            }

            dados.disponivel = disponivel;
        }


        await Carro.update(dados, {
            where: {id : carroId}
        })

        return res.status(204).json();
    }

    async destroy(req, res) {
        const carroId = req.params.id;

        const carro = await Carro.findByPk(carroId);

        if (carro === null){
            return res.status(400).json({error: "Não existe carro com este id"});
        }

        const locacoes = await Locacao.findAll({
            where: {carro_id: carroId},
        });

        if (locacoes.length > 0){
            return res.status(400).json({error: `Você não pode excluir um carro que tenha uma locação`});
        }

        await Carro.destroy(
            {
                where: {id : carroId}
            }
        );

        return res.status(204).json();
    }
}

async function verificaSePlacaJaExiste(placa) {
        let carro = await Carro.findAll({
            where: {placa},
        });        
        
        return carro.length > 0;
}

export default new CarroController();