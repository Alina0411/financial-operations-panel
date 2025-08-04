export class DateUtils {
  static toISODate(dateString: string): string {
    if (dateString.includes('-')) {
      return dateString;
    }

    if (dateString.includes('/')) {
      const parts = dateString.split('/');
      if (parts.length === 3) {
        if (parts[2].length === 2) {
          return `20${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        } else {
          return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      }
    }

    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }

    return dateString;
  }

  static toStartOfDay(dateString: string): string {
    const isoDate = this.toISODate(dateString);
    return `${isoDate}T00:00:00`;
  }

  static toEndOfDay(dateString: string): string {
    const isoDate = this.toISODate(dateString);
    return `${isoDate}T23:59:59`;
  }

  static formatForDisplay(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  }

  static isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }
} 