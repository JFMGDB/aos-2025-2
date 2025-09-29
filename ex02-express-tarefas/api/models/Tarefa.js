import { validate } from "uuid"

const getTarefaModel = (sequelize, DataTypes) => {
    const Tarefa = sequelize.define('Tarefa', {
        descricao: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true,  // Não pode ser uma string vazia
            },
        },
        concluida: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        objectId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            validate: {
                isUUID: 4,
            },
        },
    });

    return Tarefa;
}

export default getTarefaModel;