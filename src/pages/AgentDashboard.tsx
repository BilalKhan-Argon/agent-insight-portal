import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

const API_URL = "http://10.3.1.156:8000/conversion-rate";

const AgentDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [performanceFilter, setPerformanceFilter] = useState("all");
  const [hoursFilter, setHoursFilter] = useState("all");
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalMissedCalls, setTotalMissedCalls] = useState(0);
  // Fetch Data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API_URL);
        const formattedData = transformData(response.data);
        console.log("response", response.data);
        setAgents(Object.values(formattedData.agentMap)); // Convert object to array
        setTotalMissedCalls(formattedData.missedCalls);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const transformData = (apiData) => {
    const agentMap = {};
    let totalMissedCalls = 0;
    
    apiData.forEach((entry) => {
      totalMissedCalls += entry.all_missed_calls;
      
      Object.keys(entry).forEach((key) => {
        if (!["date", "all_calls", "all_missed_calls", "all_missed_calls_percentage"].includes(key)) {
          if (!agentMap[key]) {
            agentMap[key] = {
              id: key,
              name: key,
              performance: "N/A",
              newClients: 0,
              missedCalls: 0,
              conversionRate: 0,
              callVolume: 0,
              availableHours: "N/A",
              entries: 0,
            };
          }
  
          agentMap[key].newClients += entry[key].total_bookings;
          agentMap[key].missedCalls = totalMissedCalls;
          agentMap[key].conversionRate += entry[key].conversion_rate;
          agentMap[key].callVolume += entry[key].total_calls;
          agentMap[key].entries += 1;
          
        }
      });
    });
  
    return {
      agentMap: Object.values(agentMap), // Convert agentMap to an array
      missedCalls: totalMissedCalls,
    };
  };
  

  // Filtering logic
  const filteredAgents = agents.filter((agent) => 
    agent.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          MacNulty Call Center
        </h2>
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
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>New Clients</TableHead>
              <TableHead>Missed Calls</TableHead>
              <TableHead>Conversion Rate</TableHead>
              <TableHead>Call Volume</TableHead>
            </TableRow>
          </TableHeader>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <TableBody>
              {filteredAgents.map((agent) => (
                <TableRow
                  key={agent.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() =>
                    navigate(`/agents/${agent.name}`, { state: { agent } })
                  }
                >
                  <TableCell className="font-medium">{agent.name}</TableCell>
                  <TableCell>{agent.newClients}</TableCell>
                  <TableCell>{totalMissedCalls}</TableCell>
                  <TableCell>{agent.conversionRate.toFixed(2)}</TableCell>
                  <TableCell>{agent.callVolume}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </div>
    </div>
  );
};

export default AgentDashboard;
