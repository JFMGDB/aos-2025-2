import { Router } from "express";

const router = Router();

// Middleware para tratamento de erros assíncronos e status 500
// Garante que erros de banco de dados (ex: conexão, query) retornem 500
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
        console.error(error); // Log detalhado para o servidor
        res.status(500).json({ error: "Internal Server Error" });
    });
};

// GET todas as mensagens
router.get("/", asyncHandler(async (req, res) => {
    // Inclui o User associado para retornar dados mais ricos
    const messages = await req.context.models.Message.findAll({
        include: [{ model: req.context.models.User }]
    });
    return res.status(200).json(messages);
}));

// GET mensagem por ID
router.get("/:messageId", asyncHandler(async (req, res) => {
    const message = await req.context.models.Message.findByPk(req.params.messageId, {
        include: [{ model: req.context.models.User }]
    });

    if (!message) {
        return res.status(404).json({ error: "Message not found" });
    }
    return res.status(200).json(message);
}));

// POST criar nova mensagem
router.post("/", asyncHandler(async (req, res) => {
    // Verifica se o usuário logado está disponível
    if (!req.context.me) {
        return res.status(401).json({ error: "Unauthorized. User context missing." });
    }
    
    // Cria a mensagem, associando-a ao usuário logado
    const newMessage = await req.context.models.Message.create({
        text: req.body.text,
        userId: req.context.me.id, 
    });

    // 201 Created para criação bem-sucedida
    return res.status(201).json(newMessage);
}));

// PUT atualizar mensagem por ID (operação de CRUD adicionada)
router.put("/:messageId", asyncHandler(async (req, res) => {
    const { text } = req.body;
    // Atualiza o campo 'text' da mensagem
    const [updatedCount] = await req.context.models.Message.update({ text }, {
        where: { id: req.params.messageId }
    });

    if (updatedCount === 0) {
        return res.status(404).json({ error: "Message not found" });
    }

    // Busca e retorna a mensagem atualizada
    const updatedMessage = await req.context.models.Message.findByPk(req.params.messageId, {
        include: [{ model: req.context.models.User }]
    });
    return res.status(200).json(updatedMessage);
}));


// DELETE mensagem por ID
router.delete("/:messageId", asyncHandler(async (req, res) => {
    const deleted = await req.context.models.Message.destroy({
        where: { id: req.params.messageId }
    });

    if (deleted === 0) {
        return res.status(404).json({ error: "Message not found" });
    }

    // 204 No Content para exclusão bem-sucedida
    return res.status(204).send();
}));

export default router;