/**
 * Возвращает год для Vision.
 * Если текущая дата >= 1 ноября, возвращает следующий год.
 * Иначе возвращает текущий год.
 */
export function getVisionYear(): number {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed, ноябрь = 10

  // Если ноябрь (10) или позже, возвращаем следующий год
  if (currentMonth >= 10) {
    return currentYear + 1;
  }

  return currentYear;
}
