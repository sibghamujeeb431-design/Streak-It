import { useState } from "react"

type GramStaining3DSceneProps = {
  timerMs: number
  timerRunning: boolean
  phase: string
  mode: string
  onPickReagent: (id: 'crystal-violet' | 'iodine' | 'decolorizer' | 'safranin') => void
  onRinseSlide: () => void
}

export function GramStaining3DScene({
  timerMs,
  timerRunning,
   phase,
  onPickReagent,
  onRinseSlide, 
}: GramStaining3DSceneProps) {

  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null)
const [step, setStep] = useState(1)
const [crystalVioletApplied, setCrystalVioletApplied] = useState(false)
const [isRinsing, setIsRinsing] = useState(false)

  return (
    <div className="w-full h-[600px] bg-surface rounded-card overflow-hidden relative">
      {/* Locked laboratory workstation image */}

      <img
        src="/Gram%20Stain%20Laboratory%20Workstation.png"
        alt="Gram staining laboratory workstation"
        className="w-full h-full object-contain scale-[0.82] -translate-y-[20px]"
      />

      {/* =========================================================
          CALIBRATION HOTSPOTS
          All hotspots are RED temporarily so their positions
          can be visually adjusted over the real objects.
         ========================================================= */}

      {step === 2 && (
        <div className="absolute left-[36%] top-[24%] w-[7%] h-[18%] border-2 border-red-500/60 rounded-sm pointer-events-none" />
      )}

      {/* Crystal Violet */}

      <button
        type="button"
        aria-label="Crystal Violet"
        className="absolute left-[36%] top-[24%] w-[7%] h-[18%] cursor-pointer bg-transparent"
        onClick={() => {
          setSelectedEquipment("Crystal Violet")
          setCrystalVioletApplied(true)
          onPickReagent("crystal-violet")
        }}
      />
      {/* Gram's Iodine */}

      <button
        type="button"
        aria-label="Gram's Iodine"
        className="absolute left-[43%] top-[24%] w-[7%] h-[18%] cursor-pointer bg-transparent"
        onClick={() => setSelectedEquipment("Gram's Iodine")}
      />

      {/* Decolorizer */}

      <button
        type="button"
        aria-label="Decolorizer"
        className="absolute left-[50%] top-[24%] w-[7%] h-[18%] cursor-pointer bg-transparent"
        onClick={() => setSelectedEquipment("Decolorizer")}
      />

      {/* Safranin */}

      <button
        type="button"
        aria-label="Safranin"
        className="absolute left-[57%] top-[24%] w-[7%] h-[18%] cursor-pointer bg-transparent"
        onClick={() => setSelectedEquipment("Safranin")}
      />

      {/* Bacterial Sample */}

      <button
        type="button"
        aria-label="Bacterial sample"
        className="absolute left-[73%] top-[29%] w-[9%] h-[18%] cursor-pointer bg-transparent"
        onClick={() => setSelectedEquipment("Bacterial sample")}
      />

      {/* Microscope */}

      <button
        type="button"
        aria-label="Microscope"
        className="absolute left-[12%] top-[27%] w-[24%] h-[38%] cursor-pointer bg-transparent"
        onClick={() => setSelectedEquipment("Microscope")}
      />

      {/* Slide Tray */}

      <button
        type="button"
        aria-label="Slide tray"
        className="absolute left-[41%] top-[47%] w-[22%] h-[8%] cursor-pointer bg-transparent"
        onClick={() => setSelectedEquipment("Slide tray")}
      />

      {step === 1 && (
  <div className="absolute left-[40%] top-[57%] w-[15%] h-[5%] border-2 border-red-500/60 rounded-sm pointer-events-none" />
)}

      {/* Glass Slide */}

      <button
        type="button"
        aria-label="Glass slide"
        className="absolute left-[40%] top-[57%] w-[15%] h-[5%] cursor-pointer bg-transparent"
        onClick={() => {
          setSelectedEquipment("Glass slide")
          setStep(2)
        }}
      />

      {crystalVioletApplied && phase === 'rinse' && (
  <button
    type="button"
    aria-label="Rinse slide"
    className="absolute left-[40%] top-[57%] w-[15%] h-[5%] cursor-pointer bg-transparent border-2 border-blue-400/70 rounded-sm"

    onClick={() => {
  alert("Rinse Slide clicked")
  setSelectedEquipment("Rinse Slide")
  setIsRinsing(true)
  onRinseSlide()
}}
  />
)}

{crystalVioletApplied && (
  <div className="absolute left-[40%] top-[57%] w-[15%] h-[5%] bg-purple-500/60 rounded-sm pointer-events-none" />
)}

{isRinsing && (
  <div
    className="absolute left-[39%] top-[54%] w-[17%] h-[11%] rounded-md pointer-events-none"
    style={{
      background:
        "linear-gradient(180deg, rgba(147,197,253,0.15), rgba(96,165,250,0.55), rgba(191,219,254,0.2))",
    }}
  />
)}

      {/* Inoculating Tube */}

      <button
        type="button"
        aria-label="Inoculating tube"
        className="absolute left-[59%] top-[50%] w-[5%] h-[19%] cursor-pointer bg-transparent rotate-[-137deg]"
        onClick={() => setSelectedEquipment("Inoculating tube")}
      />

      {/* Tissue Paper */}

      <button
        type="button"
        aria-label="Tissue paper"
        className="absolute z-30 left-[40%] top-[57%] w-[15%] h-[5%] cursor-pointer bg-transparent border-2 border-blue-400/70 rounded-sm"
        onClick={() => setSelectedEquipment("Tissue paper")}
      />

      {/* =========================================================
          SELECTION LABEL
         ========================================================= */}

      {selectedEquipment && (
        <div className="absolute top-4 left-4 z-20 rounded-lg bg-black/80 px-4 py-2 text-white">
          {selectedEquipment} selected
        </div>
      )}
{(phase === 'apply' || phase === 'rinse') && (
  <div className="absolute top-4 right-4 z-20 rounded-lg bg-black/80 px-4 py-2 text-white">
    <p>{phase === 'rinse' ? 'Ready to rinse' : 'Crystal Violet'}</p>
    {phase === 'apply' && (
      <>
        <p>{(timerMs / 1000).toFixed(1)}s</p>
        {timerRunning && <p>Staining in progress</p>}
      </>
    )}
  </div>
)}
    </div>
  )
}
