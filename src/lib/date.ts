
/**
 * Options for the format function to determine preset styles
 */
export type FormatStyle = 'short' | 'medium' | 'long' | 'full' | 'iso';

export type FormatType = 'date' | 'time' | 'datetime' | 'timestamp';

export type FormatTimezone = 'UTC' | 'America/New_York' | 'America/Los_Angeles' | 'America/Chicago' | 'America/Denver' | 'Europe/London'
// /**
//  * Formats a Date object or timestamp into a localized string or ISO date.
//  */

export const FormatDate = (
    date: Date | number | string,
    style: FormatStyle = 'medium',
    type?: FormatType,
    timezone?: FormatTimezone,
    locale: string = 'en-US',
) => {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date provided to formatDate');
  }

  if (type === 'datetime') {
    if (style === 'iso') {
        // return d.toISOString().split('T')[0]; // Returns YYYY-MM-DD
        return `${d.toISOString().split('T')[0] + ' ' + d.toISOString().split('T')[2]}` // returns YYYY-MM-DD HH:MM:SS
    }
  }
  else if (type === 'timestamp') {
    if (style === 'iso') {
        // return d.toISOString().split('T')[0]; // Returns YYYY-MM-DD
        return d.toISOString()// returns YYYY-MM-DDTHH:MM:SS
    }
  }
  else if (type === "time"){
    if (style === 'iso'){
        return d.toISOString().split('T')[2]; // Returns HH:MM:SS
    }
  }
  else {
    if (style === 'iso') {
      return d.toISOString().split('T')[0]; // Returns YYYY-MM-DD
    }
  }

  return new Intl.DateTimeFormat(locale, { dateStyle: style, timeZone: timezone }).format(d);
}






