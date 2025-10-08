import { z } from 'zod'


const GateSettings = z.object({
  vgMax: z.number(),
  vgMin: z.number(),
  gateStep: z.number(),
})

const TimeSettings = z.object({
  gateV: z.number(),
  delay: z.number(),
})

const Settings = z.union([GateSettings, TimeSettings])

export const TestSchema = z.looseObject({
  _id: z.string(),
  trialId: z.string(),
  type: z.enum(['gate', 'time']),
  notes: z.string().optional(),
  channel: z.enum(['1', '2', '3', '4']),
  commands: z.string(),
  measurements: z.array(
    z.object({
      time: z.number().optional(),
      gateV: z.number().optional(),
      voltageX: z.number(),
      voltageY: z.number(),
      current: z.number(),
      frequency: z.number(),
    }),
  ),
  settings: Settings,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export const TrialSchema = z.looseObject({
  _id: z.string(),
  name: z.string(),
  notes: z.string().optional(),
  procedures: z.string().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
