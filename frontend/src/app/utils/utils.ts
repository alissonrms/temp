import { ptBR } from 'date-fns/locale';

export const dateDisplayOptions = {
  locale: ptBR,
  addSuffix: true,
};

export function convertDateToDailyMinutesTimestamp(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

export function convertDailyMinutesTimestampToFormattedDate(
  minutesTimestamp: number
) {
  const hours = Math.floor(minutesTimestamp / 60);
  const minutes = minutesTimestamp % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}h`;
}
