type Topic = 'gram-staining' | 'streak-plate' | 'ast' | 'serial-dilution' | 'biochemical-testing' | null

interface VisualReferencePanelProps {
  topic: Topic
  onRelatedTopic: (topic: string) => void
}

export function VisualReferencePanel({ topic, onRelatedTopic }: VisualReferencePanelProps) {
  return (
    <div className="bg-surface rounded-card border border-stone/10 p-5 h-full flex flex-col">
      <h3 className="text-sm font-semibold text-charcoal mb-4">Visual Reference</h3>

      <div className="flex-1 flex flex-col items-center justify-center">
        {topic === 'gram-staining' ? (
          <GramStainingVisual />
        ) : topic === 'streak-plate' ? (
          <StreakPlateVisual />
        ) : topic === 'ast' ? (
          <AstVisual />
        ) : topic === 'serial-dilution' ? (
          <SerialDilutionVisual />
        ) : topic === 'biochemical-testing' ? (
          <BiochemicalTestingVisual />
        ) : (
          <EmptyState />
        )}
      </div>

      {topic && (
        <div className="mt-4 pt-4 border-t border-stone/10">
          <h4 className="text-xs font-semibold text-charcoal mb-2">Related Topics</h4>
          <div className="flex flex-wrap gap-2">
            {getRelatedTopics(topic).map((related) => (
              <button
                key={related}
                onClick={() => onRelatedTopic(related)}
                className="text-xs px-2 py-1 rounded border border-coral/30 text-coral hover:bg-coral/10 transition-colors"
              >
                {related}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center space-y-3">
      <div className="w-12 h-12 rounded-full bg-stone/10 flex items-center justify-center mx-auto">
        <span className="text-2xl">🔬</span>
      </div>
      <p className="text-sm text-stone">
        Ask a question to see relevant visual references appear here.
      </p>
    </div>
  )
}

function GramStainingVisual() {
  return (
    <div className="w-full space-y-4">
      <svg viewBox="0 0 200 120" className="w-full h-auto">
        {/* Gram-positive cell */}
        <g transform="translate(20, 20)">
          <rect x="0" y="0" width="70" height="80" rx="35" fill="#E8D5F0" stroke="#9932CC" strokeWidth="2" />
          <rect x="10" y="0" width="50" height="80" fill="#9932CC" opacity="0.4" />
          <text x="35" y="45" textAnchor="middle" fontSize="10" fill="#9932CC" fontWeight="bold">
            Gram+
          </text>
          <text x="35" y="95" textAnchor="middle" fontSize="8" fill="#666">
            Thick peptidoglycan
          </text>
        </g>

        {/* Gram-negative cell */}
        <g transform="translate(110, 20)">
          <rect x="0" y="0" width="70" height="80" rx="35" fill="#FFE4E1" stroke="#FF69B4" strokeWidth="2" />
          <rect x="5" y="0" width="15" height="80" fill="#FF69B4" opacity="0.3" />
          <rect x="50" y="0" width="15" height="80" fill="#FF69B4" opacity="0.3" />
          <text x="35" y="45" textAnchor="middle" fontSize="10" fill="#FF69B4" fontWeight="bold">
            Gram-
          </text>
          <text x="35" y="95" textAnchor="middle" fontSize="8" fill="#666">
            Thin + outer membrane
          </text>
        </g>
      </svg>

      <div className="flex justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-[#9932CC]" />
          <span className="text-stone">Crystal violet retained</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-[#FF69B4]" />
          <span className="text-stone">Crystal violet lost</span>
        </div>
      </div>

      <p className="text-xs text-stone text-center italic">
        Decolorization removes stain from thin cell walls but not thick ones.
      </p>
    </div>
  )
}

function StreakPlateVisual() {
  return (
    <div className="w-full space-y-4">
      <svg viewBox="0 0 200 150" className="w-full h-auto">
        {/* Plate background */}
        <circle cx="100" cy="75" r="70" fill="#F5F5DC" stroke="#8B4513" strokeWidth="2" />

        {/* Quadrant regions */}
        <path d="M100 75 L30 30" stroke="#8B4513" strokeWidth="1" opacity="0.3" />
        <path d="M100 75 L170 30" stroke="#8B4513" strokeWidth="1" opacity="0.3" />
        <path d="M100 75 L30 120" stroke="#8B4513" strokeWidth="1" opacity="0.3" />
        <path d="M100 75 L170 120" stroke="#8B4513" strokeWidth="1" opacity="0.3" />

        {/* Region 1 - dense */}
        <g>
          <circle cx="65" cy="52" r="8" fill="#FFE4B5" />
          <circle cx="55" cy="60" r="6" fill="#FFE4B5" />
          <circle cx="75" cy="58" r="7" fill="#FFE4B5" />
          <circle cx="60" cy="45" r="5" fill="#FFE4B5" />
          <circle cx="70" cy="65" r="6" fill="#FFE4B5" />
        </g>

        {/* Region 2 - medium */}
        <g>
          <circle cx="135" cy="52" r="6" fill="#FFE4B5" />
          <circle cx="145" cy="58" r="5" fill="#FFE4B5" />
          <circle cx="125" cy="60" r="5" fill="#FFE4B5" />
        </g>

        {/* Region 3 - sparse */}
        <g>
          <circle cx="65" cy="98" r="4" fill="#FFE4B5" />
          <circle cx="75" cy="92" r="4" fill="#FFE4B5" />
        </g>

        {/* Region 4 - isolated */}
        <g>
          <circle cx="135" cy="98" r="3" fill="#FFE4B5" />
          <circle cx="145" cy="92" r="3" fill="#FFE4B5" />
        </g>

        {/* Labels */}
        <text x="50" y="25" textAnchor="middle" fontSize="8" fill="#666">1</text>
        <text x="150" y="25" textAnchor="middle" fontSize="8" fill="#666">2</text>
        <text x="50" y="135" textAnchor="middle" fontSize="8" fill="#666">3</text>
        <text x="150" y="135" textAnchor="middle" fontSize="8" fill="#666">4</text>
      </svg>

      <div className="flex justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-[#FFE4B5]" />
          <span className="text-stone">Bacterial colonies</span>
        </div>
      </div>

      <p className="text-xs text-stone text-center italic">
        Colonies become more isolated from region 1 to 4.
      </p>
    </div>
  )
}

function AstVisual() {
  return (
    <div className="w-full space-y-4">
      <svg viewBox="0 0 200 150" className="w-full h-auto">
        {/* Plate background */}
        <circle cx="100" cy="75" r="70" fill="#F5F5DC" stroke="#8B4513" strokeWidth="2" />

        {/* Lawn background */}
        <circle cx="100" cy="75" r="65" fill="#FFE4B5" opacity="0.3" />

        {/* Inhibition zones */}
        <g>
          {/* Disc 1 - large zone */}
          <circle cx="60" cy="50" r="25" fill="#FFE4B5" stroke="#32CD32" strokeWidth="2" />
          <circle cx="60" cy="50" r="5" fill="#90EE90" />
          <text x="60" y="53" textAnchor="middle" fontSize="6" fill="#333">A</text>

          {/* Disc 2 - medium zone */}
          <circle cx="140" cy="50" r="18" fill="#FFE4B5" stroke="#FFD700" strokeWidth="2" />
          <circle cx="140" cy="50" r="5" fill="#90EE90" />
          <text x="140" y="53" textAnchor="middle" fontSize="6" fill="#333">B</text>

          {/* Disc 3 - small zone */}
          <circle cx="100" cy="110" r="12" fill="#FFE4B5" stroke="#FF6347" strokeWidth="2" />
          <circle cx="100" cy="110" r="5" fill="#90EE90" />
          <text x="100" y="113" textAnchor="middle" fontSize="6" fill="#333">C</text>
        </g>
      </svg>

      <div className="flex justify-center gap-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full border-2 border-[#32CD32]" />
          <span className="text-stone">Susceptible</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full border-2 border-[#FFD700]" />
          <span className="text-stone">Intermediate</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full border-2 border-[#FF6347]" />
          <span className="text-stone">Resistant</span>
        </div>
      </div>

      <p className="text-xs text-stone text-center italic">
        Zone size doesn't equal drug strength — use standardized breakpoints.
      </p>
    </div>
  )
}

function SerialDilutionVisual() {
  return (
    <div className="w-full space-y-4">
      <svg viewBox="0 0 200 120" className="w-full h-auto">
        {/* Dilution tubes */}
        {[
          { x: 20, label: '10⁻¹', color: '#9932CC', opacity: 0.9 },
          { x: 55, label: '10⁻²', color: '#9932CC', opacity: 0.75 },
          { x: 90, label: '10⁻³', color: '#9932CC', opacity: 0.6 },
          { x: 125, label: '10⁻⁴', color: '#9932CC', opacity: 0.45 },
          { x: 160, label: '10⁻⁵', color: '#9932CC', opacity: 0.3 },
        ].map((tube) => (
          <g key={tube.x}>
            <rect x={tube.x} y={30} width={25} height={50} rx="3" fill="#F5F5F5" stroke="#666" strokeWidth="1" />
            <rect x={tube.x + 2} y={32} width={21} height={48} rx="2" fill={tube.color} opacity={tube.opacity} />
            <text x={tube.x + 12.5} y={95} textAnchor="middle" fontSize="9" fill="#666">
              {tube.label}
            </text>
          </g>
        ))}

        {/* Transfer arrows */}
        <path d="M48 55 L52 55" stroke="#666" strokeWidth="1" markerEnd="url(#arrow)" />
        <path d="M83 55 L87 55" stroke="#666" strokeWidth="1" markerEnd="url(#arrow)" />
        <path d="M118 55 L122 55" stroke="#666" strokeWidth="1" markerEnd="url(#arrow)" />
        <path d="M153 55 L157 55" stroke="#666" strokeWidth="1" markerEnd="url(#arrow)" />

        {/* Arrow marker definition */}
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6" fill="#666" />
          </marker>
        </defs>
      </svg>

      <div className="flex justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-[#9932CC]" />
          <span className="text-stone">Bacterial concentration</span>
        </div>
      </div>

      <p className="text-xs text-stone text-center italic">
        Each tube is 10× more dilute than the previous one.
      </p>
    </div>
  )
}

function BiochemicalTestingVisual() {
  return (
    <div className="w-full space-y-4">
      <svg viewBox="0 0 200 140" className="w-full h-auto">
        {/* Test tubes */}
        {[
          { x: 20, name: 'Cat', result: 'positive', color: '#FF6347' },
          { x: 55, name: 'Ox', result: 'negative', color: '#32CD32' },
          { x: 90, name: 'Ind', result: 'positive', color: '#FF6347' },
          { x: 125, name: 'Cit', result: 'positive', color: '#FF6347' },
          { x: 160, name: 'Ure', result: 'negative', color: '#32CD32' },
        ].map((tube) => (
          <g key={tube.x}>
            <rect x={tube.x} y={20} width={25} height={60} rx="3" fill="#F5F5F5" stroke="#666" strokeWidth="1" />
            <rect x={tube.x + 2} y={70} width={21} height={8} rx="1" fill={tube.color} />
            <text x={tube.x + 12.5} y={15} textAnchor="middle" fontSize="8" fill="#666">
              {tube.name}
            </text>
            <text x={tube.x + 12.5} y={95} textAnchor="middle" fontSize="7" fill="#666">
              {tube.result === 'positive' ? '+' : '-'}
            </text>
          </g>
        ))}
      </svg>

      <div className="flex justify-center gap-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-[#FF6347]" />
          <span className="text-stone">Positive</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-[#32CD32]" />
          <span className="text-stone">Negative</span>
        </div>
      </div>

      <p className="text-xs text-stone text-center italic">
        The full pattern of results identifies the organism.
      </p>
    </div>
  )
}

function getRelatedTopics(topic: NonNullable<Topic>): string[] {
  const topicMap: Record<NonNullable<Topic>, string[]> = {
    'gram-staining': ['Decolorization', 'Cell wall structure', 'Safranin counterstain'],
    'streak-plate': ['Colony isolation', 'Loop flaming', 'Aseptic technique'],
    'ast': ['Inhibition zones', 'Breakpoints', 'Even lawn'],
    'serial-dilution': ['CFU calculation', 'Dilution factor', 'Countable plates'],
    'biochemical-testing': ['Enzyme tests', 'Pattern matching', 'Metabolic pathways'],
  }
  return topicMap[topic] || []
}
