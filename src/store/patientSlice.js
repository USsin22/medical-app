import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Assuming data.json is in the public folder
const PATIENTS_URL = 'http://localhost:3000/patients';

export const fetchPatients = createAsyncThunk('patients/fetchPatients', async () => {
    const response = await axios.get(PATIENTS_URL);
    return response.data;
});

export const addPatient = createAsyncThunk('patients/addPatient', async (newPatient) => {
    const response = await axios.post(PATIENTS_URL, newPatient);
    return response.data;
});

export const updatePatient = createAsyncThunk('patients/updatePatient', async (updatedPatient) => {
    const response = await axios.put(`${PATIENTS_URL}/${updatedPatient.id}`, updatedPatient);
    return response.data;
});

export const deletePatient = createAsyncThunk('patients/deletePatient', async (id) => {
    await axios.delete(`${PATIENTS_URL}/${id}`);
    return id;
});

const initialState = {
  patients: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.patients = action.payload;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addPatient.fulfilled, (state, action) => {
        state.patients.push(action.payload);
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        const idx = state.patients.findIndex(p => p.id === action.payload.id);
        if (idx !== -1) state.patients[idx] = action.payload;
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.patients = state.patients.filter(p => p.id !== action.payload);
      })
  }
});

export default patientSlice.reducer;
