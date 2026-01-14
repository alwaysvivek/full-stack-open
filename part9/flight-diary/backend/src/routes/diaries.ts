import express from 'express';

import diaryService from '../services/diaryService';

import toNewFlightRecord from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(diaryService.getPublicRecords());
});

router.get('/:id', (req, res) => {
  const diary = diaryService.findById(Number(req.params.id));

  if (diary) {
    res.send(diary);
  } else {
    res.sendStatus(404);
  }
});

router.post('/', (req, res) => {
  try {
    const newFlightRecord = toNewFlightRecord(req.body);
    const addedEntry = diaryService.addRecord(newFlightRecord);
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;