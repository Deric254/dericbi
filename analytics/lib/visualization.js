export function buildChartConfig({ labels, values }) {
  return {
    type: "bar",
    data: {
      labels: labels || [],
      datasets: [
        {
          label: "Metric",
          data: values || [],
        },
      ],
    },
  };
}
