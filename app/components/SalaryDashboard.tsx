import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Mockad data baserad på sökordet
const generateMockData = (keyword: string) => {
  // Här skulle vi normalt hämta data från en API baserat på sökordet
  // För nu använder vi hårdkodad data
  return {
    averageSalary: 45000,
    salaryRange: { min: 30000, max: 60000 },
    experienceLevels: [
      { name: 'Junior', value: 35000 },
      { name: 'Medel', value: 45000 },
      { name: 'Senior', value: 55000 },
    ],
    industries: [
      { name: 'IT', value: 30 },
      { name: 'Finans', value: 25 },
      { name: 'Hälsovård', value: 20 },
      { name: 'Utbildning', value: 15 },
      { name: 'Övrigt', value: 10 },
    ],
    jobProgress: [
      { name: 'Ansökningar', value: 75 },
      { name: 'Intervjuer', value: 50 },
      { name: 'Erbjudanden', value: 25 },
    ],
    marketDemand: [
      { name: 'Nuvarande efterfrågan', value: 85 },
      { name: 'Tillväxtprognos', value: 70 },
      { name: 'Konkurrens', value: 60 },
    ],
    demandOverYears: [
      { year: '2019', value: 65 },
      { year: '2020', value: 70 },
      { year: '2021', value: 78 },
      { year: '2022', value: 85 },
      { year: '2023', value: 90 },
    ],
  };
};

// Färger anpassade till sidans tema
const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b'];

interface SalaryDashboardProps {
  keyword: string;
}

const SalaryDashboard: React.FC<SalaryDashboardProps> = ({ keyword }) => {
  const data = generateMockData(keyword);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-indigo-800">Genomsnittlig lön</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.p 
            className="text-4xl font-bold text-indigo-600"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {data.averageSalary} kr/mån
          </motion.p>
          <p className="text-sm text-indigo-500 mt-2">Intervall: {data.salaryRange.min} - {data.salaryRange.max} kr/mån</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-indigo-800">Lön per erfarenhetsnivå</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.experienceLevels}>
              <CartesianGrid strokeDasharray="3 3" stroke="#a78bfa" />
              <XAxis dataKey="name" stroke="#7c3aed" />
              <YAxis stroke="#7c3aed" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#f5f3ff', borderColor: '#8b5cf6' }}
                labelStyle={{ color: '#6d28d9' }}
              />
              <Bar dataKey="value" fill="#8b5cf6">
                {data.experienceLevels.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-indigo-800">Branschfördelning</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.industries}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.industries.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff1f2', borderColor: '#f43f5e' }}
                labelStyle={{ color: '#be185d' }}
              />
              <Legend 
                layout="vertical" 
                align="right" 
                verticalAlign="middle"
                wrapperStyle={{ paddingLeft: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-indigo-800">Efterfrågan över tid</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.demandOverYears}>
              <CartesianGrid strokeDasharray="3 3" stroke="#a78bfa" />
              <XAxis dataKey="year" stroke="#7c3aed" />
              <YAxis stroke="#7c3aed" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#f5f3ff', borderColor: '#8b5cf6' }}
                labelStyle={{ color: '#6d28d9' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#6366f1" 
                strokeWidth={2}
                name="Efterfrågan"
                dot={{ fill: '#6366f1', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SalaryDashboard;