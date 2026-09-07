import { BenchItemCard } from './BenchItemCard'
import { BenchSurface } from './BenchSurface'
import type { Phase, StepId, TestTubeId, ReactionResult } from '../../data/biochemicalTesting'
import { BENCH_ITEMS, TEST_TUBES, TEST_TUBE_INFO, TEST_MEANINGS } from '../../data/biochemicalTesting'
import type { Mistake } from '../../data/biochemicalTesting'

interface BiochemicalTestingBenchSceneProps {
  step: StepId
  phase: Phase
  selected: Set<string>
  inoculationQuality: 'correct' | 'incomplete' | null
  inoculatedTubes: TestTubeId[]
  observedReactions: ReactionResult[]
  activeMistake: Mistake | null
  onSelectItem: (id: string) => void
  onInoculateTube: (tubeId: TestTubeId) => void
  onObserveTube: (tubeId: TestTubeId) => void
}

export function BiochemicalTestingBenchScene({
  step,
  phase,
  selected,
  inoculationQuality,
  inoculatedTubes,
  observedReactions,
  activeMistake,
  onSelectItem,
  onInoculateTube,
  onObserveTube,
}: BiochemicalTestingBenchSceneProps) {
  const sampleItems = BENCH_ITEMS.filter((i) => i.kind === 'sample')
  const tubesItems = BENCH_ITEMS.filter((i) => i.kind === 'tubes')
  const toolItems = BENCH_ITEMS.filter((i) => i.kind === 'tool')

  return (
    <div
      key={activeMistake?.timestamp ?? 'ok'}
      className={`rounded-card ${activeMistake ? 'animate-error-shake' : ''}`}
    >
      <BenchSurface
        photoSrc="/images/lab/scenes/biochemical-testing-scene.png"
        className="min-h-[520px] flex flex-col overflow-hidden"
      >
        {activeMistake && (
          <div className="absolute inset-0 bg-coral/[0.04] pointer-events-none z-20" />
        )}

        <div className="flex-1 relative px-6 py-8 lg:px-10 lg:py-10">
          {step === 'prepare' ? (
            <div className="relative z-10 h-full flex flex-col justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <ItemGroup
                  title="Sample"
                  items={sampleItems}
                  selected={selected}
                  disabled={phase === 'done'}
                  onSelect={onSelectItem}
                />
                <ItemGroup
                  title="Test Tubes"
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
              </div>
            </div>
          ) : step === 'inoculate' ? (
            <div className="relative z-10 h-full flex flex-col justify-center">
              <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative scale-125">
                    <div className="relative">
                      <img
                        src="/images/lab/streak-plate/inoculation-loop.png"
                        alt="Inoculating loop"
                        className={`w-32 lg:w-40 object-contain drop-shadow-2xl transition-transform duration-300 ${
                          phase === 'select' ? 'hover:scale-110 hover:-translate-y-2' : ''
                        }`}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-charcoal bg-white/80 px-3 py-1 rounded-full">
                    🧪 Inoculating Loop
                  </span>
                </div>

                <div className="flex-1 max-w-lg space-y-6">
                  <h3 className="text-xl font-bold text-charcoal">Inoculate Test Tubes</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {TEST_TUBES.map((tubeId) => {
                      const info = TEST_TUBE_INFO[tubeId]
                      const isInoculated = inoculatedTubes.includes(tubeId)
                      return (
                        <button
                          key={tubeId}
                          onClick={() => onInoculateTube(tubeId)}
                          disabled={isInoculated || phase !== 'select'}
                          className={`p-4 rounded-xl border-2 transition-all relative ${
                            isInoculated
                              ? 'border-teal bg-teal/20 shadow-md scale-105'
                              : 'border-stone/30 hover:border-stone/50 hover:bg-stone/10 hover:scale-105'
                          } ${phase !== 'select' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <div className="relative w-12 h-20 mx-auto mb-2 border-2 border-stone/40 rounded-b-lg bg-gradient-to-b from-stone/5 to-stone/10">
                            {isInoculated && (
                              <div className="absolute bottom-0 left-0 right-0 h-3 bg-coral/70 rounded-b animate-pulse" />
                            )}
                          </div>
                          <p className="text-sm font-bold text-charcoal">{info.name}</p>
                          <p className="text-xs text-stone mt-1">{info.reagent}</p>
                          {isInoculated && (
                            <p className="text-xs text-teal font-medium mt-1">✓ Inoculated</p>
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {inoculationQuality === 'incomplete' && (
                    <div className="p-4 bg-coral/10 rounded-xl border-2 border-coral/30">
                      <p className="text-sm font-bold text-coral">
                        ⚠️ Incomplete inoculation - some tubes were missed
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : step === 'incubate' ? (
            <div className="relative z-10 h-full flex flex-col justify-center">
              <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative scale-125">
                    <div className="relative">
                      <img
                        src="/images/lab/ast/vial-sample.png"
                        alt="Test tubes"
                        className={`w-32 lg:w-40 object-contain drop-shadow-2xl transition-all duration-300 ${
                          phase === 'incubating' ? 'animate-pulse' : ''
                        } ${phase === 'select' ? 'hover:scale-110 hover:-translate-y-2' : ''}`}
                      />
                      {phase === 'incubating' && (
                        <>
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-orange-300/30 blur-xl animate-pulse" />
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-orange-400/40 blur-md animate-bounce" />
                        </>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-charcoal bg-white/80 px-3 py-1 rounded-full">
                    {phase === 'incubating' ? '🔥 Incubating...' : phase === 'done' ? '✅ Complete' : '🧫 Test Tubes'}
                  </span>
                </div>

                <div className="flex-1 max-w-lg space-y-6">
                  <h3 className="text-xl font-bold text-charcoal">Incubation</h3>
                  
                  <div className={`flex items-center justify-center p-8 bg-white rounded-xl border-2 border-stone/10 shadow-lg transition-all ${
                    phase === 'incubating' ? 'animate-pulse border-orange-200' : ''
                  }`}>
                    <div className="text-center">
                      <p className="text-lg font-bold text-charcoal mb-3">
                        {phase === 'select' ? '⏳ Ready for incubation' : phase === 'incubating' ? '🔥 Reactions developing...' : '✅ Incubation complete'}
                      </p>
                      {phase === 'incubating' && (
                        <div className="flex items-center justify-center gap-3 mt-4">
                          <div className="w-3 h-3 rounded-full bg-coral animate-bounce shadow-lg" style={{ animationDelay: '0ms' }} />
                          <div className="w-3 h-3 rounded-full bg-coral animate-bounce shadow-lg" style={{ animationDelay: '150ms' }} />
                          <div className="w-3 h-3 rounded-full bg-coral animate-bounce shadow-lg" style={{ animationDelay: '300ms' }} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-5 bg-orange-50 rounded-xl border-2 border-orange-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-orange-800">🌡️ Temperature</span>
                      <span className="text-sm font-bold text-orange-800">
                        {phase === 'incubating' ? '37°C (Incubating)' : phase === 'done' ? '37°C (Complete)' : 'Room Temp'}
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
          ) : step === 'observe' ? (
            <div className="relative z-10 h-full flex flex-col justify-center">
              <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
                <div className="flex-1 max-w-2xl space-y-6">
                  <h3 className="text-xl font-bold text-charcoal">Observe Test Tube Reactions</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {TEST_TUBES.map((tubeId) => {
                      const info = TEST_TUBE_INFO[tubeId]
                      const observed = observedReactions.find((r) => r.tubeId === tubeId)
                      const meanings = TEST_MEANINGS[tubeId]
                      let result = observed?.result ?? 'negative'
                      if (inoculationQuality === 'incomplete' && !observed) {
                        result = 'ambiguous'
                      }
                      
                      return (
                        <button
                          key={tubeId}
                          onClick={() => onObserveTube(tubeId)}
                          disabled={observed?.observed}
                          className={`p-4 rounded-xl border-2 transition-all relative ${
                            observed?.observed
                              ? 'border-teal bg-teal/20 shadow-md'
                              : 'border-stone/30 hover:border-stone/50 hover:bg-stone/10'
                          } ${observed?.observed ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <div className="relative w-12 h-20 mx-auto mb-2 border-2 border-stone/40 rounded-b-lg bg-gradient-to-b from-stone/5 to-stone/10">
                            {/* Reaction indicator */}
                            {observed?.observed && (
                              <div className={`absolute bottom-0 left-0 right-0 h-3 rounded-b ${
                                result === 'positive' ? 'bg-coral/80' :
                                result === 'negative' ? 'bg-teal/80' :
                                'bg-stone/50'
                              } animate-pulse`} />
                            )}
                          </div>
                          <p className="text-sm font-bold text-charcoal">{info.name}</p>
                          <p className="text-xs text-stone mt-1">{info.reagent}</p>
                          {observed?.observed && (
                            <div className="mt-2 p-2 bg-white/80 rounded text-xs">
                              <p className="font-medium">
                                {result === 'positive' ? `✓ ${meanings.positive}` :
                                 result === 'negative' ? `✓ ${meanings.negative}` :
                                 '? Ambiguous'}
                              </p>
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {inoculationQuality === 'incomplete' && (
                    <div className="p-4 bg-coral/10 rounded-xl border-2 border-coral/30">
                      <p className="text-sm font-bold text-coral">
                        ⚠️ Some reactions are ambiguous due to incomplete inoculation
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="relative z-10 h-full flex flex-col justify-center">
              <div className="flex flex-col items-center gap-4">
                <p className="text-lg font-semibold text-charcoal">Complete the previous steps to continue.</p>
              </div>
            </div>
          )}
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
