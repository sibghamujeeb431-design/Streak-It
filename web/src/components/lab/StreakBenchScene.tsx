import { Microscope } from 'lucide-react'
import type {
  CarryoverTechnique,
  Mistake,
  Phase,
  StepId,
  StreakRegion,
  StreakingOutcome,
} from '../../data/streakPlate'
import { BENCH_ITEMS, REGION_COUNT } from '../../data/streakPlate'
import { BenchSurface } from './BenchSurface'
import { BenchItemCard } from './BenchItemCard'
import { PlateView } from './PlateView'

interface StreakBenchSceneProps {
  step: StepId
  phase: Phase
  selected: Set<string>
  regions: StreakRegion[]
  activeRegion: number
  loopFlamed: boolean
  loopHot: boolean
  coolMs: number
  pendingCarryover: CarryoverTechnique
  activeMistake: Mistake | null
  plateViewOn: boolean
  streakingOutcome: StreakingOutcome | null
  onSelectItem: (id: string) => void
  onFlameLoop: () => void
  onSetCarryover: (technique: CarryoverTechnique) => void
  onStreakRegion: () => void
  onTogglePlateView: () => void
}

export function StreakBenchScene({
  step,
  phase,
  selected,
  regions,
  activeRegion,
  loopFlamed,
  loopHot,
  pendingCarryover,
  activeMistake,
  plateViewOn,
  streakingOutcome,
  onSelectItem,
  onFlameLoop,
  onSetCarryover,
  onStreakRegion,
  onTogglePlateView,
}: StreakBenchSceneProps) {
  const sampleItems = BENCH_ITEMS.filter((i) => i.kind === 'sample')
  const plateItems = BENCH_ITEMS.filter((i) => i.kind === 'plate')
  const loopItems = BENCH_ITEMS.filter((i) => i.kind === 'loop')

  const statusText = getStatusText(step, phase, loopHot, activeRegion, regions)
  const activeRegionIndex = activeRegion < REGION_COUNT ? activeRegion : undefined

  return (
    <div
      key={activeMistake?.timestamp ?? 'ok'}
      className={`rounded-card ${activeMistake ? 'animate-error-shake' : ''}`}
    >
      <BenchSurface className="min-h-[520px] flex flex-col overflow-hidden">
        {activeMistake && (
          <div className="absolute inset-0 bg-coral/[0.04] pointer-events-none z-20" />
        )}

        <div className="flex-1 relative px-6 py-8 lg:px-10 lg:py-10">
          {step === 'observe' && plateViewOn ? (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center animate-iris-open">
              <PlateView
                regions={regions}
                outcome={streakingOutcome}
                grown
                size={280}
              />
            </div>
          ) : null}

          {step === 'prepare' ? (
            <div className="relative z-10 h-full flex flex-col justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <ItemGroup
                  title="Sample"
                  items={sampleItems}
                  selected={selected}
                  disabled={phase === 'done'}
                  onSelect={onSelectItem}
                />
                <ItemGroup
                  title="Plate"
                  items={plateItems}
                  selected={selected}
                  disabled={phase === 'done'}
                  onSelect={onSelectItem}
                />
                <ItemGroup
                  title="Loop"
                  items={loopItems}
                  selected={selected}
                  disabled={phase === 'done'}
                  onSelect={onSelectItem}
                />
              </div>
            </div>
          ) : (
            <div className="relative z-10 h-full flex flex-col lg:flex-row items-end justify-center gap-8 lg:gap-12">
              <button
                type="button"
                onClick={onFlameLoop}
                disabled={step !== 'streak' || loopHot}
                className="relative flex flex-col items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                aria-label="Flame inoculation loop"
              >
                <img
                  src="/images/lab/streak-plate/bunsen-burner.png"
                  alt="Bunsen burner"
                  className="w-24 lg:w-28 object-contain drop-shadow-md group-hover:-translate-y-1 transition-transform"
                />
                <span className="text-[11px] font-medium text-stone">
                  {loopHot ? 'Loop flaming' : 'Flame loop'}
                </span>
              </button>

              <div className="flex flex-col items-center gap-5 flex-1 max-w-md">
                <div className="relative">
                  <PlateView
                    regions={regions}
                    outcome={null}
                    grown={false}
                    size={240}
                    activeRegion={step === 'streak' ? activeRegionIndex : undefined}
                  />
                  {loopHot && (
                    <div className="absolute inset-0 rounded-full bg-coral/5 animate-pulse pointer-events-none" />
                  )}
                </div>

                {step === 'streak' && phase !== 'done' && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-charcoal">Carryover:</span>
                    <CarryoverPill
                      value={pendingCarryover}
                      onChange={onSetCarryover}
                      disabled={loopHot}
                    />
                  </div>
                )}

                {step === 'streak' && phase !== 'cooling' && activeRegion < REGION_COUNT && (
                  <button
                    type="button"
                    onClick={onStreakRegion}
                    disabled={loopHot || (activeRegion > 0 && !loopFlamed)}
                    className="bg-coral hover:bg-coral/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-6 py-2.5 rounded-button transition-colors"
                  >
                    Streak Region {activeRegion + 1}
                  </button>
                )}
              </div>

              <div className="relative flex flex-col items-center gap-2">
                <div
                  className={`relative w-24 lg:w-28 h-40 lg:h-44 transition-all duration-500 ${
                    loopHot ? 'drop-shadow-[0_0_14px_rgba(201,106,69,0.6)]' : ''
                  }`}
                >
                  <img
                    src="/images/lab/streak-plate/inoculation-loop.png"
                    alt="Inoculation loop"
                    className="w-full h-full object-contain"
                  />
                  {loopHot && (
                    <div className="absolute left-1/2 top-[18%] -translate-x-1/2 w-10 h-10 rounded-full bg-orange-400/30 blur-md animate-pulse" />
                  )}
                </div>
                <span className="text-[11px] font-medium text-stone">
                  {loopHot ? 'Loop is hot' : loopFlamed ? 'Loop flamed' : 'Loop ready'}
                </span>
              </div>
            </div>
          )}

          <div
            className={`absolute left-1/2 -translate-x-1/2 bottom-5 z-20 rounded-full bg-white/85 backdrop-blur px-5 py-2.5 text-xs font-medium shadow-sm animate-fade-rise ${
              loopHot || activeMistake ? 'text-coral' : 'text-teal'
            }`}
          >
            {statusText}
          </div>
        </div>

        <div className="relative z-10 border-t border-stone/10 px-6 py-4 flex justify-center bg-white/40">
          <button
            type="button"
            onClick={onTogglePlateView}
            disabled={step !== 'observe'}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-button border border-stone/20 bg-white text-sm font-medium text-charcoal shadow-sm transition-all hover:bg-stone/5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
          >
            <Microscope size={18} className="text-coral" />
            Switch to Plate View
          </button>
        </div>
      </BenchSurface>
    </div>
  )
}

