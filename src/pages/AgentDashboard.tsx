import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const mockAgents = [
  {
    id: 1,
    name: "John Smith",
    performance: "92%",
    newClients: 45,
    missedCalls: 12,
    conversionRate: "38%",
    callVolume: 384,
    availableHours: "98%",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    performance: "88%",
    newClients: 38,
    missedCalls: 15,
    conversionRate: "35%",
    callVolume: 356,
    availableHours: "95%",
  },
  {
    id: 3,
    name: "Michael Brown",
    performance: "85%",
    newClients: 32,
    missedCalls: 18,
    conversionRate: "30%",
    callVolume: 312,
    availableHours: "92%",
  },
];

const AgentDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [performanceFilter, setPerformanceFilter] = useState("");
  const [dateRange, setDateRange] = useState("all");

  const filteredAgents = mockAgents.filter((agent) => {
    const matchesSearch = agent.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    const performanceNum = parseInt(agent.performance);
    const matchesPerformance = 
      performanceFilter === "" ||
      (performanceFilter === "above90" && performanceNum >= 90) ||
      (performanceFilter === "80to90" && performanceNum >= 80 && performanceNum < 90) ||
      (performanceFilter === "below80" && performanceNum < 80);

    return matchesSearch && matchesPerformance;
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">MacNulty Call Center</h2>
        <p className="text-muted-foreground">
          Monitor individual agent performance
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Input
          placeholder="Search agents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-4">
          <Select value={performanceFilter} onValueChange={setPerformanceFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Performance Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Performance</SelectItem>
              <SelectItem value="above90">Above 90%</SelectItem>
              <SelectItem value="80to90">80% to 90%</SelectItem>
              <SelectItem value="below80">Below 80%</SelectItem>
            </SelectContent>
          </Select>
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
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead>New Clients</TableHead>
              <TableHead>Missed Calls</TableHead>
              <TableHead>Conversion Rate</TableHead>
              <TableHead>Call Volume</TableHead>
              <TableHead>Available Hours</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAgents.map((agent) => (
              <TableRow 
                key={agent.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => navigate(`/agents/${agent.name}`)}
              >
                <TableCell className="font-medium">{agent.name}</TableCell>
                <TableCell>{agent.performance}</TableCell>
                <TableCell>{agent.newClients}</TableCell>
                <TableCell>{agent.missedCalls}</TableCell>
                <TableCell>{agent.conversionRate}</TableCell>
                <TableCell>{agent.callVolume}</TableCell>
                <TableCell>{agent.availableHours}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AgentDashboard;