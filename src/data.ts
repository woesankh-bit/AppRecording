import { Program, Mahasantri, AbsenRecord, BKTindakLanjut } from './types';

export const defaultBK: BKTindakLanjut = {
  sudahDitindaklanjuti: false,
  tanggalTindakLanjut: '',
  petugasBK: '',
  jenisSanksi: '',
  catatanBK: '',
  statusPenyelesaian: 'belum',
};

export const jenisSanksiOptions = [
  'Teguran Lisan',
  'Teguran Tertulis',
  'Piket Masjid Tambahan',
  'Hafalan Tambahan',
  'Surat Peringatan 1',
  'Surat Peringatan 2',
  'Surat Peringatan 3',
  'Pemanggilan Wali',
  'Skorsing Ringan',
  'Skorsing Berat',
  'Lainnya',
];

export const petugasBKOptions = [
  'Ustadz Ahmad',
  'Ustadz Muhammad',
  'Ustadz Abdullah',
  'Ustadzah Fatimah',
  'Ustadzah Aisyah',
];

export const programs: Program[] = [
  // Program Harian
  { id: 'kbm', nama: 'KBM (Kuliah di Kelas)', kategori: 'harian', deskripsi: 'Kuliah formal di kelas' },
  { id: 'tahfidz-pagi', nama: 'Tahfidz Pagi', kategori: 'harian', deskripsi: 'Setoran dan murojaah Al-Quran pagi' },
  { id: 'tahfidz-sore', nama: 'Tahfidz Sore', kategori: 'harian', deskripsi: 'Setoran dan murojaah Al-Quran sore' },
  { id: 'maktabiyah', nama: 'Maktabiyah Siang', kategori: 'harian', deskripsi: 'Belajar mandiri di perpustakaan' },
  { id: 'belajar-malam', nama: 'Belajar Malam', kategori: 'harian', deskripsi: 'Kegiatan belajar malam hari' },
  { id: 'sholat-jamaah', nama: "Sholat Jama'ah", kategori: 'harian', deskripsi: 'Sholat berjamaah di masjid' },
  // Program Pekan
  { id: 'tasmi', nama: "Tasmi' Jum'at", kategori: 'pekanan', deskripsi: "Tasmi' Al-Quran setiap Jum'at pagi" },
  // Program Bulanan
  { id: 'review-jurnal', nama: 'Review Jurnal', kategori: 'bulanan', deskripsi: 'Review dan presentasi jurnal ilmiah' },
  { id: 'kuliah-tamu', nama: 'Kuliah Tamu', kategori: 'bulanan', deskripsi: 'Kuliah dari narasumber tamu' },
  { id: 'kuliah-kepengasuhan', nama: 'Kuliah Kepengasuhan', kategori: 'bulanan', deskripsi: 'Kuliah pembinaan kepengasuhan' },
  { id: 'munazharah', nama: 'Munazharah', kategori: 'bulanan', deskripsi: 'Debat ilmiah antar mahasantri' },
];

export const sampleMahasantri: Mahasantri[] = [
  { id: 'mhs-001', nama: 'Ahmad Fauzi', nim: '2024001', angkatan: '2024', tanggalMasuk: '2024-07-01', kamar: 'Al-Farabi 1' },
  { id: 'mhs-002', nama: 'Muhammad Rizki', nim: '2024002', angkatan: '2024', tanggalMasuk: '2024-07-01', kamar: 'Al-Farabi 1' },
  { id: 'mhs-003', nama: 'Abdullah Hasan', nim: '2024003', angkatan: '2024', tanggalMasuk: '2024-07-01', kamar: 'Al-Farabi 2' },
  { id: 'mhs-004', nama: 'Umar Faruq', nim: '2024004', angkatan: '2024', tanggalMasuk: '2024-07-01', kamar: 'Al-Farabi 2' },
  { id: 'mhs-005', nama: 'Zaid bin Tsabit', nim: '2024005', angkatan: '2024', tanggalMasuk: '2024-07-01', kamar: 'Al-Ghazali 1' },
  { id: 'mhs-006', nama: 'Ibrahim Adham', nim: '2024006', angkatan: '2024', tanggalMasuk: '2024-07-01', kamar: 'Al-Ghazali 1' },
  { id: 'mhs-007', nama: 'Kholid bin Walid', nim: '2023001', angkatan: '2023', tanggalMasuk: '2023-07-01', kamar: 'Al-Ghazali 2' },
  { id: 'mhs-008', nama: 'Bilal bin Rabah', nim: '2023002', angkatan: '2023', tanggalMasuk: '2023-07-01', kamar: 'Al-Ghazali 2' },
  { id: 'mhs-009', nama: 'Salman Al-Farisi', nim: '2023003', angkatan: '2023', tanggalMasuk: '2023-07-01', kamar: 'Ibnu Taimiyah 1' },
  { id: 'mhs-010', nama: 'Abu Bakar Ash-Shiddiq', nim: '2023004', angkatan: '2023', tanggalMasuk: '2023-07-01', kamar: 'Ibnu Taimiyah 1' },
];

