import React, { createContext, useState, useContext, useEffect } from 'react';

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
  addResponse: (response: Omit<SurveyResponse, 'id' | 'timestamp'>) => void;
  resetResponses: () => void;
  addMockData: () => void;
}

export const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export const SurveyProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);

  useEffect(() => {
    if (responses.length === 0) {
      addMockData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addResponse = (response: Omit<SurveyResponse, 'id' | 'timestamp'>) => {
    setResponses(prev => [
      ...prev,
      { ...response, id: Math.random().toString(36).substring(7), timestamp: new Date() }
    ]);
  };

  const resetResponses = () => setResponses([]);

  const addMockData = () => {
    const mocks: SurveyResponse[] = Array.from({ length: 99 }).map((_, i) => ({
      id: `mock-${i}`,
      skm: {
        U1: Math.floor(Math.random() * 2) + 3,
        U2: Math.floor(Math.random() * 2) + 3,
        U3: Math.floor(Math.random() * 2) + 3,
        U4: Math.floor(Math.random() * 2) + 3,
        U5: 4,
        U6: Math.floor(Math.random() * 2) + 3,
        U7: Math.floor(Math.random() * 2) + 3,
        U8: Math.floor(Math.random() * 2) + 3,
        U9: Math.floor(Math.random() * 2) + 3,
      },
      perilaku: {
        P1: Math.floor(Math.random() * 2) + 3,
        P2: Math.floor(Math.random() * 2) + 3,
        P3: Math.floor(Math.random() * 2) + 3,
        P4: Math.floor(Math.random() * 2) + 3,
        P5: Math.floor(Math.random() * 2) + 3,
        P6: Math.floor(Math.random() * 2) + 3,
        P7: Math.floor(Math.random() * 2) + 3,
      },
      implementasi: {
        I1: Math.floor(Math.random() * 2) + 3,
        I2: Math.floor(Math.random() * 2) + 3,
        I3: Math.floor(Math.random() * 2) + 3,
      },
      kepuasan: {
        PS1: Math.floor(Math.random() * 2) + 3,
      },
      demografi: {
        jenisKelamin: Math.random() > 0.4 ? 'Laki-laki' : 'Perempuan',
        usia: ['18-25', '26-35', '36-45', '46-55', '>55'][Math.floor(Math.random() * 5)],
        pendidikan: ['SD', 'SMP', 'SMA', 'D3/S1', 'S2/S3'][Math.floor(Math.random() * 5)],
        pekerjaan: ['Petani', 'PNS', 'Wiraswasta', 'Karyawan Swasta', 'Pelajar/Mahasiswa', 'Lainnya'][Math.floor(Math.random() * 6)],
        jenisLayanan: ['Kependudukan', 'Perizinan', 'Pertanahan', 'Kesejahteraan Sosial', 'Administrasi Umum'][Math.floor(Math.random() * 5)],
      },
      komentar: Math.random() > 0.5 ? ['Pelayanan sudah sangat baik, pertahankan.', 'Fasilitas ruang tunggu perlu ditambah kipas angin.', 'Proses surat menyurat sangat cepat dan mudah.', 'Petugas ramah dan informatif.', 'Mohon diperjelas lagi persyaratan untuk surat pengantar RT/RW.'][Math.floor(Math.random() * 5)] : undefined,
      timestamp: new Date()
    }));
    setResponses(mocks);
  }

  return (
    <SurveyContext.Provider value={{ responses, addResponse, resetResponses, addMockData }}>
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (!context) throw new Error('useSurvey must be used within SurveyProvider');
  return context;
}
