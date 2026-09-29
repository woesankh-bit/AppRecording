export interface Mahasantri {
  id: string;
  nama: string;
  nim: string;
  angkatan: string;
  tanggalMasuk: string;
  kamar: string;
}

export type AbsenStatus = 'hadir' | 'sakit' | 'izin' | 'alpa';

export interface AbsenRecord {
  id: string;
  mahasantriId: string;
  programId: string;
  tanggal: string;
  status: AbsenStatus;
  keterangan: string;
}

export interface Program {
  id: string;
  nama: string;
  kategori: 'harian' | 'pekanan' | 'bulanan';
  deskripsi: string;
}

export type DateRange = '1minggu' | '1bulan' | '1semester' | '1tahun' | 'semua';

export interface ReportFilter {
  mahasantriId: string | 'all';
  dateRange: DateRange;
  startDate: string;
  endDate: string;
  programId: string | 'all';
}
