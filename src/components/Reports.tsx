import React, { useState, useMemo } from 'react';
import { useApp } from '../context';
import { programs } from '../data';
import { ReportFilter, DateRange } from '../types';
import { filterRecords, calculateStats, getStatusLabel, getStatusColor, formatDateShort } from '../utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, FileText, Filter } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'];

const Reports: React.FC = () => {
  const { mahasantriList, absenRecords } = useApp();
  const [filter, setFilter] = useState<ReportFilter>({
    mahasantriId: 'all',
    dateRange: '1minggu',
    startDate: '',
    endDate: '',
    programId: 'all',
  });

  const filteredRecords = useMemo(() => filterRecords(absenRecords, filter), [absenRecords, filter]);
  const stats = useMemo(() => calculateStats(filteredRecords), [filteredRecords]);

  const pieData = useMemo(() => [
    { name: 'Hadir', value: stats.hadir },
    { name: 'Sakit', value: stats.sakit },
    { name: 'Izin', value: stats.izin },
    { name: 'Alpa', value: stats.alpa },
  ], [stats]);

  const programChartData = useMemo(() => {
    const progMap = new Map<string, { hadir: number; sakit: number; izin: number; alpa: number }>();
    filteredRecords.forEach(r => {
      if (!progMap.has(r.programId)) {
        progMap.set(r.programId, { hadir: 0, sakit: 0, izin: 0, alpa: 0 });
      }
      const data = progMap.get(r.programId)!;
      data[r.status]++;
    });
    return Array.from(progMap.entries()).map(([progId, data]) => {
      const prog = programs.find(p => p.id === progId);
      return {
        nama: prog?.nama || progId,
        Hadir: data.hadir,
        Sakit: data.sakit,
        Izin: data.izin,
        Alpa: data.alpa,
      };
    });
  }, [filteredRecords]);

  const getDateRangeLabel = (): string => {
    switch (filter.dateRange) {
      case '1minggu': return '1 Minggu Terakhir';
      case '1bulan': return '1 Bulan Terakhir';
      case '1semester': return '1 Semester Terakhir';
      case '1tahun': return '1 Tahun Terakhir';
      case 'semua': return 'Seluruh Data';
      default: return 'Periode Kustom';
    }
  };

  const getStudentLabel = (): string => {
    if (filter.mahasantriId === 'all') return 'Semua Mahasantri';
    return mahasantriList.find(m => m.id === filter.mahasantriId)?.nama || 'Unknown';
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Title
    doc.setFontSize(16);
    doc.text('LAPORAN ABSENSI MAHASANTRI', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Ma\'had Aly', pageWidth / 2, 28, { align: 'center' });
    
    // Info
    doc.setFontSize(10);
    doc.text(`Periode: ${getDateRangeLabel()}`, 14, 40);
    doc.text(`Mahasantri: ${getStudentLabel()}`, 14, 47);
    doc.text(`Program: ${filter.programId === 'all' ? 'Semua Program' : programs.find(p => p.id === filter.programId)?.nama}`, 14, 54);
    doc.text(`Total Record: ${filteredRecords.length}`, 14, 61);

    // Stats Summary
    doc.setFontSize(11);
    doc.text('Ringkasan:', 14, 72);
    doc.setFontSize(10);
    doc.text(`Hadir: ${stats.hadir} (${stats.persentaseHadir}%)`, 14, 79);
    doc.text(`Sakit: ${stats.sakit} (${stats.persentaseSakit}%)`, 14, 86);
    doc.text(`Izin: ${stats.izin} (${stats.persentaseIzin}%)`, 14, 93);
    doc.text(`Alpa: ${stats.alpa} (${stats.persentaseAlpa}%)`, 14, 100);

    // Table
    const tableData = filteredRecords.slice(0, 200).map(r => {
      const mhs = mahasantriList.find(m => m.id === r.mahasantriId);
      const prog = programs.find(p => p.id === r.programId);
      return [
        mhs?.nama || '-',
        mhs?.nim || '-',
        prog?.nama || '-',
        formatDateShort(r.tanggal),
        getStatusLabel(r.status),
        r.keterangan || '-',
      ];
    });

    autoTable(doc, {
      startY: 108,
      head: [['Nama', 'NIM', 'Program', 'Tanggal', 'Status', 'Keterangan']],
      body: tableData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [79, 70, 229] },
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Halaman ${i} dari ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    }

    doc.save(`Laporan_Absensi_${filter.dateRange}_${Date.now()}.pdf`);
  };

  const exportCSV = () => {
    const headers = ['Nama', 'NIM', 'Program', 'Tanggal', 'Status', 'Keterangan'];
    const rows = filteredRecords.map(r => {
      const mhs = mahasantriList.find(m => m.id === r.mahasantriId);
      const prog = programs.find(p => p.id === r.programId);
      return [
        mhs?.nama || '',
        mhs?.nim || '',
        prog?.nama || '',
        r.tanggal,
        getStatusLabel(r.status),
        r.keterangan || '',
      ];
    });

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Laporan_Absensi_${filter.dateRange}_${Date.now()}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Laporan & Export</h1>
        <div className="flex gap-2">
          <button
            onClick={exportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            <FileText className="w-4 h-4" />
            Export PDF
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filter Laporan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Mahasantri</label>
            <select
              value={filter.mahasantriId}
              onChange={(e) => setFilter(f => ({ ...f, mahasantriId: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Semua Mahasantri</option>
              {mahasantriList.map(m => (
                <option key={m.id} value={m.id}>{m.nama} ({m.nim})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Periode</label>
            <select
              value={filter.dateRange}
              onChange={(e) => setFilter(f => ({ ...f, dateRange: e.target.value as DateRange }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="1minggu">1 Minggu Terakhir</option>
              <option value="1bulan">1 Bulan Terakhir</option>
              <option value="1semester">1 Semester Terakhir</option>
              <option value="1tahun">1 Tahun Terakhir</option>
              <option value="semua">Seluruh Data (Sejak Mondok)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Program</label>
            <select
              value={filter.programId}
              onChange={(e) => setFilter(f => ({ ...f, programId: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Semua Program</option>
              {programs.map(p => (
                <option key={p.id} value={p.id}>{p.nama}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Tanggal Custom</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={filter.startDate}
                onChange={(e) => setFilter(f => ({ ...f, startDate: e.target.value }))}
                className="flex-1 px-2 py-2 text-xs border border-gray-300 rounded-lg"
              />
              <input
                type="date"
                value={filter.endDate}
                onChange={(e) => setFilter(f => ({ ...f, endDate: e.target.value }))}
                className="flex-1 px-2 py-2 text-xs border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <p className="text-sm text-green-600">Hadir</p>
          <p className="text-2xl font-bold text-green-700">{stats.hadir}</p>
          <p className="text-xs text-green-600">{stats.persentaseHadir}%</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
          <p className="text-sm text-yellow-600">Sakit</p>
          <p className="text-2xl font-bold text-yellow-700">{stats.sakit}</p>
          <p className="text-xs text-yellow-600">{stats.persentaseSakit}%</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <p className="text-sm text-blue-600">Izin</p>
          <p className="text-2xl font-bold text-blue-700">{stats.izin}</p>
          <p className="text-xs text-blue-600">{stats.persentaseIzin}%</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-200">
          <p className="text-sm text-red-600">Alpa</p>
          <p className="text-2xl font-bold text-red-700">{stats.alpa}</p>
          <p className="text-xs text-red-600">{stats.persentaseAlpa}%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Distribusi Status</h3>
          <ResponsiveContainer width="100%" height={250}>
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Per Program</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={programChartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nama" fontSize={10} angle={-30} textAnchor="end" />
              <YAxis fontSize={10} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Hadir" fill="#10b981" />
              <Bar dataKey="Sakit" fill="#f59e0b" />
              <Bar dataKey="Izin" fill="#3b82f6" />
              <Bar dataKey="Alpa" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">
            Data Absensi ({filteredRecords.length} record)
          </h3>
        </div>
        <div className="overflow-x-auto max-h-96">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Nama</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">NIM</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Program</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Tanggal</th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600">Status</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRecords.slice(0, 100).map(r => {
                const mhs = mahasantriList.find(m => m.id === r.mahasantriId);
                const prog = programs.find(p => p.id === r.programId);
                return (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-800">{mhs?.nama}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{mhs?.nim}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{prog?.nama}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{formatDateShort(r.tanggal)}</td>
                    <td className="px-4 py-2 text-center">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(r.status)}`}>
                        {getStatusLabel(r.status)}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">{r.keterangan || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredRecords.length > 100 && (
          <div className="p-3 bg-gray-50 text-center text-xs text-gray-500">
            Menampilkan 100 dari {filteredRecords.length} data. Export PDF/CSV untuk data lengkap.
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
