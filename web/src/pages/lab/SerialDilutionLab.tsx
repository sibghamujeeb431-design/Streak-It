import { LabShell } from '../../components/LabShell'
import { experiments } from '../../data/experiments'

const experiment = experiments.find((e) => e.slug === 'serial-dilution')!

export function SerialDilutionLab() {
  return <LabShell title={experiment.title} steps={experiment.steps} />
}
