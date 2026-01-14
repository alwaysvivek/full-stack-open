import diaryData from '../../data/entries';

import {
  PublicFlightRecord, FlightRecord, NewFlightRecord
} from '../types';

const flightRecords: FlightRecord[] = diaryData;

const getRecords = (): FlightRecord[] => {
  return flightRecords;
};

const getPublicRecords = (): PublicFlightRecord[] => {
  return flightRecords.map(({ id, date, weather, visibility }) => ({
    id,
    date,
    weather,
    visibility,
  }));
};

const findById = (id: number): FlightRecord | undefined => {
  const entry = flightRecords.find(d => d.id === id);
  return entry;
};

const addRecord = (entry: NewFlightRecord): FlightRecord => {
  const newFlightRecord = {
    id: Math.max(...flightRecords.map(d => d.id)) + 1,
    ...entry
  };

  flightRecords.push(newFlightRecord);
  return newFlightRecord;
};

export default {
  getRecords,
  addRecord,
  getPublicRecords,
  findById
};