import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { AlertTriangle, TrendingDown, DollarSign, Zap, Phone, MessageSquare, Users, ChevronDown, ChevronUp, Clock } from 'lucide-react'
import { churnStudents, frequencyTrend, segmentDistribution, riskConfig, actionConfig, segmentConfig } from '../data/churnData'

const TABS = [
  { id: 'all',        label: 'Todos',       count: null },
  { id: 'critical',   label: 'Crítico',     count: null },
  { id: 'high',       label: 'Alto',        count: null },
  { id: 'medium',     label: 'Médio',       count: null },
  { id: 'monitoring', label: 'Monitorando', count: null },
]

function ScoreBar({ score, riskLevel }) {
  const cfg = riskConfig[riskLevel]
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: cfg.bar }} />
      </div>
      <span className="text-xs font-bold w-7 text-right" style={{ color: cfg.bar }}>{score}</span>
    </div>
  )
}

function StudentRow({ student }) {
  const [expanded, setExpanded] = useState(false)
  const risk = riskConfig[student.riskLevel]
  const action = actionConfig[student.action.type]
  const seg = segmentConfig[student.segment] || { bg: 'bg-slate-700', text: 'text-slate-300' }

  return (
    <>
      <tr
        className="border-b border-slate-800 hover:bg-slate-800/40 cursor-pointer transition-colors"
        onClick={() => setExpanded(v => !v)}
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${risk.dot}`}>
              {student.initials}
            </div>
            <div>
              <p className="text-sm font-medium text-white leading-tight">{student.name}</p>
              <p className="text-[10px] text-slate-500">{student.plan} · R${student.planValue}/mês · {student.daysAsMember}d</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 w-36">
          <ScoreBar score={student.churnScore} riskLevel={student.riskLevel} />
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded mt-1 inline-block ${risk.bg} ${risk.text}`}>
            {risk.label}
          </span>
        </td>
        <td className="px-4 py-3 text-center">
          <p className="text-sm font-semibold text-white">{student.lastCheckinDays}d</p>
          <p className="text-[10px] text-slate-500">último visit</p>
        </td>
        <td className="px-4 py-3 text-center">
          <p className="text-sm font-semibold text-red-400">-{student.frequencyDrop}%</p>
          <p className="text-[10px] text-slate-500">{student.weeklyFreqPrev}→{student.weeklyFreqCurrent}x/sem</p>
        </td>
        <td className="px-4 py-3 text-center">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            student.paymentStatus === 'atrasado'
              ? 'bg-red-500/20 text-red-400'
              : 'bg-emerald-500/20 text-emerald-400'
          }`}>
            {student.paymentStatus === 'atrasado' ? `${student.paymentDaysLate}d atraso` : 'Em dia'}
          </span>
        </td>
        <td className="px-4 py-3 text-center">
          <p className="text-sm font-semibold text-white">R${student.ltv.toLocaleString('pt-BR')}</p>
        </td>
        <td className="px-4 py-3">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${action.bg} ${action.text} ${action.border}`}>
            {student.action.label}
          </span>
          <p className="text-[10px] text-slate-500 mt-0.5">{student.action.channel}</p>
        </td>
        <td className="px-4 py-3 text-slate-500">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </td>
      </tr>
      {expanded && (
        <tr className="bg-slate-900/60 border-b border-slate-800">
          <td colSpan={8} className="px-6 py-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-semibold mb-1.5">Sinais Detectados</p>
                <ul className="space-y-1">
                  {student.signals.map((s, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${risk.dot}`} />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Engajamento', value: `${student.engagementScore}/100` },
                  { label: 'LTV Acumulado', value: `R$${student.ltv.toLocaleString('pt-BR')}` },
                  { label: 'Segmento', value: student.segment },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-800 rounded-lg p-2">
                    <p className="text-[10px] text-slate-500 mb-0.5">{label}</p>
                    <p className="text-xs font-semibold text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

const ACTION_GROUPS = [
  {
    type: 'urgent_contact',
    icon: Phone,
    title: 'Contato Urgente',
    color: '#EF4444',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    textColor: 'text-red-400',
  },
  {
    type: 'payment_renegotiation',
    icon: DollarSign,
    title: 'Renegociação de Pagamento',
    color: '#F59E0B',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    textColor: 'text-amber-400',
  },
  {
    type: 'reengagement_class',
    icon: Zap,
    title: 'Reengajamento / Onboarding',
    color: '#8B5CF6',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
    textColor: 'text-violet-400',
  },
  {
    type: 'retention_offer',
    icon: TrendingDown,
    title: 'Oferta de Retenção',
    color: '#10B981',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
  },
  {
    type: 'whatsapp_campaign',
    icon: MessageSquare,
    title: 'Campanha WhatsApp',
    color: '#3B82F6',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    textColor: 'text-blue-400',
  },
]

function NextActionsPanel() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <p className="text-sm font-bold text-white mb-1">Próximas Ações — Next Best Action</p>
      <p className="text-xs text-slate-400 mb-4">Ações priorizadas por risco e impacto no LTV</p>
      <div className="space-y-3">
        {ACTION_GROUPS.map(group => {
          const students = churnStudents.filter(s => s.action.type === group.type)
          if (!students.length) return null
          const Icon = group.icon
          const totalLtv = students.reduce((s, st) => s + st.ltv, 0)
          return (
            <div key={group.type} className={`rounded-xl p-3 border ${group.bg} ${group.border}`}>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: group.color + '30' }}>
                  <Icon size={14} style={{ color: group.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <p className={`text-xs font-semibold ${group.textColor}`}>{group.title}</p>
                    <span className="text-[10px] text-slate-400 flex-shrink-0">
                      {students.length} aluno{students.length > 1 ? 's' : ''} · LTV R${totalLtv.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {students.map(st => (
                      <span key={st.id} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                        {st.name.split(' ')[0]} {st.name.split(' ').slice(-1)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const FREQ_LINES = [
  { key: 'critico',  color: '#EF4444', label: 'Crítico' },
  { key: 'alto',     color: '#F97316', label: 'Alto' },
  { key: 'medio',    color: '#EAB308', label: 'Médio' },
  { key: 'saudavel', color: '#10B981', label: 'Saudável' },
]

const CustomFreqTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs shadow-xl">
      <p className="text-slate-400 font-semibold mb-1.5">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-medium">
          {FREQ_LINES.find(l => l.key === p.dataKey)?.label}: {p.value}x/sem
        </p>
      ))}
    </div>
  )
}

export default function ChurnPage() {
  const [activeTab, setActiveTab] = useState('all')

  const criticalCount = churnStudents.filter(s => s.riskLevel === 'critical').length
  const highCount = churnStudents.filter(s => s.riskLevel === 'high').length
  const atRiskLtv = churnStudents
    .filter(s => s.riskLevel === 'critical' || s.riskLevel === 'high')
    .reduce((sum, s) => sum + s.ltv, 0)
  const totalStudents = segmentDistribution.reduce((s, seg) => s + seg.value, 0)
  const atRiskStudents = segmentDistribution.find(s => s.name === 'Em Risco')?.value || 0
  const defaulters = segmentDistribution.find(s => s.name === 'Inadimplente')?.value || 0
  const churnRate = (((atRiskStudents + defaulters) / totalStudents) * 100).toFixed(1)

  const tabCounts = {
    all: churnStudents.length,
    critical: criticalCount,
    high: highCount,
    medium: churnStudents.filter(s => s.riskLevel === 'medium').length,
    monitoring: churnStudents.filter(s => s.riskLevel === 'monitoring').length,
  }

  const filtered = activeTab === 'all' ? churnStudents : churnStudents.filter(s => s.riskLevel === activeTab)

  return (
    <div className="h-full overflow-auto bg-slate-950">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Churn & Retenção</h1>
            <p className="text-sm text-slate-400 mt-0.5">Inteligência preditiva de abandono — 20 alunos monitorados</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
            <Clock size={12} />
            <span>Atualizado agora</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-4 gap-4">
          {[
            {
              label: 'Alunos em Risco Crítico',
              value: criticalCount,
              sub: `+ ${highCount} em risco alto`,
              icon: AlertTriangle,
              color: '#EF4444',
              bg: 'bg-red-500/10',
              border: 'border-red-500/30',
            },
            {
              label: 'LTV em Risco',
              value: `R$${atRiskLtv.toLocaleString('pt-BR')}`,
              sub: 'Crítico + Alto risco',
              icon: DollarSign,
              color: '#F97316',
              bg: 'bg-orange-500/10',
              border: 'border-orange-500/30',
            },
            {
              label: 'Taxa de Churn Prevista',
              value: `${churnRate}%`,
              sub: 'Em Risco + Inadimplente',
              icon: TrendingDown,
              color: '#EAB308',
              bg: 'bg-yellow-500/10',
              border: 'border-yellow-500/30',
            },
            {
              label: 'Ações Pendentes',
              value: churnStudents.filter(s => s.riskLevel === 'critical' || s.riskLevel === 'high').length,
              sub: 'Crítico + Alto prioridade',
              icon: Zap,
              color: '#8B5CF6',
              bg: 'bg-violet-500/10',
              border: 'border-violet-500/30',
            },
          ].map(card => {
            const Icon = card.icon
            return (
              <div key={card.label} className={`${card.bg} border ${card.border} rounded-2xl p-4`}>
                <div className="flex items-start justify-between mb-3">
                  <p className="text-xs text-slate-400 leading-tight pr-2">{card.label}</p>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: card.color + '25' }}>
                    <Icon size={16} style={{ color: card.color }} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{card.value}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{card.sub}</p>
              </div>
            )
          })}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-3 gap-4">
          {/* Frequency trend */}
          <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-sm font-bold text-white mb-0.5">Queda de Frequência por Grupo de Risco</p>
            <p className="text-xs text-slate-400 mb-4">Visitas/semana nas últimas 8 semanas</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={frequencyTrend} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="week" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 4]} />
                <RechartTooltip content={<CustomFreqTooltip />} />
                {FREQ_LINES.map(line => (
                  <Line
                    key={line.key}
                    type="monotone"
                    dataKey={line.key}
                    stroke={line.color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-3">
              {FREQ_LINES.map(l => (
                <div key={l.key} className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 rounded-full inline-block" style={{ background: l.color }} />
                  <span className="text-[11px] text-slate-400">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Segment donut */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-sm font-bold text-white mb-0.5">Distribuição de Segmentos</p>
            <p className="text-xs text-slate-400 mb-2">{totalStudents} alunos ativos</p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={segmentDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {segmentDistribution.map((seg, i) => (
                    <Cell key={i} fill={seg.color} />
                  ))}
                </Pie>
                <RechartTooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 11 }}
                  labelStyle={{ color: '#fff' }}
                  itemStyle={{ color: '#94a3b8' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1 mt-1">
              {segmentDistribution.map(seg => (
                <div key={seg.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: seg.color }} />
                    <span className="text-[10px] text-slate-400">{seg.name}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-300">{seg.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Next best actions */}
        <NextActionsPanel />

        {/* Student table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white">Radar de Alunos em Risco</p>
              <p className="text-xs text-slate-400 mt-0.5">Clique em um aluno para ver os sinais detectados</p>
            </div>
            <div className="flex gap-1">
              {TABS.map(tab => {
                const count = tabCounts[tab.id]
                const isActive = activeTab === tab.id
                const risk = tab.id !== 'all' ? riskConfig[tab.id] : null
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all flex items-center gap-1 ${
                      isActive
                        ? 'bg-violet-600/90 border-violet-500 text-white'
                        : 'bg-transparent border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {tab.label}
                    <span className={`text-[10px] font-bold px-1 rounded ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  {['Aluno', 'Risco Churn', 'Último Visit', 'Frequência', 'Pagamento', 'LTV', 'Próxima Ação', ''].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(student => (
                  <StudentRow key={student.id} student={student} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
