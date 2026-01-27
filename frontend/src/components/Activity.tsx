"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const barData = [
  { name: "Mon", hours: 4 },
  { name: "Tue", hours: 6 },
  { name: "Wed", hours: 3 },
  { name: "Thu", hours: 5 },
  { name: "Fri", hours: 7 },
  { name: "Sat", hours: 2 },
  { name: "Sun", hours: 4 },
  { name: "Mon", hours: 5 },
  { name: "Tue", hours: 3 },
  { name: "Wed", hours: 6 },
  { name: "Thu", hours: 4 },
  { name: "Fri", hours: 5 },
  { name: "Sat", hours: 3 },
  { name: "Sun", hours: 2 },
];

const pieData = [
  { name: "TypeScript", value: 35, color: "#3b82f6" },
  { name: "JSON", value: 15, color: "#f59e0b" },
  { name: "JavaScript", value: 20, color: "#eab308" },
  { name: "Bash", value: 5, color: "#22c55e" },
  { name: "Markdown", value: 8, color: "#06b6d4" },
  { name: "CSS", value: 5, color: "#8b5cf6" },
  { name: "TSConfig", value: 4, color: "#ec4899" },
  { name: "Git Config", value: 8, color: "#ef4444" },
];

const totalHours = 512.97;

export default function Activity() {
  return (
    <section id="activity" className="py-20 lg:py-32 bg-card">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full lg:ml-24">
        {/* Section Header */}
        <motion.div 
          className="flex items-end mb-12"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Number 7 - SVG with rounded corners and drop shadow */}
          <svg 
            width="71" 
            height="95" 
            viewBox="0 0 71 95" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="-mr-2"
          >
            <g filter="url(#filter0_d_7_activity)">
              <path d="M4 5C4 3.89543 4.89543 3 6 3H62.04C63.1446 3 64.04 3.89543 64.04 5V16.04C64.04 16.5936 63.8139 17.1236 63.4124 17.5037L35.8724 43.6037C35.4462 44.0074 35.207 44.5694 35.207 45.1574V83.8C35.207 84.9046 34.3116 85.8 33.207 85.8H18.207C17.1024 85.8 16.207 84.9046 16.207 83.8V45.1574C16.207 44.5694 15.9678 44.0074 15.5416 43.6037L4.62764 33.2637C4.22609 32.8836 4 32.3536 4 31.8V5Z" fill="#4876CE"/>
              <path d="M62.04 2.5C63.4207 2.5 64.54 3.61929 64.54 5V16.04C64.54 16.7354 64.2588 17.4023 63.7539 17.8828L36.2139 43.9828C35.5806 44.5817 35.207 45.3506 35.207 46.1574V83.8C35.207 85.1807 34.0877 86.3 32.707 86.3H18.207C16.8263 86.3 15.707 85.1807 15.707 83.8V46.1574C15.707 45.3506 15.3334 44.5817 14.7001 43.9828L3.78613 33.6426C3.28125 33.1621 3 32.4951 3 31.8V5C3 3.61929 4.11929 2.5 5.5 2.5H62.04Z" stroke="#5A92E3"/>
            </g>
            <defs>
              <filter id="filter0_d_7_activity" x="0" y="0" width="70.04" height="94.8" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dx="1" dy="2"/>
                <feGaussianBlur stdDeviation="2"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0.282353 0 0 0 0 0.462745 0 0 0 0 0.807843 0 0 0 1 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_7_activity"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_7_activity" result="shape"/>
              </filter>
            </defs>
          </svg>
          {/* Title text with line */}
          <div className="flex items-start mb-1 -mt-4">
            <h2 className="font-sans font-semibold text-[32px] leading-none tracking-[-0.02em] text-[#F9F9F9] whitespace-nowrap ml-2">
              Coding activity
            </h2>
            {/* Line */}
            <div className="w-[350px] h-[1px] bg-[#4876CE]/50 hidden lg:block ml-3 mt-[16px]" />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Bar Chart */}
          <motion.div 
            className="bg-background p-6 rounded-lg border border-border"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Weekly Coding Hours</h3>
              <span className="text-muted-foreground text-sm">● 2023</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #1e3a5f",
                      borderRadius: "8px",
                      color: "#ffffff",
                    }}
                  />
                  <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Pie Chart */}
          <motion.div 
            className="bg-background p-6 rounded-lg border border-border"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Languages</h3>
              <span className="text-muted-foreground text-sm">September 27</span>
            </div>
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="relative h-64 w-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #1e3a5f",
                        borderRadius: "8px",
                        color: "#ffffff",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{totalHours}</p>
                    <p className="text-muted-foreground text-xs">hours</p>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-2">
                {pieData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground text-sm">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
