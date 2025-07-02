import * as Yup from "yup";
import Cliente from "../models/Cliente.js"
import Locacao from "../models/Locacao.js";

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

        const clienteId = req.params.id;

        const cliente = await Cliente.findByPk(clienteId, 
            {attributes: [
                'id',
                'nome',
                'cpf',
                'telefone',
                'email',
            ]});

        if (cliente === null){
            return res.status(400).json({ error:"Não existe cliente com este id"});
        }

        return res.json(cliente);

    }

    async store(req, res) {
        
        const schema = Yup.object().shape({
            nome: Yup.string().required(),
            cpf: Yup.string().required(),
            telefone: Yup.string().required(),
            email: Yup.string().required(),
        });
        let data;
        try {
            data = await schema.validate(req.body, {
            stripUnknown: true,
            abortEarly: false,
            })
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
        
        const { nome, cpf, telefone, email } = data;
          
        if (await verificaSeCpfJaExiste(cpf)){
            return res.status(400).json({error: "Já existe um cliente com este CPF cadastrado"})
        }

        if (await verificaSeEmailJaExiste(email)){
            return res.status(400).json({error: "Já existe um cliente com este Email cadastrado"})
        }

        const cliente = await Cliente.create({
            nome,
            cpf,
            telefone,
            email,
        });

        return res.status(201).json(cliente);
    }

    async update(req, res) {

        const schema = Yup.object().shape({
            nome: Yup.string().notRequired(),
            telefone: Yup.string().notRequired(),
            email: Yup.string().notRequired(),
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

        const clienteId = req.params.id;

        const clienteBd = await Cliente.findByPk(clienteId);
        console.log(clienteBd);
        
        if (clienteBd === null) {
            return res.status(400).json({error: "Não existe cliente com este id"})
        }
        
        const { nome, telefone, email } = data;

        let dados = {};

        if (nome !== undefined) dados.nome = nome;
        if (telefone !== undefined) dados.telefone = telefone;
        if (email !== undefined) dados.email = email;

        await Cliente.update(dados, {
            where: {id : clienteId},
        });

        return res.status(204).json();       
    }

    async destroy(req, res) {
        const clienteId = req.params.id;

        const cliente = await Cliente.findByPk(clienteId);
        if (cliente === null){
            return res.status(400).json({error: `Não existe cliente com o id:${clienteId}`});
        }

        const locacoes = await Locacao.findAll({
            where: {cliente_id: clienteId},
        });

        if (locacoes.length > 0){
            return res.status(400).json({error: `Você não pode excluir um cliente que tenha uma locação`});
        }

        await Cliente.destroy({
            where: {id : clienteId},
        });
        
        return res.status(204).json();
    }

}

async function verificaSeCpfJaExiste(cpf) {
    const cliente = await Cliente.findAll({
        where: { cpf: cpf },
    });

    return cliente.length > 0;
}

async function verificaSeEmailJaExiste(email) {
    const cliente = await Cliente.findAll({
        where: { email: email },
    });

    return cliente.length > 0;
}

export default new ClienteController();