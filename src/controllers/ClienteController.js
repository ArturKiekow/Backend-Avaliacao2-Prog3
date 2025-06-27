import * as Yup from "yup";
import Cliente from "../models/Cliente.js"
import e from "express";

class ClienteController {

    async index(req, res) {        
        const clientes = await Cliente.findAll({
            attributes: [
                'id',
                'nome',
                'cpf',
                'telefone',
                'email',
            ],
        });

        return res.json(clientes);
    }

    async show(req, res) {


    }

    async store(req, res) {
        
        const schema = Yup.object().shape({
            nome: Yup.string().required(),
            cpf: Yup.string().required(),
            telefone: Yup.string().required(),
            email: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))){
            return res.status(400).json({error: "Schema is not valid."});
        };  
        
        const { nome, cpf, telefone, email } = req.body;
        
        if (await verificaSeCpfJaExiste(cpf)){
            return res.status(400).json({error: "Já existe um cliente com este CPF cadastrado"})
        }

        const cliente = await Cliente.create({
            nome,
            cpf,
            telefone,
            email,
        });

        return res.json(cliente);
    }

    async update(req, res) {
        
    }

    async destroy(req, res) {
        
    }

}

async function verificaSeCpfJaExiste(cpf) {
    const cliente = await Cliente.findAll({
        where: {cpf},
    });

    return cliente > 0;
}

export default new ClienteController();