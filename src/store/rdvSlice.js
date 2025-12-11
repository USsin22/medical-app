import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  appointments: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const RENDEZVOUS_URL = 'http://localhost:3000/rendezvous';

export const fetchRendezvous = createAsyncThunk('rdv/fetchRendezvous', async () => {
  const response = await axios.get(RENDEZVOUS_URL);
  return response.data;
});

export const addRendezvous = createAsyncThunk('rdv/addRendezvous', async (newRdv) => {
  const response = await axios.post(RENDEZVOUS_URL, newRdv);
  return response.data;
});

export const updateRendezvous = createAsyncThunk('rdv/updateRendezvous', async (updatedRdv) => {
  const response = await axios.put(`${RENDEZVOUS_URL}/${updatedRdv.id}`, updatedRdv);
  return response.data;
});

export const deleteRendezvous = createAsyncThunk('rdv/deleteRendezvous', async (id) => {
  await axios.delete(`${RENDEZVOUS_URL}/${id}`);
  return id;
});

export const rdvSlice = createSlice({
  name: 'rdv',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchRendezvous.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRendezvous.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.appointments = action.payload;
      })
      .addCase(fetchRendezvous.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addRendezvous.fulfilled, (state, action) => {
        state.appointments.push(action.payload);
      })
      .addCase(updateRendezvous.fulfilled, (state, action) => {
        const idx = state.appointments.findIndex(r => r.id === action.payload.id);
        if (idx !== -1) state.appointments[idx] = action.payload;
      })
      .addCase(deleteRendezvous.fulfilled, (state, action) => {
        state.appointments = state.appointments.filter(r => r.id !== action.payload);
      });
  }
});

export default rdvSlice.reducer;
