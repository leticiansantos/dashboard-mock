import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polygon, Circle, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import { X, Target, TrendingUp, DollarSign, Users } from 'lucide-react'
import { zones, competitors, VOI_FIT, populationClusters, attractivenessConfig } from '../data/gymData'

const gymIcon = L.divIcon({
  className: '',
  html: `<div style="
    background: linear-gradient(135deg, #7C3AED, #5B21B6);
    width: 44px; height: 44px;
    border-radius: 50%;
    border: 3px solid white;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 0 6px rgba(124,58,237,0.25), 0 0 24px rgba(124,58,237,0.7);
    font-size: 20px;
    line-height: 1;
  ">🏋️</div>`,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
  popupAnchor: [0, -24],
})

function makeCompetitorIcon(level) {
  const colors = { 3: '#10B981', 2: '#F59E0B', 1: '#6B7280' }
  const c = colors[level] || '#6B7280'
  return L.divIcon({
    className: '',
    html: `<div style="
      background: ${c};
      width: 18px; height: 18px;
      border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.8);
      box-shadow: 0 0 8px ${c}90;
    "></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -12],
  })
}

function ZonePanel({ zone, onClose }) {
  return (
    <div className="absolute top-16 right-4 z-[1000] w-80 bg-slate-900/98 backdrop-blur border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between"
        style={{ background: `${zone.color}22` }}>
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold text-white"
            style={{ background: zone.color }}>
            {zone.id}
          </span>
          <div>
            <p className="text-sm font-bold text-white leading-tight">{zone.shortName}</p>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${zone.priorityBg} ${zone.priorityText}`}>
              {zone.priority}
            </span>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-800 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-white">R${(zone.budget/1000).toFixed(1)}k</p>
            <p className="text-[10px] text-slate-400">Verba</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-white">{zone.targetMin}–{zone.targetMax}</p>
            <p className="text-[10px] text-slate-400">Alunos/mês</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-white">{zone.energyPercent}%</p>
            <p className="text-[10px] text-slate-400">Energia</p>
          </div>
        </div>
        <div>
          <p className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Perfil do Público</p>
          <p className="text-xs text-slate-300">{zone.profile}</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Mensagem Central</p>
          <p className="text-xs text-slate-200 italic">"{zone.message}"</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Táticas</p>
          <ul className="space-y-1">
            {zone.tactics.map((t, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-slate-300">
                <span className="mt-0.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: zone.color }} />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Arsenal de Oferta</p>
          <div className="flex flex-wrap gap-1">
            {zone.arsenal.map((a, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded-full border border-slate-600 text-slate-300">
                {a}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MapPage() {
  const [selectedZone, setSelectedZone] = useState(null)
  const [showDensity, setShowDensity] = useState(true)
  const [showZones, setShowZones] = useState(true)
  const [showCompetitors, setShowCompetitors] = useState(true)

  function handleZoneClick(zone) {
    setSelectedZone(prev => prev?.id === zone.id ? null : zone)
  }

  return (
    <div className="relative h-full flex flex-col">
      {/* Top bar */}
      <div className="flex-shrink-0 z-10 bg-slate-950/95 backdrop-blur border-b border-slate-800 px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-white">Mapa Tático — Eixo Leste / Tibúrcio</h1>
          <p className="text-xs text-slate-400">Zonas de captação, concorrentes e densidade populacional</p>
        </div>
        <div className="flex gap-2">
          {[
            { label: 'Zonas A-D', state: showZones, toggle: () => setShowZones(v => !v) },
            { label: 'Densidade Pop.', state: showDensity, toggle: () => setShowDensity(v => !v) },
            { label: 'Concorrentes', state: showCompetitors, toggle: () => setShowCompetitors(v => !v) },
          ].map(({ label, state, toggle }) => (
            <button
              key={label}
              onClick={toggle}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                state
                  ? 'bg-violet-600/90 border-violet-500 text-white'
                  : 'bg-transparent border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={VOI_FIT.position}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; OpenStreetMap &copy; CARTO'
          />

          {/* Population density */}
          {showDensity && populationClusters.map((c, i) => (
            <Circle
              key={i}
              center={c.position}
              radius={c.radius}
              pathOptions={{
                color: 'transparent',
                fillColor: '#7C3AED',
                fillOpacity: c.opacity,
                weight: 0,
              }}
            />
          ))}

          {/* Zones */}
          {showZones && zones.map(zone => (
            <Polygon
              key={zone.id}
              positions={zone.positions}
              pathOptions={{
                color: zone.color,
                fillColor: zone.fillColor,
                fillOpacity: selectedZone?.id === zone.id ? 0.35 : zone.fillOpacity,
                weight: selectedZone?.id === zone.id ? 2.5 : 1.5,
                dashArray: zone.id === 'D' ? '8, 5' : null,
              }}
              eventHandlers={{ click: () => handleZoneClick(zone) }}
            >
              <Tooltip
                direction="center"
                permanent
                className="zone-label"
              >
                <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1 }}>{zone.id}</span>
              </Tooltip>
            </Polygon>
          ))}

          {/* Competitors */}
          {showCompetitors && competitors.map(comp => (
            <Marker
              key={comp.id}
              position={comp.position}
              icon={makeCompetitorIcon(comp.attractivenessLevel)}
            >
              <Popup closeButton={false}>
                <div className="p-3 min-w-[200px]">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-semibold text-sm text-white leading-tight">{comp.name}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border flex-shrink-0 ${
                      attractivenessConfig[comp.migrationAttractiveness]?.bg
                    } ${attractivenessConfig[comp.migrationAttractiveness]?.text} ${attractivenessConfig[comp.migrationAttractiveness]?.border}`}>
                      {comp.migrationAttractiveness}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-1">{comp.address}</p>
                  <p className="text-xs text-slate-300 mb-2">{comp.aggregator}</p>
                  <div className="flex gap-3 text-xs">
                    <div>
                      <p className="text-slate-500">Estimativa</p>
                      <p className="text-white font-medium">
                        {comp.estimateMin.toLocaleString('pt-BR')}–{comp.estimateMax.toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Zona</p>
                      <p className="text-white font-medium">{comp.zone}</p>
                    </div>
                  </div>
                  {comp.note && (
                    <p className="text-[10px] text-slate-500 mt-2 italic">{comp.note}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Voi Fit */}
          <Marker position={VOI_FIT.position} icon={gymIcon}>
            <Popup closeButton={false}>
              <div className="p-3 min-w-[200px]">
                <p className="font-bold text-violet-400 text-sm mb-1">🏋️ {VOI_FIT.name}</p>
                <p className="text-xs text-slate-400 mb-2">{VOI_FIT.address}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-800 rounded p-1.5">
                    <p className="text-slate-500">Alunos</p>
                    <p className="text-white font-semibold">{VOI_FIT.totalStudents}</p>
                  </div>
                  <div className="bg-slate-800 rounded p-1.5">
                    <p className="text-slate-500">Wellhub</p>
                    <p className="text-violet-400 font-semibold">{VOI_FIT.wellhubTier}</p>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        </MapContainer>

        {/* Zone panel */}
        {selectedZone && (
          <ZonePanel zone={selectedZone} onClose={() => setSelectedZone(null)} />
        )}

        {/* Legend */}
        <div className="absolute bottom-5 left-4 z-[1000] bg-slate-900/95 backdrop-blur border border-slate-700 rounded-xl p-3 text-xs space-y-2">
          <p className="text-slate-400 font-semibold uppercase tracking-wide text-[10px]">Legenda</p>
          <div className="flex items-center gap-2">
            <span className="text-base">🏋️</span>
            <span className="text-slate-300">Voi Fit</span>
          </div>
          {[
            { color: '#10B981', label: 'Alta atratividade' },
            { color: '#F59E0B', label: 'Média atratividade' },
            { color: '#6B7280', label: 'Baixa atratividade' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
              <span className="text-slate-300">{label}</span>
            </div>
          ))}
          <div className="border-t border-slate-700 pt-2 space-y-1">
            {zones.map(z => (
              <div key={z.id} className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                onClick={() => handleZoneClick(z)}>
                <span className="w-3 h-3 rounded-sm flex-shrink-0 border" style={{ background: z.fillColor + '50', borderColor: z.color }} />
                <span className="text-slate-300">Zona {z.id} — {z.shortName}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-700 pt-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full flex-shrink-0 bg-violet-500/40" />
              <span className="text-slate-300">Densidade Pop.</span>
            </div>
          </div>
        </div>

        {/* Tap hint */}
        {!selectedZone && (
          <div className="absolute bottom-5 right-4 z-[1000] bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2">
            <p className="text-[11px] text-slate-400">Clique em uma zona para ver detalhes</p>
          </div>
        )}
      </div>
    </div>
  )
}
