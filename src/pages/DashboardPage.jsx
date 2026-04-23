import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line,
} from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, Users, Target, Zap, ChevronRight } from 'lucide-react'
import { kpiData, zones } from '../data/gymData'

function StatCard({ label, value, sub, icon: Icon, color = 'violet', trend, trendLabel }) {
  const colors = {
    violet: 'from-violet-600/20 to-violet-600/5 border-violet-600/30 text-violet-400',
    blue: 'from-blue-600/20 to-blue-600/5 border-blue-600/30 text-blue-400',
    emerald: 'from-emerald-600/20 to-emerald-600/5 border-emerald-600/30 text-emerald-400',
    amber: 'from-amber-600/20 to-amber-600/5 border-amber-600/30 text-amber-400',
    rose: 'from-rose-600/20 to-rose-600/5 border-rose-600/30 text-rose-400',
  }
  const iconColors = {
    violet: 'bg-violet-600/20 text-violet-400',
    blue: 'bg-blue-600/20 text-blue-400',
    emerald: 'bg-emerald-600/20 text-emerald-400',
    amber: 'bg-amber-600/20 text-amber-400',
    rose: 'bg-rose-600/20 text-rose-400',
  }
  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-2xl p-4`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconColors[color]}`}>
          <Icon size={18} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
      <p className="text-sm text-slate-300 font-medium">{label}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
      {trendLabel && <p className="text-xs text-slate-500 mt-1">{trendLabel}</p>}
    </div>
  )
}

function ConversionGauge({ rate }) {
  const data = [
    { name: 'Taxa', value: rate, fill: rate >= 20 ? '#10B981' : '#F59E0B' },
    { name: 'Restante', value: 100 - rate, fill: '#1e293b' },
  ]
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <ResponsiveContainer width={140} height={80}>
          <PieChart>
            <Pie
              data={data}
              cx={70} cy={70}
              startAngle={180}
              endAngle={0}
              innerRadius={50}
              outerRadius={68}
              paddingAngle={0}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <p className="text-2xl font-bold text-white leading-none">{rate}%</p>
          <p className="text-[10px] text-slate-400">conversão</p>
        </div>
      </div>
      <p className={`text-xs font-semibold mt-1 ${rate >= 20 ? 'text-emerald-400' : 'text-amber-400'}`}>
        {rate >= 20 ? '✓ Meta atingida (>20%)' : '⚠ Abaixo da meta'}
      </p>
    </div>
  )
}

