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

// GET todos os usuários
router.get("/", asyncHandler(async (req, res) => {
    const users = await req.context.models.User.findAll();
    return res.status(200).json(users);
}));

// GET usuário por ID
router.get("/:userId", asyncHandler(async (req, res) => {
    const user = await req.context.models.User.findByPk(req.params.userId);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
}));

// POST criar novo usuário
router.post("/", asyncHandler(async (req, res) => {
    // A validação do Sequelize deve garantir que username e email não sejam vazios/nulos
    const newUser = await req.context.models.User.create(req.body);
    // 201 Created para criação bem-sucedida
    return res.status(201).json(newUser);
}));

// PUT atualizar usuário por ID
router.put("/:userId", asyncHandler(async (req, res) => {
    // Atualiza o registro e retorna o número de linhas afetadas (updated[0])
    const [updated] = await req.context.models.User.update(req.body, {
        where: { id: req.params.userId }
    });

    if (updated === 0) {
        return res.status(404).json({ error: "User not found" });
    }

    // Busca o usuário atualizado para retornar na resposta (prática comum em PUT)
    const updatedUser = await req.context.models.User.findByPk(req.params.userId);
    return res.status(200).json(updatedUser);
}));

// DELETE usuário por ID
router.delete("/:userId", asyncHandler(async (req, res) => {
    // Deleta o registro e retorna o número de linhas deletadas
    const deleted = await req.context.models.User.destroy({
        where: { id: req.params.userId }
    });

    if (deleted === 0) {
        return res.status(404).json({ error: "User not found" });
    }

    // 204 No Content para exclusão bem-sucedida
    return res.status(204).send();
}));

export default router;