"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const medicalConditionService_1 = __importDefault(require("../services/medicalConditionService"));
const router = express_1.default.Router();
router.get("/", (_req, res) => {
    const medicalConditions = medicalConditionService_1.default.getMedicalConditions();
    res.json(medicalConditions);
});
exports.default = router;
