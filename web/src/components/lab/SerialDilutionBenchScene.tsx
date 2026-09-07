import { BenchItemCard } from './BenchItemCard'
import { BenchSurface } from './BenchSurface'
import { SerialDilutionPlateView } from './SerialDilutionPlateView'
import type { DilutionTubeId, Phase, StepId } from '../../data/serialDilution'
import { DILUTION_TUBES, BENCH_ITEMS } from '../../data/serialDilution'
import type { Mistake } from '../../data/serialDilution'

interface SerialDilutionBenchSceneProps {
  step: StepId
  phase: Phase
  selected: Set<string>
  currentDilutionIndex: number
  dilutionAccuracy: 'correct' | 'inconsistent' | null
  selectedDilutionTube: DilutionTubeId | null
  plateViewOn: boolean
  plateResult: { countable: boolean; colonyCount: number | null; visualState: 'optimal' | 'overcrowded' | 'sparse' | 'inconsistent' } | null
  activeMistake: Mistake | null
  onSelectItem: (id: string) => void
  onSelectDilutionTube: (tubeId: DilutionTubeId) => void
  onTogglePlateView: () => void
  onTransfer: () => void
}

export function SerialDilutionBenchScene({
  step,
  phase,
  selected,
  currentDilutionIndex,
  dilutionAccuracy,
  selectedDilutionTube,
  plateViewOn,
  plateResult,
  activeMistake,
  onSelectItem,
  onSelectDilutionTube,
  onTogglePlateView,
  onTransfer,
}: SerialDilutionBenchSceneProps) {
  const sampleItems = BENCH_ITEMS.filter((i) => i.kind === 'sample')
  const tubesItems = BENCH_ITEMS.filter((i) => i.kind === 'tubes')
  const toolItems = BENCH_ITEMS.filter((i) => i.kind === 'tool')
  const plateItems = BENCH_ITEMS.filter((i) => i.kind === 'plate')

  const statusText = getStatusText(step, phase, currentDilutionIndex, dilutionAccuracy, selectedDilutionTube)

  return (
    <div
      key={activeMistake?.timestamp ?? 'ok'}
      className={`rounded-card ${activeMistake ? 'animate-error-shake' : ''}`}
    >
      <BenchSurface
        photoSrc="/images/lab/scenes/serial-dilution-scene.png"
        className="min-h-[520px] flex flex-col overflow-hidden"
      >
        {activeMistake && (
          <div className="absolute inset-0 bg-coral/[0.04] pointer-events-none z-20" />
        )}

        <div className="flex-1 relative px-6 py-8 lg:px-10 lg:py-10">
          {step === 'prepare' ? (
            <div className="relative z-10 h-full flex flex-col justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <ItemGroup
                  title="Sample"
                  items={sampleItems}
                  selected={selected}
                  disabled={phase === 'done'}
                  onSelect={onSelectItem}
                />
                <ItemGroup
                  title="Dilution Tubes"
                  items={tubesItems}
                  selected={selected}
                  disabled={phase === 'done'}
                  onSelect={onSelectItem}
                />
                <ItemGroup
                  title="Tools"
                  items={toolItems}
                  selected={selected}
                  disabled={phase === 'done'}
                  onSelect={onSelectItem}
                />
                <ItemGroup
                  title="Plates"
                  items={plateItems}
                  selected={selected}
                  disabled={phase === 'done'}
                  onSelect={onSelectItem}
                />
              </div>
            </div>
          ) : step === 'dilute' ? (
            <div className="relative z-10 h-full flex flex-col justify-center">
              <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
                {/* Left side - Large interactive micropipette */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative scale-125">
                    <button
                      type="button"
                      onClick={onTransfer}
                      disabled={phase !== 'select'}
                      className="relative group disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      aria-label="Use micropipette"
                    >
                      <div className="relative">
                        <img
                          src="/images/lab/gram-staining/microscope.png"
                          alt="Micropipette"
                          className={`w-32 lg:w-40 object-contain drop-shadow-2xl transition-transform duration-300 ${
                            phase === 'select' ? 'group-hover:scale-110 group-hover:-translate-y-2' : ''
                          } ${phase === 'transferring' ? 'animate-bounce' : ''}`}
                        />
                        {/* Liquid droplet indicator */}
                        {phase === 'transferring' && (
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-coral/80 animate-bounce shadow-lg border-2 border-coral" />
                        )}
                        {phase === 'mixing' && (
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-teal/80 animate-spin shadow-lg border-2 border-teal" />
                        )}
                        {/* Glow effect */}
                        {phase === 'transferring' && (
                          <div className="absolute inset-0 rounded-full bg-coral/20 blur-xl animate-pulse" />
                        )}
                      </div>
                    </button>
                  </div>
                  <span className="text-sm font-semibold text-charcoal bg-white/80 px-3 py-1 rounded-full">
                    {phase === 'transferring' ? '⬇️ Transferring...' : phase === 'mixing' ? '🔄 Mixing...' : '🧪 Micropipette'}
                  </span>
                </div>

                {/* Right side - Large tube visualization */}
                <div className="flex-1 max-w-lg space-y-6">
                  <h3 className="text-xl font-bold text-charcoal">Serial Dilution Process</h3>
                  
                  {/* Large current tube display */}
                  <div className="flex items-center gap-6 p-6 bg-white rounded-xl border-2 border-stone/10 shadow-lg">
                    <div className="relative w-20 h-32 border-4 border-stone/30 rounded-b-2xl bg-gradient-to-b from-stone/5 to-stone/10">
                      {/* Liquid fill */}
                      <div className={`absolute bottom-0 left-0 right-0 transition-all duration-500 ${
                        phase === 'transferring' ? 'h-1/3 bg-coral/60 animate-pulse' :
                        phase === 'mixing' ? 'h-1/3 bg-teal/60 animate-pulse' :
                        currentDilutionIndex > 0 ? 'h-1/4 bg-teal/40' : 'h-0'
                      }`} />
                      {/* Tube label */}
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-bold text-charcoal">
                        {DILUTION_TUBES[currentDilutionIndex] || 'Done'}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-bold text-charcoal mb-2">
                        Current Tube: {DILUTION_TUBES[currentDilutionIndex] || 'Complete'}
                      </p>
                      <p className="text-sm text-stone">
                        {phase === 'select' && '👆 Click micropipette to transfer sample'}
                        {phase === 'transferring' && '💧 Transferring sample to next tube...'}
                        {phase === 'mixing' && '🔄 Mixing dilution thoroughly...'}
                        {phase === 'done' && '✅ Dilution series complete'}
                      </p>
                    </div>
                  </div>

                  {/* Large tube progress */}
                  <div className="flex gap-3">
                    {DILUTION_TUBES.map((tube, index) => (
                      <div
                        key={tube}
                        className={`flex-1 p-4 rounded-xl text-center text-sm border-2 transition-all relative ${
                          index < currentDilutionIndex
                            ? 'bg-teal/20 border-teal text-teal shadow-md'
                            : index === currentDilutionIndex
                            ? 'bg-coral/20 border-coral text-coral animate-pulse shadow-lg scale-105'
                            : 'bg-stone/10 border-stone/30 text-stone'
                        }`}
                      >
                        {/* Liquid fill indicator */}
                        {index < currentDilutionIndex && (
                          <div className="absolute bottom-0 left-0 right-0 h-2 bg-teal/60 rounded-b animate-fade-rise" />
                        )}
                        {index === currentDilutionIndex && phase === 'transferring' && (
                          <div className="absolute bottom-0 left-0 right-0 h-2 bg-coral/60 rounded-b animate-pulse" />
                        )}
                        <p className="font-bold text-base">{tube}</p>
                        <p className="text-xs mt-1 font-medium">
                          {index < currentDilutionIndex ? '✓ Complete' : ''}
                          {index === currentDilutionIndex ? '→ Active' : ''}
                          {index > currentDilutionIndex ? '⏳ Pending' : ''}
                        </p>
                      </div>
                    ))}
                  </div>

                  {dilutionAccuracy && (
                    <div className={`p-4 rounded-xl border-2 ${
                      dilutionAccuracy === 'correct' ? 'bg-teal/10 border-teal text-teal' : 'bg-coral/10 border-coral text-coral'
                    }`}>
                      <p className="text-sm font-bold">
                        {dilutionAccuracy === 'correct' ? '✅ Dilution Accuracy: Consistent' : '⚠️ Dilution Accuracy: Inconsistent'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : step === 'pour-plate' ? (
            <div className="relative z-10 h-full flex flex-col justify-center">
              <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
                {/* Left side - Large petri dish */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative scale-125">
                    <div className="relative">
                      <img
                        src="/images/lab/ast/agar-plate.png"
                        alt="Petri dish with molten agar"
                        className={`w-32 lg:w-40 object-contain drop-shadow-2xl transition-transform duration-300 ${
                          phase === 'select' ? 'hover:scale-110 hover:-translate-y-2' : ''
                        } ${phase === 'done' ? 'opacity-50' : ''}`}
                      />
                      {/* Molten agar glow */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-amber-100/50 blur-md animate-pulse" />
                      {/* Pouring liquid stream */}
                      {phase === 'done' && selectedDilutionTube && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-2 h-12 bg-gradient-to-b from-coral/80 to-transparent animate-pulse rounded-full" />
                      )}
                      {/* Ripple effect when poured */}
                      {phase === 'done' && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-4 border-coral/30 animate-ping" />
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-charcoal bg-white/80 px-3 py-1 rounded-full">
                    {phase === 'done' ? '✅ Poured' : '🧫 Petri Dish'}
                  </span>
                </div>

                {/* Right side - Large tube selection */}
                <div className="flex-1 max-w-lg space-y-6">
                  <h3 className="text-xl font-bold text-charcoal">Select Dilution for Pour Plate</h3>
                  
                  {/* Large tube grid */}
                  <div className="grid grid-cols-5 gap-4">
                    {DILUTION_TUBES.map((tube) => (
                      <button
                        key={tube}
                        onClick={() => onSelectDilutionTube(tube)}
                        disabled={phase === 'done'}
                        className={`p-5 rounded-xl border-2 transition-all relative ${
                          selectedDilutionTube === tube
                            ? 'border-teal bg-teal/20 animate-pulse shadow-lg scale-105'
                            : 'border-stone/30 hover:border-stone/50 hover:bg-stone/10 hover:scale-105'
                        } ${phase === 'done' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {/* Tube visualization */}
                        <div className="relative w-8 h-12 mx-auto mb-2 border-2 border-stone/40 rounded-b-lg bg-gradient-to-b from-stone/5 to-stone/10">
                          {selectedDilutionTube === tube && (
                            <div className="absolute bottom-0 left-0 right-0 h-3 bg-coral/70 rounded-b animate-pulse" />
                          )}
                        </div>
                        <p className="text-sm font-bold text-charcoal">{tube}</p>
                        <p className="text-xs text-stone mt-1 font-medium">
                          {tube === '10^-1' || tube === '10^-2' ? '🔴 Too concentrated' : ''}
                          {tube === '10^-3' || tube === '10^-4' ? '🟢 Optimal range' : ''}
                          {tube === '10^-5' ? '🔵 Too dilute' : ''}
                        </p>
                      </button>
                    ))}
                  </div>

                  {selectedDilutionTube && phase === 'select' && (
                    <div className="p-5 bg-teal/10 rounded-xl border-2 border-teal/30 animate-fade-rise shadow-md">
                      <p className="text-sm font-bold text-teal">
                        ✅ Selected: {selectedDilutionTube} - Click "Pour Selected Dilution" in the panel to continue
                      </p>
                    </div>
                  )}

                  {phase === 'done' && (
                    <div className="p-5 bg-coral/10 rounded-xl border-2 border-coral/30 animate-fade-rise shadow-md">
                      <p className="text-sm font-bold text-coral">
                        🧪 {selectedDilutionTube} poured into plate - Click "Pour Selected Dilution and Continue" in the panel
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : step === 'incubate' ? (
            <div className="relative z-10 h-full flex flex-col justify-center">
              <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
                {/* Left side - Large incubating dish */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative scale-125">
                    <div className="relative">
                      <img
                        src="/images/lab/gram-staining/slide-tray.png"
                        alt="Petri dish"
                        className={`w-32 lg:w-40 object-contain drop-shadow-2xl transition-all duration-300 ${
                          phase === 'incubating' ? 'animate-pulse' : ''
                        } ${phase === 'select' ? 'hover:scale-110 hover:-translate-y-2' : ''}`}
                      />
                      {/* Heat waves during incubation */}
                      {phase === 'incubating' && (
                        <>
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-orange-300/30 blur-xl animate-pulse" />
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-orange-400/40 blur-md animate-bounce" />
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-orange-500/50 blur-sm animate-ping" />
                        </>
                      )}
                      {/* Colony dots appearing when done */}
                      {phase === 'done' && (
                        <>
                          <div className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-coral/90 shadow-lg animate-bounce" />
                          <div className="absolute top-1/3 right-1/3 w-2.5 h-2.5 rounded-full bg-coral/85 shadow-lg animate-bounce" style={{ animationDelay: '100ms' }} />
                          <div className="absolute bottom-1/3 left-1/3 w-3 h-3 rounded-full bg-coral/80 shadow-lg animate-bounce" style={{ animationDelay: '200ms' }} />
                          <div className="absolute bottom-1/4 right-1/4 w-2.5 h-2.5 rounded-full bg-coral/90 shadow-lg animate-bounce" style={{ animationDelay: '300ms' }} />
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-coral/75 shadow-lg animate-bounce" style={{ animationDelay: '400ms' }} />
                        </>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-charcoal bg-white/80 px-3 py-1 rounded-full">
                    {phase === 'incubating' ? '🔥 Incubating...' : phase === 'done' ? '✅ Complete' : '🧫 Petri Dish'}
                  </span>
                </div>

                {/* Right side - Large status display */}
                <div className="flex-1 max-w-lg space-y-6">
                  <h3 className="text-xl font-bold text-charcoal">Incubation</h3>
                  
                  {/* Large status box */}
                  <div className={`flex items-center justify-center p-8 bg-white rounded-xl border-2 border-stone/10 shadow-lg transition-all ${
                    phase === 'incubating' ? 'animate-pulse border-orange-200' : ''
                  }`}>
                    <div className="text-center">
                      <p className="text-lg font-bold text-charcoal mb-3">
                        {phase === 'select' ? '⏳ Ready for incubation' : phase === 'incubating' ? '🔥 Growing colonies...' : '✅ Incubation complete'}
                      </p>
                      {phase === 'incubating' && (
                        <div className="flex items-center justify-center gap-3 mt-4">
                          <div className="w-3 h-3 rounded-full bg-coral animate-bounce shadow-lg" style={{ animationDelay: '0ms' }} />
                          <div className="w-3 h-3 rounded-full bg-coral animate-bounce shadow-lg" style={{ animationDelay: '150ms' }} />
                          <div className="w-3 h-3 rounded-full bg-coral animate-bounce shadow-lg" style={{ animationDelay: '300ms' }} />
                          <div className="w-3 h-3 rounded-full bg-coral animate-bounce shadow-lg" style={{ animationDelay: '450ms' }} />
                        </div>
                      )}
                      {phase === 'done' && (
                        <div className="flex items-center justify-center gap-2 mt-4">
                          <div className="w-3 h-3 rounded-full bg-teal shadow-md" />
                          <div className="w-3 h-3 rounded-full bg-teal shadow-md" />
                          <div className="w-3 h-3 rounded-full bg-teal shadow-md" />
                          <div className="w-3 h-3 rounded-full bg-teal shadow-md" />
                          <div className="w-3 h-3 rounded-full bg-teal shadow-md" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Temperature indicator */}
                  <div className="p-5 bg-orange-50 rounded-xl border-2 border-orange-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-orange-800">🌡️ Temperature</span>
                      <span className="text-sm font-bold text-orange-800">
                        {phase === 'incubating' ? '37°C (Growing)' : phase === 'done' ? '37°C (Complete)' : 'Room Temp'}
                      </span>
                    </div>
                    <div className="mt-2 h-2 bg-orange-200 rounded-full overflow-hidden">
                      <div className={`h-full bg-orange-500 transition-all duration-500 ${
                        phase === 'incubating' ? 'w-full animate-pulse' : phase === 'done' ? 'w-full' : 'w-0'
                      }`} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : step === 'interpret' && !plateViewOn ? (
            <div className="relative z-10 h-full flex flex-col justify-center">
              <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
                <button
                  type="button"
                  onClick={onTogglePlateView}
                  className="relative flex flex-col items-center gap-2 group transition-opacity hover:opacity-80"
                  aria-label="View plate"
                >
                  <div className="relative">
                    <img
                      src="/images/lab/gram-staining/microscope.png"
                      alt="Petri dish with colonies"
                      className="w-24 lg:w-28 object-contain drop-shadow-md group-hover:-translate-y-1 transition-transform"
                    />
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-teal text-white text-xs font-bold flex items-center justify-center animate-bounce">
                      !
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-stone">Grown Plate</span>
                </button>

                <div className="flex-1 max-w-md space-y-4">
                  <h3 className="text-lg font-semibold text-charcoal">Interpret Results</h3>
                  
                  {plateResult && (
                    <div className="p-4 bg-white rounded-lg border border-stone/10">
                      <p className="text-sm text-stone">
                        {plateResult.countable 
                          ? `Plate is countable with ${plateResult.colonyCount} colonies`
                          : 'Plate is not countable'
                        }
                      </p>
                    </div>
                  )}
                  
                  <button
                    onClick={onTogglePlateView}
                    className="w-full px-4 py-3 bg-teal hover:bg-teal/90 text-white rounded-button transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Switch to Plate View</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ) : step === 'interpret' && plateViewOn ? (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center animate-iris-open">
              <SerialDilutionPlateView
                plateResult={plateResult}
                size={280}
              />
            </div>
          ) : (
            <div className="relative z-10 h-full flex flex-col justify-center">
              <p className="text-sm text-stone">Complete the previous steps to continue.</p>
            </div>
          )}

          <div
            className={`absolute left-1/2 -translate-x-1/2 bottom-5 z-20 rounded-full bg-white/85 backdrop-blur px-5 py-2.5 text-xs font-medium shadow-sm animate-fade-rise ${
              activeMistake ? 'text-coral' : 'text-teal'
            }`}
          >
            {statusText}
          </div>
        </div>

        <div className="relative z-10 border-t border-stone/10 px-6 py-4 flex justify-center bg-white/40">
          <button
            type="button"
            onClick={onTogglePlateView}
            disabled={step !== 'interpret'}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-button border border-stone/20 bg-white text-sm font-medium text-charcoal shadow-sm transition-all hover:bg-stone/5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
          >
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
      <div className="flex flex-col gap-3">
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

function getStatusText(
  step: StepId,
  phase: Phase,
  currentDilutionIndex: number,
  dilutionAccuracy: 'correct' | 'inconsistent' | null,
  selectedDilutionTube: DilutionTubeId | null,
): string {
  if (step === 'prepare') {
    return 'Select the bacterial sample, dilution tubes, micropipette, and petri dish to begin.'
  }
  if (step === 'dilute') {
    if (phase === 'done') {
      return 'Dilution series complete. Continue to pour plate.'
    }
    if (dilutionAccuracy === 'inconsistent') {
      return 'Dilution accuracy affected by inconsistent technique.'
    }
    return `Working on dilution tube ${currentDilutionIndex + 1} of ${DILUTION_TUBES.length}.`
  }
  if (step === 'pour-plate') {
    if (phase === 'done') {
      return 'Dilution poured. Continue to incubation.'
    }
    if (selectedDilutionTube) {
      return `Selected ${selectedDilutionTube}. Confirm in the panel to pour.`
    }
    return 'Select a dilution tube to pour into the plate.'
  }
  if (step === 'incubate') {
    if (phase === 'incubating') return 'Incubating the plate...'
    if (phase === 'done') return 'Incubation complete. Continue to interpret.'
    return 'Start incubation to grow the colonies.'
  }
  if (step === 'interpret') {
    return 'Switch to the plate view to examine colony growth and estimate CFU.'
  }
  return 'Complete the previous steps to continue.'
}
