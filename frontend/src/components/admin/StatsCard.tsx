import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CountUp from "react-countup";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number | undefined | null;
  description: string;
  icon: React.ReactNode;
  isCurrency?: boolean;
}

export function StatsCard({ 
  title, 
  value = 0, 
  description, 
  icon,
  isCurrency = false 
}: StatsCardProps) {
  const displayValue = formatNumber(value);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isCurrency ? (
            <CountUp
              start={0}
              end={displayValue}
              duration={2}
              separator=","
              decimals={0}
              prefix="₹"
            />
          ) : (
            <CountUp
              start={0}
              end={displayValue}
              duration={2}
              separator=","
            />
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
} 