import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { INITIAL_RESPONSES } from '../data/seedData';

export interface SurveyDemografi {
  jenisKelamin: string;
  usia: string;
  pendidikan: string;
  pekerjaan: string;
  jenisLayanan: string;
}

export interface SurveyResponse {
  id: string;
  skm: Record<string, number>;
  perilaku: Record<string, number>;
  implementasi: Record<string, number>;
  kepuasan: Record<string, number>;
  demografi: SurveyDemografi;
  komentar?: string;
  timestamp: Date;
}

interface SurveyContextType {
  responses: SurveyResponse[];
  loading: boolean;
  error: string | null;
  addResponse: (response: Omit<SurveyResponse, 'id' | 'timestamp'>) => Promise<void>;
  deleteResponse: (id: string) => Promise<void>;
  refreshResponses: () => Promise<void>;
}

const API_BASE = 'http://localhost:3001/api';

export const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export const SurveyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [responses, setResponses] = useState<SurveyResponse[]>(INITIAL_RESPONSES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshResponses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/responses`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      const parsed: SurveyResponse[] = json.data.map((r: any) => ({
        ...r,
        timestamp: new Date(r.timestamp),
      }));
      setResponses(parsed);
    } catch (err: any) {
      console.log('[Context] Menggunakan data awal 215 responden Sijenggung (Client Mode):', err.message);
      setResponses(INITIAL_RESPONSES);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data saat pertama mount
  useEffect(() => {
    refreshResponses();
  }, [refreshResponses]);

  const addResponse = async (response: Omit<SurveyResponse, 'id' | 'timestamp'>) => {
    try {
      const res = await fetch(`${API_BASE}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(response),
      });
      if (res.ok) {
        await refreshResponses();
        return;
      }
    } catch (err) {
      console.log('[Context] Server API offline, menyimpan jawaban ke memori lokal.');
    }
    
    // Fallback Client Mode
    const newEntry: SurveyResponse = {
      ...response,
      id: String(Date.now()),
      timestamp: new Date(),
    };
    setResponses(prev => [newEntry, ...prev]);
  };

  const deleteResponse = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/responses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setResponses(prev => prev.filter(r => r.id !== id));
        return;
      }
    } catch (err) {
      console.log('[Context] Server API offline, menghapus dari memori lokal.');
    }
    setResponses(prev => prev.filter(r => r.id !== id));
  };

  return (
    <SurveyContext.Provider value={{ responses, loading, error, addResponse, deleteResponse, refreshResponses }}>
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (!context) throw new Error('useSurvey must be used within SurveyProvider');
  return context;
};
