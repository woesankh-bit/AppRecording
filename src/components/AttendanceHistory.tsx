import React, { useState, useMemo } from 'react';
import { useApp } from '../context';
import { programs } from '../data';
import { getStatusLabel, getStatusColor, formatDateShort } from '../utils';
import { Search, Filter } from 'lucide-react';

const AttendanceHistory: React.FC = () => {
  const { mahasantriList, absenRecords } = useApp();
  const [searchName, setSearchName] = useState('');
  const [filterProgram, setFilterProgram] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');

  const filteredRecords = useMemo(() => {
    return absenRecords
      .filter(r => {
        const mhs = mahasantriList.find(m => m.id === r.mahasantriId);
        const matchesName = !searchName || (mhs?.nama.toLowerCase().includes(searchName.toLowerCase()));
        const matchesProgram = filterProgram === 'all' || r.programId === filterProgram;
        const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
        const matchesDate = !filterDate || r.tanggal === filterDate;
        return matchesName && matchesProgram && matchesStatus && matchesDate;
      })
      .sort((a, b) => b.tanggal.localeCompare(a.tanggal))
      .slice(0, 200);
  }, [absenRecords, mahasantriList, searchName, filterProgram, filterStatus, filterDate]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Riwayat Absensi</h1>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Cari nama..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <select
              value={filterProgram}
              onChange={(e) => setFilterProgram(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Semua Program</option>
              {programs.map(p => (
                <option key={p.id} value={p.id}>{p.nama}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Semua Status</option>
              <option value="hadir">Hadir</option>
              <option value="sakit">Sakit</option>
              <option value="izin">Izin</option>
              <option value="alpa">Alpa</option>
            </select>
          </div>
          <div>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            <span>{filteredRecords.length} data ditemukan</span>
          </div>
        </div>
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nama</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">NIM</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Program</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tanggal</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRecords.map(r => {
                const mhs = mahasantriList.find(m => m.id === r.mahasantriId);
                const prog = programs.find(p => p.id === r.programId);
                return (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 text-sm font-medium text-gray-800">{mhs?.nama}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-600">{mhs?.nim}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-600">{prog?.nama}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-600">{formatDateShort(r.tanggal)}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusColor(r.status)}`}>
                        {getStatusLabel(r.status)}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-sm text-gray-600">{r.keterangan || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistory;
