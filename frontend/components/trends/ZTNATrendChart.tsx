import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface ZTNATrendDataPoint {
  time: string;
  current: number;
  previous: number;
}

interface ZTNATrendChartProps {
  data: ZTNATrendDataPoint[];
  title?: string;
}

export function ZTNATrendChart({
  data,
  title = 'Zero Trust 使用趨勢',
}: ZTNATrendChartProps) {
  return (
    <div className="card-dark rounded-xl p-5 border border-slate-700/50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-lg">{title}</h2>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-500" />
            <span className="text-slate-400">當前期間</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-500" />
            <span className="text-slate-400">上一期間</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
          <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '12px' }} />
          <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#fff',
            }}
            labelStyle={{ color: '#94a3b8' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
          <Line
            type="monotone"
            dataKey="current"
            stroke="#06b6d4"
            strokeWidth={2}
            dot={{ fill: '#06b6d4', r: 3 }}
            name="當前期間"
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="previous"
            stroke="#64748b"
            strokeWidth={2}
            dot={{ fill: '#64748b', r: 3 }}
            name="上一期間"
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
