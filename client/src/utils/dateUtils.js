export const formatFullDate = (dateString) => {
  const date = new Date(dateString);

  const dayNames = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  const dayName = dayNames[date.getDay()];

  const formattedDate = new Intl.DateTimeFormat('vi-VN', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
  }).format(date);

  const parts = formattedDate.split(' ');
  if (parts.length === 2) {
      const datePart = parts[0].trim();
      const timePart = parts[1].trim();
      return `${dayName}, ${datePart}, ${timePart}`;
  }

  return `${dayName}, ${formattedDate}`;
};

export const formatShortDate = (dateString) => {
  const date = new Date(dateString);
  
  let formattedDate = date.toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  });

  return formattedDate;
};