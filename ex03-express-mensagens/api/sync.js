import dotenv from 'dotenv';
dotenv.config();

// Corrija a linha de importação para pegar tanto 'models' quanto 'sequelize'
import models, { sequelize } from './models/index.js';

const syncDatabase = async () => {
  try {
    // Agora use a variável 'sequelize' que foi importada diretamente
    await sequelize.sync({ force: true });
    console.log('✅ Banco de dados sincronizado com sucesso! A tabela "Tarefas" foi criada.');
  } catch (error) {
    console.error('❌ Erro ao sincronizar o banco de dados:', error);
  } finally {
    // Use 'sequelize' aqui também
    await sequelize.close();
    console.log('Conexão com o banco de dados fechada.');
  }
};

syncDatabase();