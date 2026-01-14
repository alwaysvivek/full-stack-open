"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const medicalConditions_1 = __importDefault(require("../../data/medicalConditions"));
const getMedicalConditions = () => {
    return medicalConditions_1.default;
};
exports.default = {
    getMedicalConditions
};
