import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

const CONSULTATIONS_URL = 'http://localhost:3000/consultations';

export const fetchConsultations = createAsyncThunk('consultations/fetchConsultations', async () => {
    const response = await axios.get(CONSULTATIONS_URL);
    return response.data;
});

export const addConsultation = createAsyncThunk('consultations/addConsultation', async (newConsultation) => {
    const response = await axios.post(CONSULTATIONS_URL, newConsultation);
    return response.data;
});

export const updateConsultation = createAsyncThunk('consultations/updateConsultation', async (updatedConsultation) => {
    const response = await axios.put(`${CONSULTATIONS_URL}/${updatedConsultation.id}`, updatedConsultation);
    return response.data;
});

export const deleteConsultation = createAsyncThunk('consultations/deleteConsultation', async (id) => {
    await axios.delete(`${CONSULTATIONS_URL}/${id}`);
    return id;
});

const initialState = {
  consultations: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const consultationSlice = createSlice({
  name: 'consultation',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchConsultations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchConsultations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Add any fetched consultations to the array
        state.consultations = action.payload;
      })
      .addCase(fetchConsultations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addConsultation.fulfilled, (state, action) => {
        state.consultations.push(action.payload);
      })
      .addCase(updateConsultation.fulfilled, (state, action) => {
        const idx = state.consultations.findIndex(c => c.id === action.payload.id);
        if (idx !== -1) state.consultations[idx] = action.payload;
      })
      .addCase(deleteConsultation.fulfilled, (state, action) => {
        state.consultations = state.consultations.filter(c => c.id !== action.payload);
      })
  }
});

export default consultationSlice.reducer;
