"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const medicalConditions_1 = __importDefault(require("./routes/medicalConditions"));
const clients_1 = __importDefault(require("./routes/clients"));
const ping_1 = __importDefault(require("./routes/ping"));
const app = (0, express_1.default)();
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];
const options = {
    origin: allowedOrigins
};
app.use((0, cors_1.default)(options));
app.use(express_1.default.json());
const PORT = 3001;
app.use("/api/medicalConditions", medicalConditions_1.default);
app.use("/api/clients", clients_1.default);
app.use("/api/ping", ping_1.default);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
