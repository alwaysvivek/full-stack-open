import diagnoseData from '../../data/medicalConditions';
import { MedicalCondition } from '../types';

const getMedicalConditions = (): Array<MedicalCondition> => {
  return diagnoseData;
};

export default {
  getMedicalConditions
};
