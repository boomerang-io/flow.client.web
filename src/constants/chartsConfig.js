export const scatterDataLines = [
  { dataKey: "duration", stroke: "#047cc0", activeDot: true, gradientFill: "blueGradient" }
];
export const unitDataLines = [
  { dataKey: "passRate", stroke: "#047cc0", activeDot: true, gradientFill: "blueGradient" }
];
export const uiDataLines = [{ dataKey: "passRate", stroke: "#047cc0", activeDot: true, gradientFill: "blueGradient" }];
export const coverageDataLines = [
  { dataKey: "coverage", stroke: "#047cc0", activeDot: true, gradientFill: "blueGradient" }
];
export const timeDataLines = [
  { dataKey: "total", stroke: "#047cc0", activeDot: true, gradientFill: "blueGradient" },
  { dataKey: "passed", stroke: "#82ca9d", activeDot: false, gradientFill: "greenGradient" },
  { dataKey: "failed", stroke: "#e26665", activeDot: false, gradientFill: "redGradient" }
];
export const staticDataLines = [
  { dataKey: "violations", stroke: "#047cc0", activeDot: true, gradientFill: "blueGradient" },
  { dataKey: "criticalViolations", stroke: "#82ca9d", activeDot: false, gradientFill: "greenGradient" }
];
export const staticDataScatter = [
  { name: "violations", fill: "#047cc0" },
  { name: "criticalViolations", fill: "#82ca9d" }
];

export const compilationDataLines = [
  { dataKey: "warnings", stroke: "#047cc0", activeDot: true, gradientFill: "blueGradient" },
  { dataKey: "errors", stroke: "#82ca9d", activeDot: false, gradientFill: "greenGradient" }
];

export const compilationDataScatter = [{ name: "warnings", fill: "#047cc0" }, { name: "errors", fill: "#82ca9d" }];

export const executeDataLines = [
  { dataKey: "total", stroke: "#047cc0", activeDot: true, gradientFill: "blueGradient" },
  { dataKey: "success", stroke: "#82ca9d", activeDot: false, gradientFill: "greenGradient" },
  { dataKey: "failed", stroke: "#e26665", activeDot: false, gradientFill: "redGradient" },
  { dataKey: "inProgress", stroke: "#00baa1", activeDot: false, gradientFill: "tealGradient" },
  { dataKey: "invalid", stroke: "#6f7878", activeDot: false, gradientFill: "grayGradient" }
];
