export default function DateFormat({ datetime }) {
  if (!datetime) {
    return <span className="dark:text-white">Fecha no disponible</span>;
  }

  const cookieString = document.cookie;
  const timezonePrefix = 'timezone=';
  let userTimeZone = null;

  const startIndex = cookieString.indexOf(timezonePrefix);
  if (startIndex !== -1) {
    const endIndex = cookieString.indexOf(';', startIndex);
    const rawValue = endIndex === -1
      ? cookieString.substring(startIndex + timezonePrefix.length)
      : cookieString.substring(startIndex + timezonePrefix.length, endIndex);
    userTimeZone = decodeURIComponent(rawValue);
  }

  const date = new Date(datetime);

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  if (userTimeZone) {
    options.timeZone = userTimeZone;
  }

  const dateFormatted = date.toLocaleString('es-MX', options);

  return <span className="dark:text-white">{dateFormatted}</span>;
}
