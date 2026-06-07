"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  Cell,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

// --- User Growth Chart (Area) ---
const userGrowthData = [
  { month: "Jan", users: 4000 },
  { month: "Feb", users: 4500 },
  { month: "Mar", users: 5100 },
  { month: "Apr", users: 6000 },
  { month: "May", users: 6800 },
  { month: "Jun", users: 8000 },
  { month: "Jul", users: 10245 },
]

const userGrowthConfig = {
  users: {
    label: "Users",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig

export function UserGrowthChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Growth</CardTitle>
        <CardDescription>Total users over the last 7 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={userGrowthConfig} className="h-[250px] w-full">
          <AreaChart data={userGrowthData} margin={{ left: -20, right: 12, top: 12, bottom: 0 }}>
            <defs>
              <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-users)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-users)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="users"
              stroke="var(--color-users)"
              fillOpacity={1}
              fill="url(#fillUsers)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

// --- Revenue Chart (Bar) ---
const revenueData = [
  { month: "Jan", revenue: 12000 },
  { month: "Feb", revenue: 15000 },
  { month: "Mar", revenue: 13500 },
  { month: "Apr", revenue: 18000 },
  { month: "May", revenue: 22000 },
  { month: "Jun", revenue: 24500 },
  { month: "Jul", revenue: 31000 },
]

const revenueConfig = {
  revenue: {
    label: "Revenue ($)",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
        <CardDescription>Monthly revenue across all plans</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={revenueConfig} className="h-[250px] w-full">
          <BarChart data={revenueData} margin={{ left: -20, right: 12, top: 12, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

// --- Device Usage Chart (Pie) ---
const deviceData = [
  { device: "desktop", visitors: 4500, fill: "var(--color-desktop)" },
  { device: "mobile", visitors: 3200, fill: "var(--color-mobile)" },
  { device: "tablet", visitors: 1100, fill: "var(--color-tablet)" },
]

const deviceConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "var(--primary)", // Keeps the neon green
  },
  mobile: {
    label: "Mobile",
    color: "oklch(0.8 0.2 90)", // Neon Yellow
  },
  tablet: {
    label: "Tablet",
    color: "oklch(0.65 0.25 25)", // Neon Red
  },
} satisfies ChartConfig

export function DeviceUsageChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Usage</CardTitle>
        <CardDescription>Distribution of sessions by device</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={deviceConfig} className="h-[250px] w-full mx-auto aspect-square pb-0">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={deviceData}
              dataKey="visitors"
              nameKey="device"
              innerRadius={60}
              strokeWidth={5}
            />
            <ChartLegend
              content={<ChartLegendContent />}
              className="-translate-y-2 flex-wrap gap-2 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

// --- Active Sessions Chart (Line) ---
const sessionsData = [
  { time: "00:00", sessions: 200 },
  { time: "04:00", sessions: 150 },
  { time: "08:00", sessions: 800 },
  { time: "12:00", sessions: 1200 },
  { time: "16:00", sessions: 1400 },
  { time: "20:00", sessions: 900 },
  { time: "23:59", sessions: 350 },
]

const sessionsConfig = {
  sessions: {
    label: "Active Sessions",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function ActiveSessionsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Sessions</CardTitle>
        <CardDescription>Concurrent sessions over 24 hours</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={sessionsConfig} className="h-[250px] w-full">
          <LineChart data={sessionsData} margin={{ left: -20, right: 12, top: 12, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="sessions"
              stroke="var(--color-sessions)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