const CustomTooltipDark = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 shadow-xl">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs font-semibold" style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const { overview, byZone, weeklyTrend, enrollmentHistory } = kpiData
  const budgetPieData = byZone.map(z => ({ name: `Zona ${z.zone}`, value: z.budget, color: z.color }))

  return (
    <div className="h-full overflow-auto bg-slate-950">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Dashboard de KPIs</h1>
            <p className="text-sm text-slate-400 mt-0.5">Sprint 30 Dias — Abril 2026 · Itaim Paulista</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-semibold text-emerald-400">Sprint Ativo</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Top stats */}
        <div className="grid grid-cols-5 gap-4">
          <StatCard
            label="Total de Leads"
            value={overview.totalLeads}
            icon={Users}
            color="violet"
            trend={18}
            trendLabel="vs sem anterior"
          />
          <StatCard
            label="Visitas na Academia"
            value={overview.totalVisits}
            icon={Target}
            color="blue"
            trend={12}
            trendLabel="vs sem anterior"
          />
          <StatCard
            label="Taxa de Conversão"
            value={`${overview.conversionRate}%`}
            icon={Zap}
            color="emerald"
            sub="Meta: >20% de visita para matrícula"
          />
          <StatCard
            label="CAC Médio"
            value={`R$ ${overview.cac}`}
            icon={DollarSign}
            color="amber"
            trend={-5}
            trendLabel="vs mês anterior"
          />
          <StatCard
            label="Matrículas Líquidas"
            value={overview.netEnrollments}
            icon={TrendingUp}
            color="rose"
            sub={`Meta: ${overview.targetMin}–${overview.targetMax} alunos`}
          />
        </div>

        {/* Progress bar to target */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-base font-bold text-white">Progresso da Meta de Captação</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {overview.netEnrollments} matrículas de {overview.targetMin}–{overview.targetMax} projetadas no sprint
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-violet-400">
                {Math.round((overview.netEnrollments / overview.targetMin) * 100)}%
              </p>
              <p className="text-xs text-slate-400">do piso</p>
            </div>
          </div>
          <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-600 to-violet-400 transition-all"
              style={{ width: `${Math.min(100, (overview.netEnrollments / overview.targetMin) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5 text-[10px] text-slate-500">
            <span>0</span>
            <span>Piso: {overview.targetMin}</span>
            <span>Teto: {overview.targetMax}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Weekly trend */}
          <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-base font-bold text-white mb-1">Tendência Semanal</p>
            <p className="text-xs text-slate-400 mb-4">Leads, visitas e matrículas por semana do sprint</p>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={weeklyTrend} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="gLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gVisitas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gMatriculas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="week" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltipDark />} />
                <Area type="monotone" dataKey="leads" name="Leads" stroke="#7C3AED" fill="url(#gLeads)" strokeWidth={2} dot={{ fill: '#7C3AED', r: 3 }} />
                <Area type="monotone" dataKey="visitas" name="Visitas" stroke="#2563EB" fill="url(#gVisitas)" strokeWidth={2} dot={{ fill: '#2563EB', r: 3 }} />
                <Area type="monotone" dataKey="matriculas" name="Matrículas" stroke="#10B981" fill="url(#gMatriculas)" strokeWidth={2} dot={{ fill: '#10B981', r: 3 }} />
                <Legend
                  wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                  formatter={(v) => <span style={{ color: '#94a3b8' }}>{v}</span>}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Conversion gauge + budget pie */}
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <p className="text-sm font-bold text-white mb-3">Conversão Visita → Matrícula</p>
              <ConversionGauge rate={overview.conversionRate} />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <p className="text-sm font-bold text-white mb-3">Alocação de Verba</p>
              <ResponsiveContainer width="100%" height={110}>
                <PieChart>
                  <Pie data={budgetPieData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value" strokeWidth={0}>
                    {budgetPieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => active && payload?.length ? (
                      <div className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white">
                        {payload[0].name}: R$ {payload[0].value.toLocaleString('pt-BR')}
                      </div>
                    ) : null}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-1 mt-1">
                {budgetPieData.map(d => (
                  <div key={d.name} className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                    {d.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* By zone table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <p className="text-base font-bold text-white mb-1">Desempenho por Zona</p>
          <p className="text-xs text-slate-400 mb-4">Métricas detalhadas por micro-frente de captação</p>
          <div className="space-y-3">
            {byZone.map((z, i) => {
              const zone = zones.find(x => x.id === z.zone)
              const convRate = ((z.conversions / z.visits) * 100).toFixed(1)
              const progressPct = Math.min(100, (z.conversions / z.targetMin) * 100)
              return (
                <div key={z.zone} className="grid grid-cols-7 gap-3 items-center py-3 border-b border-slate-800 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ background: z.color }}>
                      {z.zone}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-white">{zone?.shortName}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${zone?.priorityBg} ${zone?.priorityText}`}>
                        {zone?.priority}
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-white">{z.leads}</p>
                    <p className="text-[10px] text-slate-500">Leads</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-white">{z.visits}</p>
                    <p className="text-[10px] text-slate-500">Visitas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-white">{z.conversions}</p>
                    <p className="text-[10px] text-slate-500">Matrículas</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-sm font-bold ${parseFloat(convRate) >= 20 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {convRate}%
                    </p>
                    <p className="text-[10px] text-slate-500">Conversão</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-white">R$ {z.cac}</p>
                    <p className="text-[10px] text-slate-500">CAC</p>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                      <span>{z.conversions}</span>
                      <span>{z.targetMin}</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${progressPct}%`, background: z.color }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Enrollment history */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <p className="text-base font-bold text-white mb-1">Evolução da Base de Alunos</p>
          <p className="text-xs text-slate-400 mb-4">Alunos ativos vs meta — últimos 6 meses + projeção Abril</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={kpiData.enrollmentHistory} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[700, 1000]} />
              <Tooltip content={<CustomTooltipDark />} />
              <Line type="monotone" dataKey="atual" name="Alunos Ativos" stroke="#7C3AED" strokeWidth={2.5} dot={{ fill: '#7C3AED', r: 4 }} />
              <Line type="monotone" dataKey="meta" name="Meta" stroke="#334155" strokeWidth={1.5} strokeDasharray="6 3" dot={false} />
              <Legend
                wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                formatter={(v) => <span style={{ color: '#94a3b8' }}>{v}</span>}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
