import { ptBR } from 'date-fns/locale';

export const dateDisplayOptions = {
  locale: ptBR,
  addSuffix: true,
};

export function convertDateToDailyMinutesTimestamp(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}