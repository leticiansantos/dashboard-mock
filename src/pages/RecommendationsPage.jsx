import { useState } from 'react'
import { Megaphone, Target, Users, MapPin, Zap, CheckCircle2, Circle, ChevronRight, DollarSign, TrendingUp } from 'lucide-react'
import { zones, kpiData } from '../data/gymData'

const focusIcons = {
  'Conversão': Target,
  'Tráfego': Megaphone,
  'Comunidade': Users,
  'Teste': Zap,
}

const actionTimeline = [
  { day: 'Dia 1–3', title: 'Setup & Configuração', tasks: ['Configurar Meta Ads com segmentação geolocalizada por zona', 'Definir equipe de promotores para Frente B', 'Imprimir panfletos e materiais para Frente A'], zone: null },
  { day: 'Dia 4–7', title: 'Lançamento Frentes A e B', tasks: ['Ativar Meta Ads Zona A (raio 1km Smart Fit/Panobianco)', 'Blitz de promotores na Marechal Tito', 'Iniciar parceria com farmácias e mercados da Frente B'], zone: 'AB' },
  { day: 'Dia 8–14', title: 'Ativação Frente C + Ajustes', tasks: ['Contatar microinfluenciadores Vila Silva Teles', 'Iniciar campanha porta a porta em condomínios', 'Review de CAC e leads: realocar se necessário'], zone: 'C' },
  { day: 'Dia 15–21', title: 'Escala e Otimização', tasks: ['Dobrar verba em anúncios com ROAS positivo', 'Ativar teste digital Frente D (baixo orçamento)', 'Medir conversão visita→matrícula por frente'], zone: 'D' },
  { day: 'Dia 22–30', title: 'Fechamento e Resultados', tasks: ['Intensificar oferta "7 dias grátis" em pico de leads', 'Contabilizar matrículas líquidas por região', 'Documentar aprendizados e definir sprint seguinte'], zone: null },
]

