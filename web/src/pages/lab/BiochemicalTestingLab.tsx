import { LabShell } from '../../components/LabShell'
import { experiments } from '../../data/experiments'

const experiment = experiments.find((e) => e.slug === 'biochemical-testing')!

export function BiochemicalTestingLab() {
  return <LabShell title={experiment.title} steps={experiment.steps} />
}
