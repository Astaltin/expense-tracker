import { Card, CardContent } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { Label, Pie, PieChart } from 'recharts'
import { Expense } from '../App'

type ChartProps = { data: Expense[] }

const chartConfig = {
  chrome: {
    label: 'Clothing',
    color: 'hsl(var(--chart-1))'
  },
  safari: {
    label: 'Education',
    color: 'hsl(var(--chart-2))'
  },
  firefox: {
    label: 'Food',
    color: 'hsl(var(--chart-3))'
  },
  edge: {
    label: 'Others',
    color: 'hsl(var(--chart-4))'
  },
  other: {
    label: 'Transportation',
    color: 'hsl(var(--chart-5))'
  }
} satisfies ChartConfig

export default function Chart({ data }: ChartProps) {
  const chartData = data
  const totalVisitors = chartData.reduce((acc, curr) => acc + curr.visitors, 0)

  return (
    <Card className="col-start-1">
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Items
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
