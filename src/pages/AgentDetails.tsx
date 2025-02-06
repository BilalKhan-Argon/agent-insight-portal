import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
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
import { Phone, Users, PhoneOff, BarChart3, Clock } from "lucide-react";

const mockAgentData = {
  "John Smith": {
    performance: "92%",
    data: [
      { month: "Jan", calls: 120, conversions: 45 },
      { month: "Feb", calls: 150, conversions: 60 },
      { month: "Mar", calls: 180, conversions: 72 },
    ],
  },
  "Sarah Johnson": {
    performance: "88%",
    data: [
      { month: "Jan", calls: 100, conversions: 35 },
      { month: "Feb", calls: 130, conversions: 45 },
      { month: "Mar", calls: 160, conversions: 56 },
    ],
  },
  "Michael Brown": {
    performance: "85%",
    data: [
      { month: "Jan", calls: 90, conversions: 27 },
      { month: "Feb", calls: 120, conversions: 36 },
      { month: "Mar", calls: 150, conversions: 45 },
    ],
  },
};

const AgentDetails = () => {
  const navigate = useNavigate();
  const { agentName } = useParams();
  const agent = agentName ? mockAgentData[agentName as keyof typeof mockAgentData] : null;

  if (!agent) {
    return <div>Agent not found</div>;
  }

  return (
    <div className="space-y-8">
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
          {agentName} - {agent.performance} Performance
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Calls"
          value="384"
          icon={<Phone className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="New Clients"
          value="45"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Missed Calls"
          value="12"
          icon={<PhoneOff className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Available Hours"
          value="98%"
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Trends</h3>
        <LineChart
          width={800}
          height={400}
          data={agent.data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="calls"
            stroke="#8884d8"
            name="Total Calls"
          />
          <Line
            type="monotone"
            dataKey="conversions"
            stroke="#82ca9d"
            name="Conversions"
          />
        </LineChart>
      </div>
    </div>
  );
};

export default AgentDetails;