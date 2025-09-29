import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import tarefasRoutes from './routes/tarefasRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/tarefas', tarefasRoutes);

export default app;
//app.listen(port, () => {
//  console.log(`Server running at http://localhost:${port}`);
//});