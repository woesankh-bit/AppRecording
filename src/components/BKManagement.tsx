import React, { useState, useMemo } from 'react';
import { useApp } from '../context';
import { programs, jenisSanksiOptions, petugasBKOptions } from '../data';
import { AbsenRecord, BKTindakLanjut } from '../types';
import { getStatusLabel, getStatusColor, formatDateShort, formatDate } from '../utils';
import { Shield, AlertTriangle, CheckCircle, Clock, XCircle, Save, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const BKManagement: React.FC = () => {
  const { mahasantriList, absenRecords, updateAbsenRecord } = useApp();
  const [filterStatus, setFilterStatus] = useState<'all' | 'belum' | 'proses' | 'selesai'>('belum');
  const [filterAbsen, setFilterAbsen] = useState<'all' | 'sakit' | 'izin' | 'alpa'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, BKTindakLanjut>>({});

  // Ambil hanya record yang tidak hadir
  const nonHadirRecords = useMemo(() => {
    return absenRecords
      .filter(r => r.status !== 'hadir')
      .filter(r => filterAbsen === 'all' || r.status === filterAbsen)
      .filter(r => {
        if (filterStatus === 'all') return true;
        return r.bk.statusPenyelesaian === filterStatus;
      })
      .sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  }, [absenRecords, filterStatus, filterAbsen]);

  // Stats
  const stats = useMemo(() => {
    const allNonHadir = absenRecords.filter(r => r.status !== 'hadir');
    const ditindaklanjuti = allNonHadir.filter(r => r.bk.sudahDitindaklanjuti).length;
    const belum = allNonHadir.filter(r => !r.bk.sudahDitindaklanjuti).length;
    const proses = allNonHadir.filter(r => r.bk.statusPenyelesaian === 'proses').length;
    const selesai = allNonHadir.filter(r => r.bk.statusPenyelesaian === 'selesai').length;
    return {
      total: allNonHadir.length,
      ditindaklanjuti,
      belum,
      proses,
      selesai,
      persentase: allNonHadir.length > 0 ? ((ditindaklanjuti / allNonHadir.length) * 100).toFixed(1) : '0',
    };
  }, [absenRecords]);

  const chartData = useMemo(() => {
    const byStatus = {
      'Sakit': absenRecords.filter(r => r.status === 'sakit').length,
      'Izin': absenRecords.filter(r => r.status === 'izin').length,
      'Alpa': absenRecords.filter(r => r.status === 'alpa').length,
    };
    return Object.entries(byStatus).map(([name, value]) => ({ name, value }));
  }, [absenRecords]);

  const pieData = useMemo(() => [
    { name: 'Selesai', value: stats.selesai },
    { name: 'Proses', value: stats.proses },
    { name: 'Belum', value: stats.belum },
  ], [stats]);

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  const handleBKUpdate = (recordId: string) => {
    const record = absenRecords.find(r => r.id === recordId);
    if (!record) return;
    const bkData = editData[recordId] || record.bk;
    updateAbsenRecord({
      ...record,
      bk: {
        ...bkData,
        sudahDitindaklanjuti: true,
        statusPenyelesaian: bkData.statusPenyelesaian || 'proses',
      },
    });
    setExpandedId(null);
  };

  const startEdit = (record: AbsenRecord) => {
    setEditData(prev => ({
      ...prev,
      [record.id]: { ...record.bk },
    }));
    setExpandedId(record.id);
  };

  const updateEditField = (recordId: string, field: keyof BKTindakLanjut, value: any) => {
    setEditData(prev => ({
      ...prev,
      [recordId]: {
        ...prev[recordId],
        [field]: value,
      },
    }));
  };

  const getPenyelesaianBadge = (status: string) => {
    switch (status) {
      case 'selesai':
        return <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700"><CheckCircle className="w-3 h-3" />Selesai</span>;
      case 'proses':
        return <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700"><Clock className="w-3 h-3" />Proses</span>;
      case 'belum':
        return <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700"><XCircle className="w-3 h-3" />Belum</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Shield className="w-7 h-7 text-indigo-600" />
            Bimbingan Konseling
          </h1>
          <p className="text-sm text-gray-500 mt-1">Tindak lanjut absensi mahasantri</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">Total Tidak Hadir</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4">
          <p className="text-xs text-green-600 uppercase font-medium">Selesai</p>
          <p className="text-2xl font-bold text-green-700 mt-1">{stats.selesai}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
          <p className="text-xs text-yellow-600 uppercase font-medium">Dalam Proses</p>
          <p className="text-2xl font-bold text-yellow-700 mt-1">{stats.proses}</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4">
          <p className="text-xs text-red-600 uppercase font-medium">Belum Ditindaklanjuti</p>
          <p className="text-2xl font-bold text-red-700 mt-1">{stats.belum}</p>
        </div>
        <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-4">
          <p className="text-xs text-indigo-600 uppercase font-medium">% Tindak Lanjut</p>
          <p className="text-2xl font-bold text-indigo-700 mt-1">{stats.persentase}%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Distribusi Ketidakhadiran</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Status Tindak Lanjut</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Status Tindak Lanjut</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Semua Status</option>
              <option value="belum">Belum Ditindaklanjuti</option>
              <option value="proses">Dalam Proses</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Jenis Ketidakhadiran</label>
            <select
              value={filterAbsen}
              onChange={(e) => setFilterAbsen(e.target.value as any)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Semua (Sakit, Izin, Alpa)</option>
              <option value="sakit">Sakit</option>
              <option value="izin">Izin</option>
              <option value="alpa">Alpa</option>
            </select>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">
            Daftar Tindak Lanjut ({nonHadirRecords.length} data)
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Klik baris untuk membuka form tindak lanjut</span>
          </div>
        </div>
        <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
          {nonHadirRecords.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto text-green-400 mb-3" />
              <p className="font-medium">Tidak ada data yang perlu ditindaklanjuti</p>
              <p className="text-sm">Semua absensi sudah ditindaklanjuti</p>
            </div>
          ) : (
            nonHadirRecords.map(record => {
              const mhs = mahasantriList.find(m => m.id === record.mahasantriId);
              const prog = programs.find(p => p.id === record.programId);
              const isExpanded = expandedId === record.id;
              const currentBK = editData[record.id] || record.bk;

              return (
                <div key={record.id} className="hover:bg-gray-50">
                  {/* Main Row */}
                  <div
                    className="px-4 py-3 flex items-center gap-4 cursor-pointer"
                    onClick={() => isExpanded ? setExpandedId(null) : startEdit(record)}
                  >
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      record.bk.statusPenyelesaian === 'selesai' ? 'bg-green-500' :
                      record.bk.statusPenyelesaian === 'proses' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <div className="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-6 gap-2 items-center">
                      <div className="col-span-2 md:col-span-1">
                        <p className="text-sm font-medium text-gray-800 truncate">{mhs?.nama}</p>
                        <p className="text-xs text-gray-500">{mhs?.nim}</p>
                      </div>
                      <div className="hidden md:block">
                        <p className="text-xs text-gray-500">Program</p>
                        <p className="text-sm text-gray-700 truncate">{prog?.nama}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Tanggal</p>
                        <p className="text-sm text-gray-700">{formatDateShort(record.tanggal)}</p>
                      </div>
                      <div>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}>
                          {getStatusLabel(record.status)}
                        </span>
                      </div>
                      <div className="hidden md:block">
                        {getPenyelesaianBadge(record.bk.statusPenyelesaian)}
                      </div>
                      <div className="flex justify-end">
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Form */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 bg-indigo-50/50 border-t border-indigo-100">
                      <div className="bg-white rounded-lg p-4 border border-indigo-100">
                        <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <Shield className="w-4 h-4 text-indigo-600" />
                          Form Tindak Lanjut BK
                        </h4>
                        
                        {/* Info Absen */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-xs text-gray-500">Mahasantri</p>
                            <p className="text-sm font-medium">{mhs?.nama}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Program</p>
                            <p className="text-sm font-medium">{prog?.nama}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Tanggal Absen</p>
                            <p className="text-sm font-medium">{formatDateShort(record.tanggal)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Alasan</p>
                            <p className="text-sm font-medium">{record.keterangan || getStatusLabel(record.status)}</p>
                          </div>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Petugas BK</label>
                            <select
                              value={currentBK.petugasBK}
                              onChange={(e) => updateEditField(record.id, 'petugasBK', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="">-- Pilih Petugas --</option>
                              {petugasBKOptions.map(p => (
                                <option key={p} value={p}>{p}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Tanggal Tindak Lanjut</label>
                            <input
                              type="date"
                              value={currentBK.tanggalTindakLanjut}
                              onChange={(e) => updateEditField(record.id, 'tanggalTindakLanjut', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Jenis Sanksi</label>
                            <select
                              value={currentBK.jenisSanksi}
                              onChange={(e) => updateEditField(record.id, 'jenisSanksi', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="">-- Pilih Sanksi --</option>
                              {jenisSanksiOptions.map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Status Penyelesaian</label>
                            <select
                              value={currentBK.statusPenyelesaian}
                              onChange={(e) => updateEditField(record.id, 'statusPenyelesaian', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="belum">Belum Ditindaklanjuti</option>
                              <option value="proses">Dalam Proses</option>
                              <option value="selesai">Selesai</option>
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Catatan BK</label>
                            <textarea
                              value={currentBK.catatanBK}
                              onChange={(e) => updateEditField(record.id, 'catatanBK', e.target.value)}
                              rows={2}
                              placeholder="Tuliskan catatan tindak lanjut..."
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
                            />
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
                          <button
                            onClick={() => setExpandedId(null)}
                            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                          >
                            Batal
                          </button>
                          <button
                            onClick={() => handleBKUpdate(record.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 font-medium"
                          >
                            <Save className="w-4 h-4" />
                            Simpan Tindak Lanjut
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default BKManagement;