export const generateSampleAbsen = (): AbsenRecord[] => {
  const records: AbsenRecord[] = [];
  const statuses: Array<'hadir' | 'sakit' | 'izin' | 'alpa'> = ['hadir', 'hadir', 'hadir', 'hadir', 'hadir', 'hadir', 'hadir', 'sakit', 'izin', 'alpa'];
  const keteranganOptions = ['', 'Demam', 'Acara keluarga', '', '', 'Keperluan mendesak', '', 'Sakit perut', 'Izin pulang', ''];
  
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 30);
  
  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.getDay();
    
    sampleMahasantri.forEach(mhs => {
      // Program harian
      const dailyPrograms = programs.filter(p => p.kategori === 'harian');
      dailyPrograms.forEach(prog => {
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const keterangan = status !== 'hadir' ? keteranganOptions[Math.floor(Math.random() * keteranganOptions.length)] : '';
        
        // Generate BK data untuk yang tidak hadir
        let bk: BKTindakLanjut = { ...defaultBK };
        if (status !== 'hadir') {
          const sudahTL = Math.random() > 0.4; // 60% sudah ditindaklanjuti
          if (sudahTL) {
            const sanksi = jenisSanksiOptions[Math.floor(Math.random() * 5)];
            const petugas = petugasBKOptions[Math.floor(Math.random() * petugasBKOptions.length)];
            const tlDate = new Date(d);
            tlDate.setDate(tlDate.getDate() + Math.floor(Math.random() * 3) + 1);
            bk = {
              sudahDitindaklanjuti: true,
              tanggalTindakLanjut: tlDate.toISOString().split('T')[0],
              petugasBK: petugas,
              jenisSanksi: status === 'alpa' ? sanksi : 'Teguran Lisan',
              catatanBK: status === 'alpa' ? 'Mahasantri dipanggil dan diberikan peringatan' : 'Sudah dikonfirmasi dan dimaklumi',
              statusPenyelesaian: Math.random() > 0.3 ? 'selesai' : 'proses',
            };
          }
        }

        records.push({
          id: `absen-${mhs.id}-${prog.id}-${dateStr}`,
          mahasantriId: mhs.id,
          programId: prog.id,
          tanggal: dateStr,
          status,
          keterangan,
          bk,
        });
      });
      
      // Tasmi' hanya hari Jumat
      if (dayOfWeek === 5) {
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        let bk: BKTindakLanjut = { ...defaultBK };
        if (status !== 'hadir') {
          const sudahTL = Math.random() > 0.4;
          if (sudahTL) {
            bk = {
              sudahDitindaklanjuti: true,
              tanggalTindakLanjut: dateStr,
              petugasBK: petugasBKOptions[Math.floor(Math.random() * petugasBKOptions.length)],
              jenisSanksi: status === 'alpa' ? 'Piket Masjid Tambahan' : 'Teguran Lisan',
              catatanBK: 'Sudah ditindaklanjuti',
              statusPenyelesaian: 'selesai',
            };
          }
        }
        records.push({
          id: `absen-${mhs.id}-tasmi-${dateStr}`,
          mahasantriId: mhs.id,
          programId: 'tasmi',
          tanggal: dateStr,
          status,
          keterangan: status !== 'hadir' ? keteranganOptions[Math.floor(Math.random() * keteranganOptions.length)] : '',
          bk,
        });
      }
      
      // Program bulanan (tanggal 1 setiap bulan)
      if (d.getDate() === 1) {
        const monthlyPrograms = programs.filter(p => p.kategori === 'bulanan');
        monthlyPrograms.forEach(prog => {
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          let bk: BKTindakLanjut = { ...defaultBK };
          if (status !== 'hadir') {
            bk = {
              sudahDitindaklanjuti: Math.random() > 0.5,
              tanggalTindakLanjut: dateStr,
              petugasBK: petugasBKOptions[Math.floor(Math.random() * petugasBKOptions.length)],
              jenisSanksi: 'Teguran Lisan',
              catatanBK: 'Sudah dikonfirmasi',
              statusPenyelesaian: 'selesai',
            };
          }
          records.push({
            id: `absen-${mhs.id}-${prog.id}-${dateStr}`,
            mahasantriId: mhs.id,
            programId: prog.id,
            tanggal: dateStr,
            status,
            keterangan: status !== 'hadir' ? keteranganOptions[Math.floor(Math.random() * keteranganOptions.length)] : '',
            bk,
          });
        });
      }
    });
  }
  
  return records;
};
