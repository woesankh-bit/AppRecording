export interface Mahasantri {
  id: string;
  nama: string;
  nim: string;
  angkatan: string;
  tanggalMasuk: string;
  kamar: string;
}

export type AbsenStatus = 'hadir' | 'sakit' | 'izin' | 'alpa';

export interface BKTindakLanjut {
  sudahDitindaklanjuti: boolean;
  tanggalTindakLanjut: string;
  petugasBK: string;
  jenisSanksi: string;
  catatanBK: string;
  statusPenyelesaian: 'belum' | 'proses' | 'selesai';
}

export interface AbsenRecord {
  id: string;
  mahasantriId: string;
  programId: string;
  tanggal: string;
  status: AbsenStatus;
  keterangan: string;
  bk: BKTindakLanjut;
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
