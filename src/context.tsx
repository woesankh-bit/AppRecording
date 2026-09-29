import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Mahasantri, AbsenRecord } from './types';
import { sampleMahasantri, generateSampleAbsen, defaultBK } from './data';

interface AppState {
  mahasantriList: Mahasantri[];
  absenRecords: AbsenRecord[];
  addAbsenRecord: (record: AbsenRecord) => void;
  updateAbsenRecord: (record: AbsenRecord) => void;
  deleteAbsenRecord: (id: string) => void;
  addMahasantri: (mhs: Mahasantri) => void;
  updateMahasantri: (mhs: Mahasantri) => void;
  deleteMahasantri: (id: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mahasantriList, setMahasantriList] = useState<Mahasantri[]>(() => {
    const saved = localStorage.getItem('mahasantri-list');
    return saved ? JSON.parse(saved) : sampleMahasantri;
  });

  const [absenRecords, setAbsenRecords] = useState<AbsenRecord[]>(() => {
    const saved = localStorage.getItem('absen-records');
    if (saved) {
      const parsed: AbsenRecord[] = JSON.parse(saved);
      // Backward compatibility: add default BK data if missing
      return parsed.map(r => ({
        ...r,
        bk: r.bk || { ...defaultBK },
      }));
    }
    return generateSampleAbsen();
  });

  useEffect(() => {
    localStorage.setItem('mahasantri-list', JSON.stringify(mahasantriList));
  }, [mahasantriList]);

  useEffect(() => {
    localStorage.setItem('absen-records', JSON.stringify(absenRecords));
  }, [absenRecords]);

  const addAbsenRecord = (record: AbsenRecord) => {
    setAbsenRecords(prev => [...prev, record]);
  };

  const updateAbsenRecord = (record: AbsenRecord) => {
    setAbsenRecords(prev => prev.map(r => r.id === record.id ? record : r));
  };

  const deleteAbsenRecord = (id: string) => {
    setAbsenRecords(prev => prev.filter(r => r.id !== id));
  };

  const addMahasantri = (mhs: Mahasantri) => {
    setMahasantriList(prev => [...prev, mhs]);
  };

  const updateMahasantri = (mhs: Mahasantri) => {
    setMahasantriList(prev => prev.map(m => m.id === mhs.id ? mhs : m));
  };

  const deleteMahasantri = (id: string) => {
    setMahasantriList(prev => prev.filter(m => m.id !== id));
    setAbsenRecords(prev => prev.filter(r => r.mahasantriId !== id));
  };

  return (
    <AppContext.Provider value={{
      mahasantriList,
      absenRecords,
      addAbsenRecord,
      updateAbsenRecord,
      deleteAbsenRecord,
      addMahasantri,
      updateMahasantri,
      deleteMahasantri,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppState => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