function ZoneCard({ zone }) {
  const [expanded, setExpanded] = useState(false)
  const FocusIcon = focusIcons[zone.focus] || Target
  const zoneKpi = kpiData.byZone.find(z => z.zone === zone.id)

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between" style={{ background: `${zone.color}18` }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold text-white flex-shrink-0"
            style={{ background: zone.color }}>
            {zone.id}
          </div>
          <div>
            <p className="text-base font-bold text-white leading-tight">{zone.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${zone.priorityBg} ${zone.priorityText}`}>
                {zone.priority}
              </span>
              <span className="text-[10px] text-slate-400">{zone.energyPercent}% da energia</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-lg font-bold text-white">R${(zone.budget/1000).toFixed(1)}k</p>
            <p className="text-[10px] text-slate-400">verba/mês</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold" style={{ color: zone.color }}>{zone.targetMin}–{zone.targetMax}</p>
            <p className="text-[10px] text-slate-400">alunos/mês</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-slate-300">R${zone.cacMin}–{zone.cacMax}</p>
            <p className="text-[10px] text-slate-400">CAC</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Focus + Profile */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-2">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${zone.focusColor}/30 mt-0.5`}>
              <FocusIcon size={14} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-semibold mb-0.5">Foco da Frente</p>
              <p className="text-sm font-semibold text-white">{zone.focus}</p>
            </div>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-semibold mb-0.5">Perfil do Público</p>
            <p className="text-xs text-slate-300">{zone.profile}</p>
          </div>
        </div>

        {/* Message */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
          <p className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Mensagem Central</p>
          <p className="text-sm text-white italic">"{zone.message}"</p>
          <div className="mt-2 pt-2 border-t border-slate-700">
            <p className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Gatilho</p>
            <p className="text-xs font-semibold text-slate-200">"{zone.trigger}"</p>
          </div>
        </div>

        {/* Tactics */}
        <div>
          <p className="text-[10px] text-slate-500 uppercase font-semibold mb-2">Táticas de Ativação</p>
          <div className="space-y-1.5">
            {zone.tactics.map((t, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0 text-slate-500" />
                <p className="text-xs text-slate-300">{t}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Arsenal */}
        <div>
          <p className="text-[10px] text-slate-500 uppercase font-semibold mb-2">Arsenal de Oferta</p>
          <div className="flex flex-wrap gap-2">
            {zone.arsenal.map((a, i) => (
              <span key={i} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border font-medium"
                style={{
                  background: `${zone.color}18`,
                  borderColor: `${zone.color}50`,
                  color: '#e2e8f0',
                }}>
                <Zap size={10} style={{ color: zone.color }} />
                {a}
              </span>
            ))}
          </div>
        </div>

        {/* Current performance */}
        {zoneKpi && (
          <div className="pt-3 border-t border-slate-800">
            <p className="text-[10px] text-slate-500 uppercase font-semibold mb-2">Resultados do Sprint</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Leads', value: zoneKpi.leads },
                { label: 'Visitas', value: zoneKpi.visits },
                { label: 'Matrículas', value: zoneKpi.conversions },
                { label: 'CAC Real', value: `R$${zoneKpi.cac}` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-800 rounded-lg p-2 text-center">
                  <p className="text-sm font-bold text-white">{value}</p>
                  <p className="text-[10px] text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function TimelineItem({ item, index }) {
  const isLast = index === actionTimeline.length - 1
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-violet-600/20 border-2 border-violet-600 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-violet-400">{index + 1}</span>
        </div>
        {!isLast && <div className="w-px flex-1 bg-slate-800 mt-1" />}
      </div>
      <div className="pb-6 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-violet-400">{item.day}</span>
          {item.zone && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-medium">
              Frente {item.zone}
            </span>
          )}
        </div>
        <p className="text-sm font-semibold text-white mb-2">{item.title}</p>
        <ul className="space-y-1">
          {item.tasks.map((task, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
              <Circle size={6} className="mt-1.5 flex-shrink-0 fill-slate-600 text-slate-600" />
              {task}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function RecommendationsPage() {
  const totalBudget = zones.reduce((s, z) => s + z.budget, 0)
  const totalMin = zones.reduce((s, z) => s + z.targetMin, 0)
  const totalMax = zones.reduce((s, z) => s + z.targetMax, 0)

  return (
    <div className="h-full overflow-auto bg-slate-950">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Recomendações de Marketing</h1>
            <p className="text-sm text-slate-400 mt-0.5">Playbook tático das 4 frentes de captação</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-center">
              <p className="text-lg font-bold text-violet-400">R$ {totalBudget.toLocaleString('pt-BR')}</p>
              <p className="text-[10px] text-slate-400">Investimento Total/mês</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-center">
              <p className="text-lg font-bold text-emerald-400">{totalMin}–{totalMax}</p>
              <p className="text-[10px] text-slate-400">Alunos Projetados/mês</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Verdict callout */}
        <div className="bg-gradient-to-r from-violet-600/20 to-blue-600/10 border border-violet-600/40 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center flex-shrink-0">
              <TrendingUp size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white mb-1.5">O Veredito Estratégico</p>
              <p className="text-sm text-slate-300 leading-relaxed">
                Concentrar o ataque comercial da Voi Fit Itaim Paulista em três micro-regiões prioritárias —{' '}
                <span className="text-violet-400 font-semibold">Tibúrcio de Souza</span>,{' '}
                <span className="text-blue-400 font-semibold">Marechal Tito Leste</span> e{' '}
                <span className="text-slate-300 font-semibold">Vila Silva Teles</span> — com verba mensal de{' '}
                <span className="text-white font-bold">R$ 8,2 mil</span> e potencial de{' '}
                <span className="text-emerald-400 font-bold">65 a 112 novos alunos</span> por mês,
                priorizando áreas onde o mapa já mostra maior tração e maior probabilidade de roubar share dos concorrentes locais.
              </p>
            </div>
          </div>
        </div>

        {/* Priority pipeline */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <p className="text-sm font-bold text-white mb-4">Priority Pipeline — Alocação de Energia</p>
          <div className="space-y-2">
            {zones.map(zone => (
              <div key={zone.id} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: zone.color }}>
                  {zone.id}
                </span>
                <span className="text-xs text-slate-400 w-32 flex-shrink-0">{zone.shortName}</span>
                <div className="flex-1 h-5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full flex items-center justify-end pr-2 transition-all"
                    style={{ width: `${zone.energyPercent}%`, background: zone.color }}
                  >
                    <span className="text-[10px] font-bold text-white">{zone.energyPercent}%</span>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-semibold flex-shrink-0 ${zone.priorityBg} ${zone.priorityText}`}>
                  {zone.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Zone cards */}
        <div className="space-y-4">
          {zones.map(zone => (
            <ZoneCard key={zone.id} zone={zone} />
          ))}
        </div>

        {/* Action timeline */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <p className="text-base font-bold text-white mb-1">Plano de Ação — Sprint 30 Dias</p>
          <p className="text-xs text-slate-400 mb-6">Sequência de ativação e marcos por semana</p>
          <div className="space-y-0">
            {actionTimeline.map((item, i) => (
              <TimelineItem key={i} item={item} index={i} />
            ))}
          </div>
        </div>

        {/* Golden rule */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-base">🎙️</span>
          </div>
          <div>
            <p className="text-sm font-bold text-amber-400 mb-1">Regra de Ouro do Atendimento</p>
            <p className="text-sm text-slate-300">
              Sem mapeamento, não há inteligência. É obrigatório perguntar a cada novo visitante:{' '}
              <span className="text-white font-semibold italic">"Você conheceu a Voi por qual região ou ação de rua?"</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
