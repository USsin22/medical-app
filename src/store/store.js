import { configureStore } from '@reduxjs/toolkit'
import { rdvSlice} from './rdvSlice.js'

import { medecinSlice } from './medecinSlice.js'
import { patientSlice } from './patientSlice.js'
import {optionsSlice} from './optionsSlice.js'
import {consultationSlice} from './consultationsSlice.js'

export const store = configureStore({
  reducer: {
    rdv: rdvSlice.reducer,
    medecin: medecinSlice.reducer,
    patient: patientSlice.reducer,
    consultation: consultationSlice.reducer,
    options: optionsSlice.reducer,
  }
})
