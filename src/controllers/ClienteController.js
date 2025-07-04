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
            nome: Yup.string().trim().required("O nome é obrigatório"),
            cpf: Yup.string().trim().required("O CPF é obrigatório").length(11, "O CPF deve ter 11 dígitos"),
            telefone: Yup.string().trim().required("O telefone é obrigatório"),
            email: Yup.string().trim().required("O email é obrigatório"),
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
            nome: Yup.string().transform(value => (value === "" ? undefined : value)).notRequired(),
            telefone: Yup.string().transform(value => (value === "" ? undefined : value)).notRequired(),
            email: Yup.string().transform(value => (value === "" ? undefined : value)).notRequired(),
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

        if (nome !== undefined && nome !== null) dados.nome = nome;
        if (telefone !== undefined) dados.telefone = telefone;
        if (email !== undefined) {
            if (await verificaSeEmailJaExiste(email) && email !== clienteBd.email){
                return res.status(400).json({error: "Já existe um cliente com este Email cadastrado"})
            }
            dados.email = email;
        }

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