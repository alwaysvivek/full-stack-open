import express from 'express';
import cors from 'cors';
import medicalConditionRouter from './routes/medicalConditions';
import clientRouter from './routes/clients';
import pingRouter from './routes/ping';

const app = express();

const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];

const options: cors.CorsOptions = {
  origin: allowedOrigins
};

app.use(cors(options));

app.use(express.json());

const PORT = 3001;

app.use("/api/medicalConditions", medicalConditionRouter);
app.use("/api/clients", clientRouter);
app.use("/api/ping", pingRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
