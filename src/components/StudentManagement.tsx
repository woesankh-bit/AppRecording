import React, { useState } from 'react';
import { useApp } from '../context';
import { Mahasantri } from '../types';
import { UserPlus, Edit2, Trash2, X, Save } from 'lucide-react';

const StudentManagement: React.FC = () => {
  const { mahasantriList, addMahasantri, updateMahasantri, deleteMahasantri, absenRecords } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingMhs, setEditingMhs] = useState<Mahasantri | null>(null);
  const [formData, setFormData] = useState<Omit<Mahasantri, 'id'>>({
    nama: '',
    nim: '',
    angkatan: '',
    tanggalMasuk: '',
    kamar: '',
  });

  const handleSubmit = () => {
    if (!formData.nama || !formData.nim) return;
    
    if (editingMhs) {
      updateMahasantri({ ...editingMhs, ...formData });
    } else {
      addMahasantri({
        id: `mhs-${Date.now()}`,
        ...formData,
      });
    }
    resetForm();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingMhs(null);
    setFormData({ nama: '', nim: '', angkatan: '', tanggalMasuk: '', kamar: '' });
  };

  const handleEdit = (mhs: Mahasantri) => {
    setEditingMhs(mhs);
    setFormData({
      nama: mhs.nama,
      nim: mhs.nim,
      angkatan: mhs.angkatan,
      tanggalMasuk: mhs.tanggalMasuk,
      kamar: mhs.kamar,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Yakin ingin menghapus mahasantri ini? Semua data absensinya juga akan dihapus.')) {
      deleteMahasantri(id);
    }
  };

  const getAbsenCount = (mhsId: string) => {
    return absenRecords.filter(r => r.mahasantriId === mhsId).length;
  };

  const getHadirPercentage = (mhsId: string) => {
    const records = absenRecords.filter(r => r.mahasantriId === mhsId);
    if (records.length === 0) return 0;
    const hadir = records.filter(r => r.status === 'hadir').length;
    return ((hadir / records.length) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Data Mahasantri</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          <UserPlus className="w-4 h-4" />
          Tambah Mahasantri
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingMhs ? 'Edit Mahasantri' : 'Tambah Mahasantri Baru'}
              </h3>
              <button onClick={resetForm} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData(f => ({ ...f, nama: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nama lengkap mahasantri"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIM</label>
                <input
                  type="text"
                  value={formData.nim}
                  onChange={(e) => setFormData(f => ({ ...f, nim: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nomor Induk Mahasantri"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Angkatan</label>
                  <input
                    type="text"
                    value={formData.angkatan}
                    onChange={(e) => setFormData(f => ({ ...f, angkatan: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kamar</label>
                  <input
                    type="text"
                    value={formData.kamar}
                    onChange={(e) => setFormData(f => ({ ...f, kamar: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Al-Farabi 1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Masuk</label>
                <input
                  type="date"
                  value={formData.tanggalMasuk}
                  onChange={(e) => setFormData(f => ({ ...f, tanggalMasuk: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={resetForm} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                Batal
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
              >
                <Save className="w-4 h-4" />
                {editingMhs ? 'Update' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nama</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">NIM</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Angkatan</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Kamar</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">% Hadir</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Total Absen</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mahasantriList.map((mhs, index) => (
                <tr key={mhs.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-indigo-600">{mhs.nama.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{mhs.nama}</p>
                        <p className="text-xs text-gray-500">Masuk: {mhs.tanggalMasuk}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{mhs.nim}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{mhs.angkatan}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{mhs.kamar}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-sm font-semibold ${
                      Number(getHadirPercentage(mhs.id)) >= 80 ? 'text-green-600' :
                      Number(getHadirPercentage(mhs.id)) >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {getHadirPercentage(mhs.id)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600">{getAbsenCount(mhs.id)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(mhs)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(mhs.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;
