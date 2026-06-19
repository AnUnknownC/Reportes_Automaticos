import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import registerRoutes from './src/routes/register.routes.js';
import loginRoutes    from './src/routes/login.routes.js';
import clientsRoutes  from './src/routes/clients.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', registerRoutes);
app.use('/auth', loginRoutes);
app.use('/clients', clientsRoutes);

app.listen(3000, () => console.log('Backend corriendo en :3000'));