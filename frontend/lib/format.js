export const colors = ["#15628F", "#1F9D6C", "#C2452D", "#7C5CBF", "#B8860B", "#0E7490", "#B03A6E", "#4F772D"];

export const formatRs = (n) => "Rs " + n.toLocaleString("en-LK");

export const percentRaised = (p) => Math.min(100, (p.got / p.need) * 100);

export const patientGradient = (id) =>
  `linear-gradient(135deg, ${colors[id % colors.length]}, ${colors[(id + 3) % colors.length]})`;
