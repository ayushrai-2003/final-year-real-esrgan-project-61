
import * as React from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ChartConfig {
  [key: string]: {
    color: string
    label: string
  }
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
  children: React.ReactNode
}

export function ChartContainer({
  config,
  className,
  children,
  ...props
}: ChartContainerProps) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}

export function ChartTooltip({
  active,
  payload,
  label,
  formatter,
  labelFormatter,
  config,
}: any) {
  if (!active || !payload) {
    return null
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col">
          <span className="text-[0.70rem] uppercase text-muted-foreground">
            {labelFormatter ? labelFormatter(label) : label}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          {payload.map((item: any, index: number) => {
            const color = config[item.dataKey]?.color || item.color
            const label = config[item.dataKey]?.label || item.name

            return (
              <div
                key={`item-${index}`}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-1">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-[0.70rem] text-muted-foreground">
                    {label}
                  </span>
                </div>
                <span className="text-[0.70rem] font-medium">
                  {formatter
                    ? formatter(item.value, item.name, item, index)
                    : item.value}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
