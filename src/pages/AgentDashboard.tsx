import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState } from "react";

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
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAgents = mockAgents.filter((agent) =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Agent Dashboard</h2>
        <p className="text-muted-foreground">
          Monitor individual agent performance
        </p>
      </div>

      <div className="flex justify-between items-center">
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
              <TableRow key={agent.id}>
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