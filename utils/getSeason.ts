export const getSeason = (): "christmas" | "newYear" | null => {
  const today = new Date();
  const month = today.getMonth(); // 0-indexed

  // Christmas: December (Month 11)
  if (month === 11) {
    return "christmas";
  }

  // Sinhala/Tamil New Year: April (Month 3)
  if (month === 3) {
    return "newYear";
  }

  return null;
};
