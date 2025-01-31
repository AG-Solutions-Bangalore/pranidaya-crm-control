import React, { useState, useEffect } from "react";
import CountUp from "react-countup";
import { Doughnut } from "react-chartjs-2";
import { NumericFormat } from "react-number-format";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BaseUrl } from "../../base/BaseUrl";
import { Chart, ArcElement, registerables } from "chart.js";
import Layout from "../../layout/Layout";
import ApexCharts from "apexcharts";
import RefreshIcon from "@mui/icons-material/Refresh";
import { motion } from "framer-motion";

import {
  Building2,
  IndianRupee,
  PieChart,
  RefreshCcw,
  User,
  Users,
  X,
} from "lucide-react";
import { MdOutlineWebhook } from "react-icons/md";
import { GrTasks } from "react-icons/gr";
import toast from "react-hot-toast";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

// Registering necessary components in Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);
//new
const DashboardCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg overflow-hidden shadow-sm">
    <div className="p-6 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">
            <CountUp end={value} separator="," />
          </h3>
        </div>
        <div
          className={`w-12 h-12 flex items-center justify-center rounded-full ${color}`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  </div>
);

// /bar chart
const BarChartComponent = ({ data }) => {
  if (!data || !data.graphbar || data.graphbar.length === 0) {
    return <div>No data available</div>;
  }

  const scaleFactor = 1000;

  const barData = {
    labels: data.graphbar.map((item) => item.c_receipt_sub_donation_type),
    datasets: [
      {
        label: "Total Amount (in thousands)",
        data: data.graphbar.map((item) => item.total_amount / scaleFactor),
        backgroundColor: "#4BC0C0",
        borderColor: "#36A2EB",
        borderWidth: 1,
      },
      {
        label: "Total Receipt Count",
        data: data.graphbar.map((item) => item.total_recipt_count),
        backgroundColor: "#FFCE56",
        borderColor: "#FF6384",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <Bar
        data={barData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  let label = context.dataset.label || "";
                  if (label) {
                    label += ": ";
                  }
                  label += context.raw;
                  return label;
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Donation Types",
              },
            },
            y: {
              title: {
                display: true,
                text: "Amount/Count",
              },
              ticks: {
                callback: function (value) {
                  return value.toLocaleString();
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

const NewsDashboard = () => {
  Chart.register(ArcElement, ...registerables);

  const [results, setResults] = useState([]);
  const [stock, setStock] = useState([]);
  const [graphData, setGraphData] = useState(null);
  const [isBarVisible, setIsBarVisible] = useState(true);
  const [isPieVisible, setIsPieVisible] = useState(true);
  const [currentYear, setCurrentYear] = useState("");

  const [data, setData] = useState([]);

  const [graph3, setGraph3] = useState([]);
  const [graph4, setGraph4] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchYearData = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/fetch-year`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setCurrentYear(response.data.year.current_year);
        console.log(response.data.year.current_year);
      } catch (error) {
        console.error("Error fetching year data:", error);
      }
    };

    fetchYearData();
  }, []);

  const fetchData = async () => {
    if (currentYear) {
      try {
        const res = await axios({
          url: `${BaseUrl}/fetch-dashboard-data-by/${currentYear}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setResults(res.data);
        setStock(res.data.stock);
        setData(res.data);
        // Extract bar and pie chart data

        const pieLabels = res.data.graphpie.map(
          (item) => item.c_receipt_tran_pay_mode
        );
        const pieValues = res.data.graphpie.map((item) =>
          parseInt(item.total_amount)
        );

        setGraph3(pieLabels);
        setGraph4(pieValues);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    }
  };
  useEffect(() => {
    fetchData();
  }, [currentYear]);
  const handleReload = () => {
    console.log("Reloading data...");
    fetchData();
  };

  //new

  const cardConfig = [
    {
      title: "Total Donors",
      value: results.total_donor_count,
      icon: Users,
      color: "bg-blue-600",
    },
    {
      title: "Total Website Donation",
      value: results.total_website_donation,
      icon: MdOutlineWebhook,
      color: "bg-green-600",
    },
    {
      title: "Total Material Donation",
      value: results.total_material_donation,
      icon: GrTasks,
      color: "bg-purple-600",
    },
    {
      title: "Total Donation",
      value: results.total_donation,
      icon: IndianRupee,
      color: "bg-amber-600",
    },
  ];

  useEffect(() => {
    if (graph3.length > 0) {
      setGraphData({
        labels: graph3,
        datasets: [
          {
            data: graph4,
            backgroundColor: [
              "#3b82f6", // blue-500
              "#f59e0b", // amber-500
              "#10b981", // emerald-500
              "#6366f1", // indigo-500
            ],
            hoverBackgroundColor: [
              "#2563eb", // blue-600
              "#d97706", // amber-600
              "#059669", // emerald-600
              "#4f46e5", // indigo-600
            ],
          },
        ],
      });
    }
  }, [graph3, graph4]);

  return (
    <Layout>
      <div className="news-dashboard-wrapper mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cardConfig.map((card, index) => (
            <DashboardCard
              key={index}
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
            />
          ))}
        </div>

        <h3 className="mt-8 text-3xl font-bold text-gray-800 text-center">
          Current Month Stocks (in Kgs)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8 mt-6 px-4">
          {stock.map((value, index) => (
            <motion.div
              key={index}
              initial={{ x: index % 2 === 0 ? -100 : 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true }}
              className="bg-gradient-to-tl from-indigo-400 to-indigo-300 text-white p-6 rounded-xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold mb-3">
                  <NumericFormat
                    thousandSeparator={true}
                    thousandsGroupStyle="lakh"
                    displayType="text"
                    value={
                      value.openpurch -
                      value.closesale +
                      (value.purch - value.sale)
                    }
                  />
                </span>
                {/* <span className="block text-sm text-indigo-100 mb-4">
                  {value.item_name}
                </span> */}
              </div>
              <div className="border-t border-white pt-4 text-center">
                <span className="text-md font-semibold text-white opacity-80">
                  {value.item_name} Stock
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="news-dashboard-wrapper mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              {isPieVisible && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden ">
                  <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                        <PieChart className="w-5 h-5 text-purple-600" />
                      </div>
                      <h2 className="text-lg font-bold text-gray-900">
                        Cash Receipts
                      </h2>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleReload}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <RefreshIcon className="h-5 w-5 text-gray-500" />
                      </button>
                      <button
                        onClick={() => setIsPieVisible(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <X className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    {graphData && (
                      <Doughnut
                        data={graphData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "bottom",
                            },
                          },
                          cutout: "70%",
                        }}
                        height={150}
                      />
                    )}
                    <h1>
                      {" "}
                      {(!graphData || graphData.length === 0) && (
                        <div>No data available</div>
                      )}
                    </h1>
                  </div>
                </div>
              )}
            </div>

            <div>
              {isBarVisible && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden ">
                  <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                        <PieChart className="w-5 h-5 text-purple-600" />
                      </div>
                      <h2 className="text-lg font-bold text-gray-900">
                        Cash Receipts
                      </h2>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleReload}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <RefreshIcon className="h-5 w-5 text-gray-500" />
                      </button>
                      <button
                        onClick={() => setIsBarVisible(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <X className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <BarChartComponent data={data} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NewsDashboard;