function ItemGroup({
  title,
  items,
  selected,
  disabled,
  onSelect,
}: {
  title: string
  items: typeof BENCH_ITEMS
  selected: Set<string>
  disabled?: boolean
  onSelect: (id: string) => void
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-stone">{title}</p>
      <div className="flex flex-col sm:flex-row gap-3">
        {items.map((item) => (
          <BenchItemCard
            key={item.id}
            item={item}
            selected={selected.has(item.id)}
            disabled={disabled}
            onClick={() => onSelect(item.id)}
          />
        ))}
      </div>
    </div>
  )
}

function CarryoverPill({
  value,
  onChange,
  disabled,
}: {
  value: CarryoverTechnique
  onChange: (value: CarryoverTechnique) => void
  disabled?: boolean
}) {
  return (
    <div className="inline-flex rounded-full border border-stone/15 overflow-hidden">
      <button
        type="button"
        onClick={() => onChange('light')}
        disabled={disabled}
        className={`px-3 py-1 text-xs font-medium transition-colors ${
          value === 'light'
            ? 'bg-coral text-white'
            : 'bg-white text-charcoal hover:bg-stone/5'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        Light
      </button>
      <button
        type="button"
        onClick={() => onChange('heavy')}
        disabled={disabled}
        className={`px-3 py-1 text-xs font-medium transition-colors ${
          value === 'heavy'
            ? 'bg-coral text-white'
            : 'bg-white text-charcoal hover:bg-stone/5'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        Heavy
      </button>
    </div>
  )
}

function getStatusText(
  step: StepId,
  phase: Phase,
  loopHot: boolean,
  activeRegion: number,
  regions: StreakRegion[],
): string {
  if (step === 'prepare') {
    return 'Select the correct sterile materials to begin.'
  }
  if (step === 'streak') {
    if (phase === 'cooling' || loopHot) {
      return 'The loop is hot. Wait for it to cool before streaking.'
    }
    if (phase === 'done') {
      return 'All regions streaked. Finish when ready.'
    }
    const streakedCount = regions.filter((r) => r.streaked).length
    return `Streak region ${activeRegion + 1} of ${REGION_COUNT}. Flamed: ${streakedCount > 0 && activeRegion > 0 ? 'yes' : activeRegion === 0 ? 'n/a' : 'no'}.`
  }
  if (step === 'incubate') {
    if (phase === 'incubating') return 'Incubating the plate...'
    if (phase === 'done') return 'Incubation complete. Continue to observe.'
    return 'Start incubation to grow the colonies.'
  }
  if (step === 'observe') {
    return 'Switch to the plate view to examine colony growth.'
  }
  if (step === 'interpret') {
    return 'Record your interpretation in the panel on the right.'
  }
  return 'Use the workspace to interact with the lab bench.'
}
