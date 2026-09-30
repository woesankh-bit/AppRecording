import React, { useState } from 'react';
import { useApp } from '../context';
import { programs, defaultBK } from '../data';
import { AbsenStatus } from '../types';
import { format } from 'date-fns';
import { Save, CheckCircle } from 'lucide-react';

const AttendanceInput: React.FC = () => {
  const { mahasantriList, absenRecords, addAbsenRecord, updateAbsenRecord } = useApp();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedProgram, setSelectedProgram] = useState(programs[0].id);
  const [selectedCategory, setSelectedCategory] = useState<'harian' | 'pekanan' | 'bulanan'>('harian');
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredPrograms = programs.filter(p => p.kategori === selectedCategory);

  const getExistingRecord = (mhsId: string, progId: string, date: string) => {
    return absenRecords.find(r => 
      r.mahasantriId === mhsId && r.programId === progId && r.tanggal === date
    );
  };

  const handleStatusChange = (mhsId: string, status: AbsenStatus, keterangan: string) => {
    const existing = getExistingRecord(mhsId, selectedProgram, selectedDate);
    
    if (existing) {
      updateAbsenRecord({ ...existing, status, keterangan });
    } else {
      addAbsenRecord({
        id: `absen-${mhsId}-${selectedProgram}-${selectedDate}-${Date.now()}`,
        mahasantriId: mhsId,
        programId: selectedProgram,
        tanggal: selectedDate,
        status,
        keterangan,
        bk: { ...defaultBK },
      });
    }
  };

  const handleBulkSave = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Input Absensi</h1>
        {showSuccess && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg animate-pulse">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Data berhasil disimpan!</span>
          </div>
        )}
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Program</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value as 'harian' | 'pekanan' | 'bulanan');
                const filtered = programs.filter(p => p.kategori === e.target.value);
                if (filtered.length > 0) setSelectedProgram(filtered[0].id);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="harian">Harian</option>
              <option value="pekanan">Pekan</option>
              <option value="bulanan">Bulanan</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {filteredPrograms.map(p => (
                <option key={p.id} value={p.id}>{p.nama}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nama</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">NIM</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mahasantriList.map((mhs, index) => {
                const existing = getExistingRecord(mhs.id, selectedProgram, selectedDate);
                return (
                  <AttendanceRow
                    key={mhs.id}
                    index={index + 1}
                    mhs={mhs}
                    existing={existing}
                    onStatusChange={handleStatusChange}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={handleBulkSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            <Save className="w-4 h-4" />
            Simpan Absensi
          </button>
        </div>
      </div>
    </div>
  );
};

interface AttendanceRowProps {
  index: number;
  mhs: { id: string; nama: string; nim: string };
  existing: { status: AbsenStatus; keterangan: string } | undefined;
  onStatusChange: (mhsId: string, status: AbsenStatus, keterangan: string) => void;
}

const AttendanceRow: React.FC<AttendanceRowProps> = ({ index, mhs, existing, onStatusChange }) => {
  const [status, setStatus] = useState<AbsenStatus>(existing?.status || 'hadir');
  const [keterangan, setKeterangan] = useState(existing?.keterangan || '');

  const handleStatusChange = (newStatus: AbsenStatus) => {
    setStatus(newStatus);
    onStatusChange(mhs.id, newStatus, keterangan);
  };

  const handleKeteranganChange = (val: string) => {
    setKeterangan(val);
    onStatusChange(mhs.id, status, val);
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-600">{index}</td>
      <td className="px-4 py-3 text-sm font-medium text-gray-800">{mhs.nama}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{mhs.nim}</td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-center gap-1">
          {(['hadir', 'sakit', 'izin', 'alpa'] as AbsenStatus[]).map(s => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                status === s
                  ? s === 'hadir' ? 'bg-green-500 text-white' :
                    s === 'sakit' ? 'bg-yellow-500 text-white' :
                    s === 'izin' ? 'bg-blue-500 text-white' :
                    'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </td>
      <td className="px-4 py-3">
        <input
          type="text"
          value={keterangan}
          onChange={(e) => handleKeteranganChange(e.target.value)}
          placeholder="Keterangan..."
          className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </td>
    </tr>
  );
};

export default AttendanceInput;
