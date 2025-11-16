export const getRandomColor = () => {
  const colors = [
    "#00FFFF", "#A020F0", "#ff6464", "#00FF88",
    "#FFD700", "#FF1493", "#00CED1", "#FF4500",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
