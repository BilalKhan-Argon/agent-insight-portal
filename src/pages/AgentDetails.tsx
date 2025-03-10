import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { MetricCard } from "@/components/MetricCard";
import { Phone, Users, PhoneOff, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios"; 

const AgentDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const agent = location.state?.agent;
  const { agentName } = useParams();
  const [dateRange, setDateRange] = useState("month");
  const [data, setData] = useState([]);
  const [currentMonthData, setCurrentMonthData] = useState([]);
  const [cumulativeData, setCumulativeData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth() + 1
  );

  const API_URL = "http://31.220.107.112:8888/conversion-rate";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // const response = await axios.get(API_URL);
        const response = await axios.get(`${API_URL}?month=${selectedMonth}`);
        const fullData = response.data;
        setData(fullData);
        processCurrentMonthData(fullData);
      } catch (error) {
        console.error("Error fetching data", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [selectedMonth]);
  

  const processCurrentMonthData = (fullData) => {
    // const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    // Filter data for the current month
    const filteredData = fullData.filter((item) => {
      const [month, day, year] = item.date.split("/").map(Number);
      // return month === currentMonth && year === currentYear;
      return month === selectedMonth && year === currentYear;
    });

    // Extract data only for the selected agent
    const agentData = filteredData
      .map((item) => ({
        date: item.date,
        no_of_missed_calls: item.all_missed_calls,
        ...(item[agentName] ? { [agentName]: item[agentName] } : {}), // Filter only the agent's data
      }))
      .filter((item) => item[agentName]); // Remove entries without this agent

    setCurrentMonthData(agentData);

    // Calculate cumulative totals for the selected agent
    const cumulative = agentData.reduce(
      (acc, item) => {
        if (item[agentName]) {
          acc.total_calls += item[agentName].total_calls;
          acc.no_of_missed_calls += item.no_of_missed_calls;
          acc.total_bookings += item[agentName].total_bookings;
        }
        return acc;
      },
      { total_calls: 0, no_of_missed_calls: 0, total_bookings: 0 }
    );

    // Compute conversion rate
    cumulative.conversion_rate =
      cumulative.total_calls > 0
        ? ((cumulative.total_bookings / cumulative.total_calls) * 100).toFixed(
            2
          )
        : 0;

    setCumulativeData({ [agentName]: cumulative });
  };

  if (!agent) return <div>Agent not found</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">
            {agentName} - Performance Details
          </h2>
        </div>
        <Select
          value={selectedMonth.toString()}
          onValueChange={(value) => setSelectedMonth(Number(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Month" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
                {new Date(2024, i).toLocaleString("default", { month: "long" })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select> */}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Calls"
          value={agent.callVolume}
          icon={<Phone className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Missed Calls"
          value={agent.missedCalls}
          icon={<PhoneOff className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="New Clients"
          value={agent.newClients}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Conversion Rate"
          value={`${agent.conversionRate.toFixed(1)} %`}
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div>
        <h2>Current Month Summary</h2>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Total Calls</TableHead>
                <TableHead>Missed Calls</TableHead>
                <TableHead>New Clients</TableHead>
                <TableHead>Conversion Rate (%)</TableHead>
              </TableRow>
            </TableHeader>
            {loading ? (
              <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
            </div>
            ) : (
              <TableBody>
                {cumulativeData[agentName] && (
                  <TableRow
                    key={agentName}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell>{agentName}</TableCell>
                    <TableCell>
                      {cumulativeData[agentName].total_calls}
                    </TableCell>
                    <TableCell>{cumulativeData[agentName]?.no_of_missed_calls || 0}</TableCell>
                    <TableCell>
                      {cumulativeData[agentName].total_bookings}
                    </TableCell>
                    <TableCell>
                      {cumulativeData[agentName].conversion_rate}%
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            )}
          </Table>
        </div>
        <div style={{marginTop:50}} > </div>
        
        <h3>Daily Breakdown</h3>
        <Table className="border rounded-lg w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Total Calls</TableHead>
              <TableHead>Missed Calls</TableHead>
              <TableHead>New Clients</TableHead>
              <TableHead>Conversion Rate (%)</TableHead>
            </TableRow>
          </TableHeader>
          {loading ? (
            <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
          </div>
          ) : (
            <TableBody>
              {currentMonthData.map((item) => (
                <TableRow key={item.date} className="hover:bg-muted/50">
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{agentName}</TableCell>
                  <TableCell>{item[agentName]?.total_calls || 0}</TableCell>
                  <TableCell>
                    {item.no_of_missed_calls || 0}
                  </TableCell>
                  <TableCell>{item[agentName]?.total_bookings || 0}</TableCell>
                  <TableCell>
                    {item[agentName]?.conversion_rate || 0}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </div>
    </div>
  );
};

export default AgentDetails;
