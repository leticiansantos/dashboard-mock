import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { AlertTriangle, TrendingUp, ChevronDown, ChevronUp, Info } from 'lucide-react'
import { competitors, aggregatorColors, attractivenessConfig, zones } from '../data/gymData'

const aggregatorLabels = {
  'totalpass': 'TotalPass',
  'wellhub-basic': 'Wellhub Basic',
  'wellhub-basic-plus': 'Wellhub Basic+',
  'gurupass': 'Gurupass / Basic+',
}

function AggregatorBadge({ type, label }) {
  const cfg = aggregatorColors[type] || aggregatorColors['gurupass']
  return (
    <span className={`inline-flex items-center text-[11px] px-2 py-0.5 rounded-full border font-medium ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      {label}
    </span>
  )
}

function AttractivBadge({ value }) {
  const cfg = attractivenessConfig[value] || attractivenessConfig['Baixa']
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border font-medium ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {value}
    </span>
  )
}

function ThreatBadge({ value }) {
  const cfg = {
    'Alto': 'bg-red-500/20 text-red-400 border-red-500/40',
    'Médio': 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    'Baixo': 'bg-slate-500/20 text-slate-400 border-slate-500/40',
  }
  return (
    <span className={`inline-flex text-[11px] px-2 py-0.5 rounded-full border font-medium ${cfg[value] || cfg['Baixo']}`}>
      {value}
    </span>
  )
}

export default function CompetitorsPage() {
  const [sortKey, setSortKey] = useState('attractivenessLevel')
  const [sortDir, setSortDir] = useState(-1)
  const [selectedZoneFilter, setSelectedZoneFilter] = useState('all')

  const totalEstMin = competitors.reduce((s, c) => s + c.estimateMin, 0)
  const totalEstMax = competitors.reduce((s, c) => s + c.estimateMax, 0)
  const highAttrCount = competitors.filter(c => c.attractivenessLevel === 3).length

  function handleSort(key) {
    if (sortKey === key) setSortDir(d => -d)
    else { setSortKey(key); setSortDir(-1) }
  }

  const filtered = competitors
    .filter(c => selectedZoneFilter === 'all' || c.zone === selectedZoneFilter)
    .sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey]
      if (sortKey === 'estimateMin') return sortDir * (av - bv)
      if (typeof av === 'string') return sortDir * av.localeCompare(bv)
      return sortDir * (av - bv)
    })

  const barData = zones.map(z => ({
    zone: `Zona ${z.id}`,
    color: z.color,
    min: competitors.filter(c => c.zone === z.id).reduce((s, c) => s + c.estimateMin, 0),
    max: competitors.filter(c => c.zone === z.id).reduce((s, c) => s + c.estimateMax, 0),
  }))

  function SortIcon({ col }) {
    if (sortKey !== col) return <ChevronDown size={12} className="text-slate-600" />
    return sortDir === -1 ? <ChevronDown size={12} className="text-violet-400" /> : <ChevronUp size={12} className="text-violet-400" />
  }

  return (
    <div className="h-full overflow-auto bg-slate-950">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white">Raio-X da Concorrência</h1>
        <p className="text-sm text-slate-400 mt-0.5">Alvos de migração — Itaim Paulista</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <p className="text-2xl font-bold text-white">{competitors.length}</p>
            <p className="text-sm text-slate-300 mt-0.5">Concorrentes Mapeados</p>
            <p className="text-xs text-slate-500 mt-1">No raio de 2km da Voi Fit</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <p className="text-2xl font-bold text-white">
              {totalEstMin.toLocaleString('pt-BR')}–{totalEstMax.toLocaleString('pt-BR')}
            </p>
            <p className="text-sm text-slate-300 mt-0.5">Alunos no Mercado</p>
            <p className="text-xs text-slate-500 mt-1">Estimativa total dos concorrentes</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4">
            <p className="text-2xl font-bold text-emerald-400">{highAttrCount}</p>
            <p className="text-sm text-emerald-300 mt-0.5">Alvos de Alta Prioridade</p>
            <p className="text-xs text-emerald-600 mt-1">Atratividade de migração Alta</p>
          </div>
          <div className="bg-violet-600/10 border border-violet-600/30 rounded-2xl p-4">
            <p className="text-sm font-bold text-violet-400 leading-tight">Wellhub Silver</p>
            <p className="text-2xl font-bold text-white mt-1">+1 tier</p>
            <p className="text-xs text-slate-400 mt-1">Vantagem vs bloco Basic/Basic+</p>
          </div>
        </div>

        {/* Wellhub advantage callout */}
        <div className="bg-gradient-to-r from-violet-600/15 to-blue-600/10 border border-violet-600/30 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-600/30 flex items-center justify-center flex-shrink-0 mt-0.5">
            <TrendingUp size={16} className="text-violet-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Vantagem Competitiva: Wellhub Silver sobre o bloco Basic/Basic+</p>
            <p className="text-xs text-slate-400 mt-1">
              Smart Fit, Panobianco, Allp Fit (I&II) e Select Gym operam em tiers inferiores do Wellhub (Basic ou Basic+) ou fora do Wellhub.
              A Voi Fit com tier Silver captura alunos que querem um upgrade de experiência mantendo a praticidade do aggregador,
              criando uma janela de migração altamente favorável para o eixo Tibúrcio e Marechal Tito.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Table */}
          <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <p className="text-base font-bold text-white">Tabela de Concorrentes</p>
              <div className="flex gap-2">
                {['all', 'A', 'B', 'C', 'D'].map(z => (
                  <button
                    key={z}
                    onClick={() => setSelectedZoneFilter(z)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                      selectedZoneFilter === z
                        ? 'bg-violet-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {z === 'all' ? 'Todos' : `Zona ${z}`}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    {[
                      { key: 'name', label: 'Concorrente' },
                      { key: 'address', label: 'Localização' },
                      { key: 'aggregatorType', label: 'Aggregador' },
                      { key: 'estimateMin', label: 'Estimativa' },
                      { key: 'migrationAttractiveness', label: 'Migração' },
                      { key: 'threat', label: 'Ameaça' },
                    ].map(col => (
                      <th
                        key={col.key}
                        className="px-4 py-3 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-300 select-none"
                        onClick={() => handleSort(col.key)}
                      >
                        <span className="flex items-center gap-1">
                          {col.label}
                          <SortIcon col={col.key} />
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((comp, i) => (
                    <tr key={comp.id} className={`border-b border-slate-800 hover:bg-slate-800/50 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-900/50'}`}>
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-white">{comp.name}</p>
                        <p className="text-[10px] text-slate-500">Zona {comp.zone}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">{comp.address}</td>
                      <td className="px-4 py-3">
                        <AggregatorBadge type={comp.aggregatorType} label={aggregatorLabels[comp.aggregatorType]} />
                      </td>
                      <td className="px-4 py-3 text-xs text-white font-medium">
                        {comp.estimateMin.toLocaleString('pt-BR')}–{comp.estimateMax.toLocaleString('pt-BR')}
                        {comp.note && (
                          <p className="text-[10px] text-slate-500 mt-0.5">{comp.note}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <AttractivBadge value={comp.migrationAttractiveness} />
                      </td>
                      <td className="px-4 py-3">
                        <ThreatBadge value={comp.threat} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Estimation by zone chart */}
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <p className="text-sm font-bold text-white mb-1">Alunos por Zona</p>
              <p className="text-xs text-slate-400 mb-4">Estimativa mínima de alunos concorrentes</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={barData} margin={{ top: 0, right: 0, bottom: 0, left: -25 }} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="zone" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    content={({ active, payload, label }) => active && payload?.length ? (
                      <div className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white">
                        <p className="text-slate-400 mb-1">{label}</p>
                        <p>Min: {payload[0]?.value?.toLocaleString('pt-BR')}</p>
                      </div>
                    ) : null}
                  />
                  <Bar dataKey="min" name="Mínimo" radius={[4, 4, 0, 0]}>
                    {barData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <p className="text-sm font-bold text-white">Oportunidade de Mercado</p>
              {[
                { label: 'Potencial Total (min)', value: totalEstMin.toLocaleString('pt-BR'), color: 'text-slate-300' },
                { label: 'Potencial Total (max)', value: totalEstMax.toLocaleString('pt-BR'), color: 'text-slate-300' },
                { label: 'Meta Sprint (30 dias)', value: '65–112', color: 'text-violet-400' },
                { label: 'Share a capturar', value: `${((112 / totalEstMin) * 100).toFixed(1)}%`, color: 'text-emerald-400' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between py-1.5 border-b border-slate-800 last:border-0">
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className={`text-sm font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
