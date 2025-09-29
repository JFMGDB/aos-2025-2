import models from '../models/index.js';

//POST
export const criarTarefa = async (req, res) => {
    try {
        const novaTarefa = await models.Tarefa.create(req.body);
        return res.status(201).json(novaTarefa);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

//GetAll
export const listarTarefas = async (req, res) => {
    const tarefas = await models.Tarefa.findAll();
    return res.status(200).json(tarefas);
};

//GetById
export const listarTarefaPorId = async (req, res) => {
    const { objectId } = req.params;
    const tarefa = await models.Tarefa.findByPk(objectId);

    if (!tarefa) {
        return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }
    return res.status(200).json(tarefa);
};

//PUT
export const atualizarTarefa = async (req, res) => {
    const { objectId } = req.params;
    const [updated] = await models.Tarefa.update(req.body, {
        where: { objectId: objectId }
    });

    if (!updated) {
        return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }    

    const tarefaAtualizada = await models.Tarefa.findByPk(objectId);
    return res.status(200).json(tarefaAtualizada);
};

//DELETE
export const deletarTarefa = async (req, res) => {
    const { objectId } = req.params;
    const deletada = await models.Tarefa.destroy({
        where: { objectId: objectId }
    });

    if (!deletada) {
        return res.status(404).json({ error: 'Tarefa não encontrada.' });
    } 

    return res.status(200).json({ message: 'Tarefa deletada com sucesso.' });
};