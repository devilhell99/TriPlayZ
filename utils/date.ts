import { DateTime } from 'luxon'

export enum FORMAT_TYPE {
  YEAR_MONTH = 'yyyy年M月',
  YEAR_MONTH_DAY = 'yyyy-MM-dd',
  YEAR_DAY_TIME_DATE_NO_PADDING = 'yyyy年L月d日(EEE曜日) H時mm分',
  YEAR_DAY_WEEKDAY_NO_PADDING = 'yyyy年L月d日(EEE曜日)',
  YEAR_DAY_NO_PADDING = 'yyyy年L月d日',
  YEAR_DAY_HYPHEN = 'yyyy-LL-dd',
  YEAR_DAY_SLASH = 'yyyy/LL/dd',
  YEAR_DAY_TIME_SLASH = 'yyyy/LL/dd HH:mm',
  YEAR_DAY_TIME_SECOND_NOT_SEPARATE = 'yyyyLLddHHmmss',
  TIME = 'H時mm分',
  FULL_TIME = 'HH:MM:ss',
  YEAR_DAY_TIME_DATE = 'yyyy年L月d日 HH:mm',
  YEAR_MONTH_DAY_NO_PADDING = ' yyyy年MM月dd日',
}

export const formatDate = (
  date: string | Date,
  formatType: FORMAT_TYPE
): string | undefined => {
  if (!date) return
  const runtimeConfig = useRuntimeConfig()
  const d = typeof date === 'string' ? new Date(date) : date

  return DateTime.fromJSDate(d, {
    zone: runtimeConfig.public.timezone,
  }).toFormat(formatType)
}

export const plusHours = (date: Date, hour: number): Date => {
  return DateTime.fromJSDate(date).plus({ hour }).toJSDate()
}
export const plusMonth = (date: Date, month: number): Date => {
  return DateTime.fromJSDate(date).plus({ month }).toJSDate()
}
export const plusYear = (date: Date, year: number): Date => {
  return DateTime.fromJSDate(date).plus({ year }).toJSDate()
}

export const plusMonthFormatDate = (
  date: Date,
  month: number,
  format: string
): String => {
  return DateTime.fromJSDate(date).plus({ month }).toFormat(format)
}
export const plusYearFormatDate = (
  date: Date,
  year: number,
  format: string
): String => {
  return DateTime.fromJSDate(date).plus({ year }).toFormat(format)
}
