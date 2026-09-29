import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useApp } from '../context';
import { programs } from '../data';
import { calculateStats, filterRecords } from '../utils';
import { Users, BookOpen, Calendar, TrendingUp } from 'lucide-react';

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'];

const Dashboard: React.FC = () => {
  const { mahasantriList, absenRecords } = useApp();

  const stats = useMemo(() => calculateStats(absenRecords), [absenRecords]);

  const pieData = useMemo(() => [
    { name: 'Hadir', value: stats.hadir },
    { name: 'Sakit', value: stats.sakit },
    { name: 'Izin', value: stats.izin },
    { name: 'Alpa', value: stats.alpa },
  ], [stats]);

  const programStats = useMemo(() => {
    return programs.map(prog => {
      const progRecords = absenRecords.filter(r => r.programId === prog.id);
      const progStats = calculateStats(progRecords);
      return {
        nama: prog.nama.length > 15 ? prog.nama.substring(0, 15) + '...' : prog.nama,
        Hadir: progStats.hadir,
        Sakit: progStats.sakit,
        Izin: progStats.izin,
        Alpa: progStats.alpa,
      };
    });
  }, [absenRecords]);

  const dailyPrograms = programs.filter(p => p.kategori === 'harian');
  const weeklyPrograms = programs.filter(p => p.kategori === 'pekanan');
  const monthlyPrograms = programs.filter(p => p.kategori === 'bulanan');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Kemahasantrian</h1>
        <span className="text-sm text-gray-500">Data keseluruhan</span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Mahasantri</p>
              <p className="text-2xl font-bold text-gray-800">{mahasantriList.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Program</p>
              <p className="text-2xl font-bold text-gray-800">{programs.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 rounded-lg">
              <Calendar className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Record</p>
              <p className="text-2xl font-bold text-gray-800">{absenRecords.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">% Kehadiran</p>
              <p className="text-2xl font-bold text-gray-800">{stats.persentaseHadir}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribusi Kehadiran</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Ringkasan Kehadiran</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="font-medium text-green-700">Hadir</span>
              <div className="text-right">
                <span className="text-lg font-bold text-green-700">{stats.hadir}</span>
                <span className="text-sm text-green-600 ml-2">({stats.persentaseHadir}%)</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="font-medium text-yellow-700">Sakit</span>
              <div className="text-right">
                <span className="text-lg font-bold text-yellow-700">{stats.sakit}</span>
                <span className="text-sm text-yellow-600 ml-2">({stats.persentaseSakit}%)</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="font-medium text-blue-700">Izin</span>
              <div className="text-right">
                <span className="text-lg font-bold text-blue-700">{stats.izin}</span>
                <span className="text-sm text-blue-600 ml-2">({stats.persentaseIzin}%)</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="font-medium text-red-700">Alpa</span>
              <div className="text-right">
                <span className="text-lg font-bold text-red-700">{stats.alpa}</span>
                <span className="text-sm text-red-600 ml-2">({stats.persentaseAlpa}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart by Program */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Kehadiran per Program</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={programStats} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nama" angle={-45} textAnchor="end" fontSize={11} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Hadir" fill="#10b981" />
            <Bar dataKey="Sakit" fill="#f59e0b" />
            <Bar dataKey="Izin" fill="#3b82f6" />
            <Bar dataKey="Alpa" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Program Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Program Harian ({dailyPrograms.length})
          </h4>
          <ul className="space-y-1">
            {dailyPrograms.map(p => (
              <li key={p.id} className="text-sm text-gray-600 pl-4">• {p.nama}</li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Program Pekan ({weeklyPrograms.length})
          </h4>
          <ul className="space-y-1">
            {weeklyPrograms.map(p => (
              <li key={p.id} className="text-sm text-gray-600 pl-4">• {p.nama}</li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            Program Bulanan ({monthlyPrograms.length})
          </h4>
          <ul className="space-y-1">
            {monthlyPrograms.map(p => (
              <li key={p.id} className="text-sm text-gray-600 pl-4">• {p.nama}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
