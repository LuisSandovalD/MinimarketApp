export const formatDate = (dateString, locale = 'es-ES') => {
  return new Date(dateString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateLong = (dateString, locale = 'es-PE') => {
  return new Date(dateString).toLocaleDateString(locale);
};

export const getInitials = (name) => {
  return name ? name.charAt(0).toUpperCase() : '?';
};

export const getRoleName = (user) => {
  return user.roles?.[0]?.name || "Sin rol";
};

export const getPermissions = (user) => {
  return user.roles?.[0]?.permissions?.map((p) => p.name) || [];
};