import { useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import type {
  DiscId,
  InoculationTechnique,
  Mistake,
  Phase,
  StepId,
} from '../../data/ast'
import { BENCH_ITEMS, DISCS, MAX_DISCS, MIN_DISCS } from '../../data/ast'
import { BenchSurface } from './BenchSurface'
import { BenchItemCard } from './BenchItemCard'
import { AstPlateView } from './AstPlateView'

interface AstBenchSceneProps {
  step: StepId
  phase: Phase
  selected: Set<string>
  technique: InoculationTechnique
  inoculationQuality: 'even' | 'uneven' | null
  placedDiscs: DiscId[]
  activeMistake: Mistake | null
  onSelectItem: (id: string) => void
  onSetTechnique: (technique: InoculationTechnique) => void
  onInoculate: () => void
  onPlaceDisc: (id: DiscId) => void
}

export function AstBenchScene({
  step,
  phase,
  selected,
  technique,
  inoculationQuality,
  placedDiscs,
  activeMistake,
  onSelectItem,
  onSetTechnique,
  onInoculate,
  onPlaceDisc,
}: AstBenchSceneProps) {
  const sampleItems = BENCH_ITEMS.filter((i) => i.kind === 'sample')
  const plateItems = BENCH_ITEMS.filter((i) => i.kind === 'plate')
  const swabItems = BENCH_ITEMS.filter((i) => i.kind === 'swab')

  const statusText = getStatusText(step, phase)

  return (
    <div
      key={activeMistake?.timestamp ?? 'ok'}
      className={`rounded-card ${activeMistake ? 'animate-error-shake' : ''}`}
    >
      <BenchSurface
        photoSrc="/images/lab/scenes/ast-scene.png"
        className="min-h-[520px] flex flex-col overflow-hidden"
      >
        {activeMistake && (
          <div className="absolute inset-0 bg-coral/[0.04] pointer-events-none z-20" />
        )}

        <div className="flex-1 relative px-6 py-8 lg:px-10 lg:py-10">
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
                  title="Swab"
                  items={swabItems}
                  selected={selected}
                  disabled={phase === 'done'}
                  onSelect={onSelectItem}
                />
              </div>
            </div>
          ) : null}

          {step === 'inoculate' ? (
            <div className="relative z-10 h-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
              <div className="relative flex flex-col items-center gap-2">
                <img
                  src="/images/lab/ast/swab.png"
                  alt="Sterile cotton swab"
                  className="w-24 lg:w-28 h-36 object-contain drop-shadow-md"
                />
                <span className="text-[11px] font-medium text-stone">
                  Sterile swab
                </span>
              </div>

              <div className="flex flex-col items-center gap-5 flex-1 max-w-md">
                <div className="relative pb-6">
                  <DragToSwabZone
                    disabled={phase === 'done'}
                    onComplete={onInoculate}
                  >
                    <AstPlateView
                      placedDiscs={[]}
                      quality={inoculationQuality}
                      grown={false}
                      size={240}
                      label={false}
                    />
                  </DragToSwabZone>
                </div>

                {phase !== 'done' && (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-charcoal">
                        Technique:
                      </span>
                      <TechniquePill value={technique} onChange={onSetTechnique} />
                    </div>
                    <button
                      type="button"
                      onClick={onInoculate}
                      className="text-xs font-medium text-stone/70 hover:text-coral underline underline-offset-2 transition-colors"
                    >
                      Or tap to inoculate plate
                    </button>
                  </div>
                )}
              </div>

              <div className="relative flex flex-col items-center gap-2">
                <img
                  src="/images/lab/ast/vial-sample.png"
                  alt="Bacterial sample"
                  className="w-20 lg:w-24 h-32 object-contain drop-shadow-md"
                />
                <span className="text-[11px] font-medium text-stone">
                  Bacterial sample
                </span>
              </div>
            </div>
          ) : null}

          {step === 'discs' ? (
            <div className="relative z-10 h-full flex flex-col items-center justify-center gap-8">
              <div className="flex flex-col items-center gap-2">
                <img
                  src="/images/lab/ast/disc-dispenser.png"
                  alt="Antibiotic disc dispenser"
                  className="w-24 lg:w-28 h-24 object-contain drop-shadow-md"
                />
                <span className="text-[11px] font-medium text-stone">
                  Disc dispenser
                </span>
              </div>

              <AstPlateView
                placedDiscs={placedDiscs}
                quality={inoculationQuality}
                grown={false}
                size={240}
                label={false}
              />

              <div className="flex flex-col items-center gap-3">
                <p className="text-xs font-medium text-charcoal">
                  Tap a disc to place it on the lawn ({placedDiscs.length}/{MAX_DISCS})
                </p>
                <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                  {DISCS.map((disc) => {
                    const placed = placedDiscs.includes(disc.id)
                    return (
                      <button
                        key={disc.id}
                        type="button"
                        onClick={() => onPlaceDisc(disc.id)}
                        disabled={placed || phase === 'done'}
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                          placed
                            ? 'border-teal bg-teal/10 text-teal cursor-default'
                            : 'border-stone/20 bg-white text-charcoal hover:border-coral/40 hover:bg-coral-50'
                        } disabled:cursor-not-allowed`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-white border border-stone/40" />
                        {disc.code}
                      </button>
                    )
                  })}
                </div>
                <p className="text-[11px] text-stone">
                  {placedDiscs.length < MIN_DISCS
                    ? `Place at least ${MIN_DISCS} discs to continue.`
                    : 'Zones that overlap cannot be measured accurately.'}
                </p>
              </div>
            </div>
          ) : null}

          {step === 'incubate' ? (
            <div className="relative z-10 h-full flex flex-col items-center justify-center gap-6">
              <div className="relative">
                <AstPlateView
                  placedDiscs={placedDiscs}
                  quality={inoculationQuality}
                  grown={phase === 'done'}
                  size={260}
                  label={false}
                />
                {phase === 'incubating' && (
                  <div className="absolute inset-0 rounded-full bg-coral/5 animate-pulse pointer-events-none" />
                )}
              </div>
              <p className="text-xs font-medium text-stone">
                {phase === 'incubating'
                  ? 'Incubating at 35°C — drugs are diffusing into the agar...'
                  : phase === 'done'
                    ? 'Incubation complete. Zones have formed around the discs.'
                    : 'Submit the plate for incubation.'}
              </p>
            </div>
          ) : null}

          <div
            className={`absolute left-1/2 -translate-x-1/2 bottom-5 z-20 rounded-full bg-white/85 backdrop-blur px-5 py-2.5 text-xs font-medium shadow-sm animate-fade-rise ${
              activeMistake ? 'text-coral' : 'text-teal'
            }`}
          >
            {statusText}
          </div>
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

/**
 * Wraps the plate so the person drags the swab across it in a real
 * motion instead of tapping a button.
 */
function DragToSwabZone({
  disabled,
  onComplete,
  children,
}: {
  disabled: boolean
  onComplete: () => void
  children: ReactNode
}) {
  const zoneRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)
  const lastPointRef = useRef<{ x: number; y: number } | null>(null)
  const distanceRef = useRef(0)
  const [dragging, setDragging] = useState(false)
  const [progress, setProgress] = useState(0)

  const THRESHOLD = 260

  function handlePointerDown(e: ReactPointerEvent) {
    if (disabled) return
    draggingRef.current = true
    distanceRef.current = 0
    lastPointRef.current = { x: e.clientX, y: e.clientY }
    setDragging(true)
    setProgress(0)
    zoneRef.current?.setPointerCapture(e.pointerId)
  }

  function handlePointerMove(e: ReactPointerEvent) {
    if (!draggingRef.current || !lastPointRef.current) return
    const dx = e.clientX - lastPointRef.current.x
    const dy = e.clientY - lastPointRef.current.y
    distanceRef.current += Math.hypot(dx, dy)
    lastPointRef.current = { x: e.clientX, y: e.clientY }
    setProgress(Math.min(1, distanceRef.current / THRESHOLD))
  }

  function finishDrag() {
    if (!draggingRef.current) return
    draggingRef.current = false
    setDragging(false)
    const completed = distanceRef.current >= THRESHOLD
    setProgress(0)
    distanceRef.current = 0
    lastPointRef.current = null
    if (completed) onComplete()
  }

  return (
    <div
      ref={zoneRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      className={`relative touch-none ${
        disabled ? 'cursor-not-allowed' : dragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {children}
      {!disabled && (
        <div
          className={`absolute inset-0 rounded-full pointer-events-none transition-opacity duration-200 ${
            dragging ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            boxShadow: `inset 0 0 0 ${3 + progress * 5}px rgba(46,125,110,${0.15 + progress * 0.5})`,
          }}
        />
      )}
      {!disabled && !dragging && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full text-[10px] font-medium text-stone/70 whitespace-nowrap">
          Click and drag the swab across the plate
        </div>
      )}
    </div>
  )
}

function TechniquePill({
  value,
  onChange,
}: {
  value: InoculationTechnique
  onChange: (value: InoculationTechnique) => void
}) {
  return (
    <div className="inline-flex rounded-full border border-stone/15 overflow-hidden">
      <button
        type="button"
        onClick={() => onChange('even-lawn')}
        className={`px-3 py-1 text-xs font-medium transition-colors ${
          value === 'even-lawn'
            ? 'bg-coral text-white'
            : 'bg-white text-charcoal hover:bg-stone/5'
        }`}
      >
        Swab all directions
      </button>
      <button
        type="button"
        onClick={() => onChange('quick-swipe')}
        className={`px-3 py-1 text-xs font-medium transition-colors ${
          value === 'quick-swipe'
            ? 'bg-coral text-white'
            : 'bg-white text-charcoal hover:bg-stone/5'
        }`}
      >
        Single quick swipe
      </button>
    </div>
  )
}

function getStatusText(
  step: StepId,
  phase: Phase,
): string {
  if (step === 'prepare') {
    return 'Select the correct sterile materials to begin.'
  }
  if (step === 'inoculate') {
    if (phase === 'done') return 'Lawn applied. Continue when ready.'
    return 'Swab the plate for an even lawn of bacteria.'
  }
  if (step === 'discs') {
    if (phase === 'done') return 'Discs placed. Continue when ready.'
    return `Place ${MIN_DISCS}–${MAX_DISCS} antibiotic discs, spaced apart.`
  }
  if (step === 'incubate') {
    if (phase === 'incubating') return 'Incubating the plate...'
    if (phase === 'done') return 'Incubation complete. Continue to interpret.'
    return 'Submit the plate for incubation.'
  }
  return 'Use the workspace to interact with the lab bench.'
}
