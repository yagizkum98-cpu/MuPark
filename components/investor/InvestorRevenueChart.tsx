"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function InvestorRevenueChart() {
  const labels = ["Ocak", "Subat", "Mart", "Nisan", "Mayis", "Haziran", "Temmuz", "Agustos"];
  const revenue = [12400, 15850, 20100, 24800, 29450, 35100, 42350, 48700];

  const data = {
    labels,
    datasets: [
      {
        label: "Aylik Gelir",
        data: revenue,
        borderColor: "#38bdf8",
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#f8fafc",
        pointHoverBorderColor: "#38bdf8",
        tension: 0.35,
        fill: true,
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return "rgba(56, 189, 248, 0.18)";
          }

          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(56, 189, 248, 0.35)");
          gradient.addColorStop(1, "rgba(56, 189, 248, 0.02)");
          return gradient;
        },
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1100,
      easing: "easeOutQuart" as const,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(2, 6, 23, 0.92)",
        borderColor: "rgba(125, 211, 252, 0.28)",
        borderWidth: 1,
        titleColor: "#e2e8f0",
        bodyColor: "#e2e8f0",
        displayColors: false,
        callbacks: {
          label(value: any) {
            return `Gelir: €${value.parsed.y.toLocaleString("tr-TR")}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "rgba(226, 232, 240, 0.75)",
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(148, 163, 184, 0.12)",
        },
        ticks: {
          color: "rgba(226, 232, 240, 0.75)",
          callback(value: any) {
            return `€${Number(value).toLocaleString("tr-TR")}`;
          },
          font: {
            size: 11,
          },
        },
      },
    },
  };

  return <Line data={data} options={options} />;
}
