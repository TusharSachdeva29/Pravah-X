export const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function getDaysInMonth(year: number, month: number): Date[] {
  const date = new Date(year, month, 1)
  const days = []
  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return days
}

export function getMonthName(date: Date): string {
  return date.toLocaleString("default", { month: "long" })
}

export function getYearRange(currentYear: number): number[] {
  const startYear = currentYear - 100
  const endYear = currentYear + 100
  return Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)
}

