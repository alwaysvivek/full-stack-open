import axios from "axios";
import { MedicalCondition } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data: medicalConditions } = await axios.get<MedicalCondition[]>(`${apiBaseUrl}/medicalConditions`);
  return medicalConditions;
};

export default {
  getAll
};
