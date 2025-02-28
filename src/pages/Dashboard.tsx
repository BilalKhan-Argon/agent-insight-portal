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

const API_BASE_URL = "http://10.3.1.156:8000";

const getCurrentMonth = () => {
  return new Date().toLocaleString("en-US", { month: "long" }); // Example: "February"
};

const Dashboard = () => {
  // const [dateRange, setDateRange] = useState("all");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const month = getCurrentMonth();
      try {
        const response = await fetch(`${API_BASE_URL}/${month}`);
        const result = await response.json();
        if (result.data && result.data.length > 0) {
          setData(result.data[0]); // Assuming only one month's data is returned
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Your call center performance at a glance
          </p>
        </div>
        {/* <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select> */}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            title="Total No.Of Patients"
            value={data ? data["NPTs (Total)"] ?? "N/A" : "N/A"}
            icon={<BarChart3 className="h-4 w-4 text-primary" />}
            description="Overall efficiency score"
          />
          <MetricCard
            title="New Clients"
            value={data ? data["Total New Client Unique Inbound Calls"] ?? "N/A" : "N/A"}
            icon={<UserPlus className="h-4 w-4 text-primary" />}
            description="This month"
          />
          <MetricCard
            title="Missed Calls"
            value={data ? data["Missed Calls on New Client Line"] ?? "N/A" : "N/A"}
            icon={<PhoneOff className="h-4 w-4 text-destructive" />}
            description="Last 24 hours"
          />
          <MetricCard
            title="Conversion Rate"
            value={data ? data["Conversion of Calls on New Client Line to Clients Booked from Phone Calls"] ?? "N/A" : "N/A"}
            icon={<PhoneCall className="h-4 w-4 text-primary" />}
            description="Average per FDO"
          />
          <MetricCard
            title="Call Volume"
            value={data ? data["Total New Client Inbound Calls"] ?? "N/A" : "N/A"}
            icon={<Phone className="h-4 w-4 text-primary" />}
            description="Total calls this month"
          />
          <MetricCard
            title="Available Hours"
            value="N/A"
            icon={<Clock className="h-4 w-4 text-primary" />}
            description="Team availability"
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
