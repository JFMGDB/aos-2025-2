import { Router } from "express";

const router = Router();

const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
        console.error(error); 
        res.status(500).json({ error: "Internal Server Error" });
    });
};

router.get("/", asyncHandler(async (req, res) => {
    const messages = await req.context.models.Message.findAll({
        include: [{ model: req.context.models.User }]
    });
    return res.status(200).json(messages);
}));

router.get("/:messageId", asyncHandler(async (req, res) => {
    const message = await req.context.models.Message.findByPk(req.params.messageId, {
        include: [{ model: req.context.models.User }]
    });

    if (!message) {
        return res.status(404).json({ error: "Message not found" });
    }
    return res.status(200).json(message);
}));

router.post("/", asyncHandler(async (req, res) => {
    if (!req.context.me) {
        return res.status(401).json({ error: "Unauthorized. User context missing." });
    }
    
    const newMessage = await req.context.models.Message.create({
        text: req.body.text,
        userId: req.context.me.id, 
    });

    return res.status(201).json(newMessage);
}));

router.put("/:messageId", asyncHandler(async (req, res) => {
    const { text } = req.body;
    const [updatedCount] = await req.context.models.Message.update({ text }, {
        where: { id: req.params.messageId }
    });

    if (updatedCount === 0) {
        return res.status(404).json({ error: "Message not found" });
    }

    const updatedMessage = await req.context.models.Message.findByPk(req.params.messageId, {
        include: [{ model: req.context.models.User }]
    });
    return res.status(200).json(updatedMessage);
}));


router.delete("/:messageId", asyncHandler(async (req, res) => {
    const deleted = await req.context.models.Message.destroy({
        where: { id: req.params.messageId }
    });

    if (deleted === 0) {
        return res.status(404).json({ error: "Message not found" });
    }

    return res.status(204).send();
}));

export default router;