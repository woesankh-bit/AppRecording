import { AbsenRecord, DateRange, ReportFilter } from './types';
import { subDays, subMonths, subYears, isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';

export const getDateRange = (range: DateRange, startDate?: string, endDate?: string): { start: Date; end: Date } => {
  const now = new Date();
  const end = endOfDay(now);
  
  switch (range) {
    case '1minggu':
      return { start: startOfDay(subDays(now, 7)), end };
    case '1bulan':
      return { start: startOfDay(subMonths(now, 1)), end };
    case '1semester':
      return { start: startOfDay(subMonths(now, 6)), end };
    case '1tahun':
      return { start: startOfDay(subYears(now, 1)), end };
    case 'semua':
      return { start: new Date('2020-01-01'), end };
    default:
      if (startDate && endDate) {
        return { start: startOfDay(parseISO(startDate)), end: endOfDay(parseISO(endDate)) };
      }
      return { start: startOfDay(subMonths(now, 1)), end };
  }
};

export const filterRecords = (records: AbsenRecord[], filter: ReportFilter): AbsenRecord[] => {
  const { start, end } = getDateRange(filter.dateRange, filter.startDate, filter.endDate);
  
  return records.filter(record => {
    const recordDate = parseISO(record.tanggal);
    const inRange = isWithinInterval(recordDate, { start, end });
    const matchesStudent = filter.mahasantriId === 'all' || record.mahasantriId === filter.mahasantriId;
    const matchesProgram = filter.programId === 'all' || record.programId === filter.programId;
    return inRange && matchesStudent && matchesProgram;
  });
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'hadir': return 'text-green-600 bg-green-100';
    case 'sakit': return 'text-yellow-600 bg-yellow-100';
    case 'izin': return 'text-blue-600 bg-blue-100';
    case 'alpa': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'hadir': return 'Hadir';
    case 'sakit': return 'Sakit';
    case 'izin': return 'Izin';
    case 'alpa': return 'Alpa';
    default: return status;
  }
};

export const calculateStats = (records: AbsenRecord[]) => {
  const total = records.length;
  const hadir = records.filter(r => r.status === 'hadir').length;
  const sakit = records.filter(r => r.status === 'sakit').length;
  const izin = records.filter(r => r.status === 'izin').length;
  const alpa = records.filter(r => r.status === 'alpa').length;
  
  return {
    total,
    hadir,
    sakit,
    izin,
    alpa,
    persentaseHadir: total > 0 ? ((hadir / total) * 100).toFixed(1) : '0',
    persentaseSakit: total > 0 ? ((sakit / total) * 100).toFixed(1) : '0',
    persentaseIzin: total > 0 ? ((izin / total) * 100).toFixed(1) : '0',
    persentaseAlpa: total > 0 ? ((alpa / total) * 100).toFixed(1) : '0',
  };
};

export const formatDate = (dateStr: string): string => {
  const date = parseISO(dateStr);
  return date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

export const formatDateShort = (dateStr: string): string => {
  const date = parseISO(dateStr);
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};
