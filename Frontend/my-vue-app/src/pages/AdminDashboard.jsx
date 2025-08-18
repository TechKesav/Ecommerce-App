import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("1M"); 

  useEffect(() => {
    const fetchSalesTrend = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/api/admin/sales-trend", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(res.data)) {
          const formattedData = res.data.map((item) => ({
            date: new Date(item.dateTime).toLocaleDateString(),
            totalSales: item.totalSales,
          }));

          // Filter based on selected time range
          const filteredData = filterData(formattedData, timeRange);

          setData(filteredData);
        } else {
          setData([]);
        }
      } catch (err) {
        setError("Failed to fetch sales data. Make sure you are logged in as admin.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesTrend();
  }, [timeRange]);

  // Function to filter data based on selected range
  const filterData = (data, range) => {
    const now = new Date();
    let startDate;

    switch (range) {
      case "1M":
        startDate = new Date();
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "6M":
        startDate = new Date();
        startDate.setMonth(now.getMonth() - 6);
        break;
      case "1Y":
        startDate = new Date();
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case "5Y":
        startDate = new Date();
        startDate.setFullYear(now.getFullYear() - 5);
        break;
      default:
        return data;
    }

    return data.filter((item) => new Date(item.date) >= startDate);
  };

  if (loading) return <div className="p-4 text-center text-white">Loading sales trends...</div>;
  if (error) return <div className="p-4 text-center text-red-400">{error}</div>;

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">📊 Sales Trends</h2>

      {/* Time Range Buttons */}
      <div className="flex justify-center space-x-4 mb-6">
        {["1M", "6M", "1Y", "5Y"].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              timeRange === range ? "bg-indigo-500 text-white" : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {range === "1M" ? "1 Month" : range === "6M" ? "6 Months" : range === "1Y" ? "1 Year" : "5 Years"}
          </button>
        ))}
      </div>

      {data.length === 0 ? (
        <p className="text-center text-gray-400">No sales data available for this period.</p>
      ) : (
        <ResponsiveContainer width="100%" height={450}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis dataKey="date" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip 
              contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #444", borderRadius: "8px" }}
              labelStyle={{ color: "#fff" }}
              itemStyle={{ color: "#fff" }}
            />
            <Legend />
            <Line type="monotone" dataKey="totalSales" stroke="#4F46E5" strokeWidth={3} dot={{ fill: "#4F46E5", r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default AdminDashboard; 