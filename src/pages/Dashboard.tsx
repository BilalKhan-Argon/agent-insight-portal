import { useEffect, useState } from "react";
import { MetricCard } from "@/components/MetricCard";
import {
  PhoneCall,
  UserPlus,
  PhoneOff,
  BarChart3,
  Phone,
  Clock,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API_BASE_URL = "http://31.220.107.112:8888";

// Function to get the full month name
const getMonthName = (monthIndex) => {
  return new Date(2025, monthIndex, 1).toLocaleString("en-US", { month: "long" });
};

// Generate months list
const months = Array.from({ length: 12 }, (_, i) => getMonthName(i));

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(getMonthName(new Date().getMonth()));
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async (month) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/${month}`);
      const result = await response.json();
      if (result.data && result.data.length > 0) {
        setData(result.data[0]); // Assuming only one month's data is returned
      } else {
        setData(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(selectedMonth);
  }, [selectedMonth]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Your call center performance at a glance
          </p>
        </div>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            title="Call Volume"
            value={data ? data["Total New Client Inbound Calls"] ?? "N/A" : "N/A"}
            icon={<Phone className="h-4 w-4 text-primary" />}
            description="Total calls this month"
          />
          <MetricCard
            title="Missed Calls"
            value={data ? data["Missed Calls on New Client Line"] ?? "N/A" : "N/A"}
            icon={<PhoneOff className="h-4 w-4 text-destructive" />}
            description="Calls Missed in this month"
          />
          <MetricCard
            title="New Clients"
            value={data ? data["Total New Client Unique Inbound Calls"] ?? "N/A" : "N/A"}
            icon={<UserPlus className="h-4 w-4 text-primary" />}
            description="This month"
          />
          <MetricCard
            title="Total Patients"
            value={data ? data["NPTs (Total)"] ?? "N/A" : "N/A"}
            icon={<BarChart3 className="h-4 w-4 text-primary" />}
            description="Total Patients in this month"
          />
          <MetricCard
            title="Conversion Rate"
            value={data ? data["Conversion of Calls on New Client Line to Clients Booked from Phone Calls"] ?? "N/A" : "N/A"}
            icon={<PhoneCall className="h-4 w-4 text-primary" />}
            description="Average per FDO"
          />
          <MetricCard
            title="Available Hours"
            value="N/A"
            icon={<Clock className="h-4 w-4 text-primary" />}
            description="Team availability Hour Count for month"
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
