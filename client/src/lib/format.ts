export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatDateRange(startDate?: string, endDate?: string): string {
  if (!startDate && !endDate) {
    return 'Flexible dates';
  }
  if (!startDate) {
    return `Until ${formatDate(endDate!)}`;
  }
  if (!endDate) {
    return `From ${formatDate(startDate)}`;
  }
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

export function formatRoomType(roomType: string): string {
  const types: Record<string, string> = {
    entire: 'Entire place',
    private: 'Private room',
    shared: 'Shared room',
  };
  return types[roomType] || roomType;
}

export function formatBedsBaths(bedrooms?: number, bathrooms?: number): string {
  const parts: string[] = [];
  
  if (bedrooms) {
    parts.push(`${bedrooms} bed${bedrooms !== 1 ? 's' : ''}`);
  }
  
  if (bathrooms) {
    const bathroomText = bathrooms === 1 ? '1 bath' : `${bathrooms} baths`;
    parts.push(bathroomText);
  }
  
  return parts.join(', ') || 'Studio';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatAmenities(amenities: string[]): string {
  if (amenities.length === 0) {
    return '';
  }
  if (amenities.length === 1) {
    return amenities[0];
  }
  if (amenities.length === 2) {
    return amenities.join(' and ');
  }
  return `${amenities.slice(0, -1).join(', ')}, and ${amenities[amenities.length - 1]}`;
}