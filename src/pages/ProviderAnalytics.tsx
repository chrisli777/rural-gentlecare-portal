import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const mockTreatmentData = [
  { month: 'Jan', success: 85, ongoing: 15 },
  { month: 'Feb', success: 82, ongoing: 18 },
  { month: 'Mar', success: 88, ongoing: 12 },
  { month: 'Apr', success: 87, ongoing: 13 },
  { month: 'May', success: 89, ongoing: 11 },
  { month: 'Jun', success: 90, ongoing: 10 },
];

const mockConditionData = [
  { name: 'Hypertension', value: 35 },
  { name: 'Diabetes', value: 25 },
  { name: 'Arthritis', value: 20 },
  { name: 'Heart Disease', value: 15 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ProviderAnalytics = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Treatment Outcomes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    success: {
                      label: "Successful",
                      color: "hsl(var(--primary))",
                    },
                    ongoing: {
                      label: "Ongoing",
                      color: "hsl(var(--muted))",
                    },
                  }}
                >
                  <LineChart data={mockTreatmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip />
                    <ChartLegend />
                    <Line
                      type="monotone"
                      dataKey="success"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="ongoing"
                      stroke="hsl(var(--muted))"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Patient Conditions Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer config={{}}>
                  <PieChart>
                    <Pie
                      data={mockConditionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mockConditionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProviderAnalytics;