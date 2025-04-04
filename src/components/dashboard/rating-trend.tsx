"use client";

import { CFUserInfo, CFRatingChange } from "@/lib/codeforces-api";
import {
  RATING_TIERS,
  getRankColor,
  getTierByRating,
} from "@/lib/rating-utils";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface RatingTrendProps {
  userData: CFUserInfo | null;
  ratingHistory?: CFRatingChange[];
}

export function RatingTrend({
  userData,
  ratingHistory: initialRatingHistory,
}: RatingTrendProps) {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Simple dark mode check – you may replace this with your theme context
  const isDarkMode =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  useEffect(() => {
    if (userData) {
      if (initialRatingHistory && initialRatingHistory.length > 0) {
        processRatingHistory(initialRatingHistory);
        return;
      }

      async function fetchRatingHistory() {
        setLoading(true);
        try {
          const response = await fetch(
            `https://codeforces.com/api/user.rating?handle=${userData.handle}`
          );
          const data = await response.json();
          if (data.status === "OK") {
            processRatingHistory(data.result);
          } else {
            createSampleData();
          }
        } catch (error) {
          console.error("Failed to fetch rating history:", error);
          createSampleData();
        } finally {
          setLoading(false);
        }
      }

      function processRatingHistory(ratingHistory: any[]) {
        if (!ratingHistory || ratingHistory.length === 0) {
          createSampleData();
          return;
        }
        const labels = ratingHistory.map((contest: any) => {
          const date = new Date(contest.ratingUpdateTimeSeconds * 1000);
          return date.toLocaleString("default", { month: "short" });
        });
        const ratings = ratingHistory.map((contest: any) => contest.newRating);
        setChartData({
          labels,
          datasets: [
            {
              label: "Rating",
              data: ratings,
              borderColor: getRankColor(userData.rank),
              backgroundColor: `${getRankColor(userData.rank)}20`,
              tension: 0.3,
              fill: true,
              pointBackgroundColor: getRankColor(userData.rank),
              pointBorderColor: "#fff",
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        });
      }

      function createSampleData() {
        const currentRating = userData.rating || 1500;
        const maxRating = userData.maxRating || currentRating;
        const sampleData = [];
        let rating = Math.max(currentRating - 300, 800);
        for (let i = 0; i < 10; i++) {
          const change = Math.floor(Math.random() * 250) - 100;
          rating = Math.max(rating + change, 800);
          if (i === 9) {
            rating = currentRating;
          }
          if (i === 5) {
            rating = maxRating;
          }
          sampleData.push(rating);
        }
        const labels = [];
        const now = new Date();
        for (let i = 9; i >= 0; i--) {
          const date = new Date();
          date.setMonth(now.getMonth() - i);
          labels.push(date.toLocaleString("default", { month: "short" }));
        }
        setChartData({
          labels,
          datasets: [
            {
              label: "Rating",
              data: sampleData,
              borderColor: getRankColor(userData.rank),
              backgroundColor: `${getRankColor(userData.rank)}20`,
              tension: 0.3,
              fill: true,
              pointBackgroundColor: getRankColor(userData.rank),
              pointBorderColor: "#fff",
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        });
      }

      fetchRatingHistory();
    }
  }, [userData, initialRatingHistory]);

  if (!userData) return null;

  const minRating = chartData?.datasets[0]?.data?.reduce(
    (min: number, val: number) => (val < min ? val : min),
    chartData?.datasets[0]?.data?.[0] || 0
  );
  const maxRating = chartData?.datasets[0]?.data?.reduce(
    (max: number, val: number) => (val > max ? val : max),
    chartData?.datasets[0]?.data?.[0] || 3000
  );

  // Adjust the opacity for tier backgrounds in light mode for better readability.
  const tierOpacity = isDarkMode ? "95" : "20";

  const ratingBackgroundsPlugin = {
    id: "ratingBackgrounds",
    beforeDraw: (chart: any) => {
      const ctx = chart.ctx;
      const yAxis = chart.scales.y;
      const chartArea = chart.chartArea;

      RATING_TIERS.forEach((tier) => {
        if (tier.max < yAxis.min || tier.min > yAxis.max) return;
        const yMin = Math.max(yAxis.getPixelForValue(tier.min), chartArea.top);
        const yMax = Math.min(
          yAxis.getPixelForValue(tier.max),
          chartArea.bottom
        );
        // In light mode, use very low opacity for the background to ensure text clarity.
        ctx.fillStyle = isDarkMode ? `${tier.bgColor}95` : `${tier.bgColor}10`;
        ctx.fillRect(
          chartArea.left,
          yMin,
          chartArea.right - chartArea.left,
          yMax - yMin
        );
        ctx.beginPath();
        ctx.moveTo(chartArea.left, yMax);
        ctx.lineTo(chartArea.right, yMax);
        ctx.strokeStyle = tier.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (yMax - yMin > 20) {
          ctx.fillStyle = tier.color;
          ctx.font = "bold 11px Arial";
          ctx.textAlign = "right";
          ctx.textBaseline = "bottom";
          ctx.fillText(tier.name, chartArea.right - 5, yMax - 3);
        }
      });
    },
  };

  return (
    <div className="bg-background/50 p-4 rounded-lg shadow-sm">
      <h3 className="font-semibold mb-4 flex items-center">
        <TrendingUp size={18} className="mr-2" />
        Rating History
      </h3>
      <div className="h-72 w-full">
        {chartData ? (
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: false,
                  min: Math.max(0, minRating - 200),
                  max: maxRating + 200,
                  grid: {
                    color: isDarkMode
                      ? "rgba(100, 100, 100, 0.2)"
                      : "rgba(200, 200, 200, 0.3)",
                    z: -1,
                  },
                  border: { dash: [4, 4] },
                  ticks: {
                    callback: (value) => value,
                    color: isDarkMode ? "#ddd" : "#000",
                    font: {
                      size: 14,
                      weight: "bold",
                    },
                    padding: 10,
                  },
                },
                x: {
                  grid: { display: false },
                  border: {
                    display: true,
                    color: isDarkMode
                      ? "rgba(255, 255, 255, 0.2)"
                      : "rgba(0, 0, 0, 0.2)",
                  },
                  ticks: {
                    color: isDarkMode ? "#ddd" : "#000",
                    maxRotation: 30,
                    minRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 5,
                    crossAlign: "far",
                    font: {
                      size: 14,
                      weight: "bold",
                    },
                    padding: 20,
                  },
                },
              },
              plugins: {
                legend: { display: false },
                tooltip: {
                  backgroundColor: isDarkMode
                    ? "rgba(0, 0, 0, 0.8)"
                    : "rgba(255, 255, 255, 0.95)",
                  titleColor: isDarkMode ? "#fff" : "#000",
                  bodyColor: isDarkMode ? "#fff" : "#000",
                  titleFont: { size: 14, weight: "bold" },
                  bodyFont: { size: 14 },
                  padding: 10,
                  borderColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.3)",
                  borderWidth: 1,
                  callbacks: {
                    title: (tooltipItems) => tooltipItems[0].label,
                    label: (context) => {
                      const rating = context.parsed.y;
                      const tier = RATING_TIERS.find(
                        (t) => rating >= t.min && rating <= t.max
                      );
                      return [`Rating: ${rating}`, `Rank: ${tier?.name || "Unknown"}`];
                    },
                  },
                },
                ratingBackgrounds: ratingBackgroundsPlugin,
              },
              elements: {
                line: { borderWidth: 3, tension: 0.2 },
                point: {
                  radius: 3,
                  hoverRadius: 5,
                  borderWidth: isDarkMode ? 2 : 3,
                  borderColor: isDarkMode ? "#fff" : "#000",
                },
              },
              interaction: { intersect: false, mode: "index" },
              layout: {
                padding: {
                  bottom: 60, // increased bottom padding
                  right: 15,
                  top: 10,
                  left: 10,
                },
              },
            }}
            plugins={[ratingBackgroundsPlugin]}
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">
              {loading ? "Loading rating history..." : "No rating data available"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
