import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export const FeatureImportanceChart = ({ factors = [] }) => {
  if (!factors || factors.length === 0) {
    return (
      <div className="py-8 text-center text-stone-500 font-mono text-xs">
        No feature contribution metrics available for this assessment.
      </div>
    );
  }

  // Take top 6 factors
  const data = factors.slice(0, 6).map((item) => ({
    name: item.label || item.feature,
    value: Number(item.percentage || (item.importance * 100).toFixed(1)),
    valWithUnit: `${item.value} ${item.unit || ''}`.trim(),
    importance: item.importance,
  }));

  // Warm clinical gradient colors (coral, amber, terracotta)
  const colors = ['#f45d48', '#ea580c', '#f59e0b', '#d97706', '#fb7185', '#22c55e'];

  return (
    <div className="w-full">
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 15, left: 20, bottom: 5 }}
          >
            <XAxis
              type="number"
              domain={[0, 'dataMax + 5']}
              unit="%"
              tick={{ fontSize: 10, fill: '#78716c', fontFamily: 'monospace' }}
              axisLine={{ stroke: '#282e3a' }}
              tickLine={{ stroke: '#282e3a' }}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: '#d6d3d1', fontFamily: 'Plus Jakarta Sans' }}
              width={95}
              axisLine={{ stroke: '#282e3a' }}
              tickLine={false}
              tickFormatter={(val) => (val.length > 14 ? `${val.substring(0, 12)}...` : val)}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-obsidian-900 border border-white/10 text-stone-100 p-3 rounded-lg shadow-2xl text-xs space-y-1 z-50">
                      <p className="font-serif text-sm font-medium text-stone-100">{d.name}</p>
                      <p className="text-vital-coral font-mono">Weight: {d.value}%</p>
                      <p className="text-stone-400 font-mono text-[11px]">Recorded: <span className="text-stone-200">{d.valWithUnit}</span></p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[10px] font-mono text-stone-500 mt-2 text-center">
        * Parametric influence on gradient boosting tree risk partition.
      </p>
    </div>
  );
};
