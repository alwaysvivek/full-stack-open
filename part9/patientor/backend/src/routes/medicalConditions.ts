import express from "express";
import medicalConditionService from "../services/medicalConditionService";

const router = express.Router();

router.get("/", (_req, res) => {
  const medicalConditions = medicalConditionService.getMedicalConditions();
  res.json(medicalConditions);
});

export default router;
