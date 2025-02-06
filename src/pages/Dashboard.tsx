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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const mockData = {
  performance: "85%",
  newClients: 127,
  missedCalls: 45,
  conversionRate: "32%",
  callVolume: 1234,
  availableHours: 72.5,
  chartData: [
    { name: "Mon", calls: 400 },
    { name: "Tue", calls: 300 },
    { name: "Wed", calls: 500 },
    { name: "Thu", calls: 280 },
    { name: "Fri", calls: 590 },
    { name: "Sat", calls: 320 },
    { name: "Sun", calls: 250 },
  ],
};

const Dashboard = () => {
  const [dateRange, setDateRange] = useState("all");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Your call center performance at a glance
          </p>
        </div>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Performance"
          value={mockData.performance}
          icon={<BarChart3 className="h-4 w-4 text-primary" />}
          description="Overall efficiency score"
        />
        <MetricCard
          title="New Clients"
          value={mockData.newClients}
          icon={<UserPlus className="h-4 w-4 text-primary" />}
          description="This month"
        />
        <MetricCard
          title="Missed Calls"
          value={mockData.missedCalls}
          icon={<PhoneOff className="h-4 w-4 text-destructive" />}
          description="Last 24 hours"
        />
        <MetricCard
          title="Conversion Rate"
          value={mockData.conversionRate}
          icon={<PhoneCall className="h-4 w-4 text-primary" />}
          description="Average per FDO"
        />
        <MetricCard
          title="Call Volume"
          value={mockData.callVolume}
          icon={<Phone className="h-4 w-4 text-primary" />}
          description="Total calls this month"
        />
        <MetricCard
          title="Available Hours"
          value={`${mockData.availableHours.toFixed(1)} hrs`}
          icon={<Clock className="h-4 w-4 text-primary" />}
          description="Team availability"
        />
      </div>

      <div className="h-[400px]">
        <h3 className="text-lg font-semibold mb-4">Weekly Call Volume</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockData.chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="calls"
              stroke="#205295"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;