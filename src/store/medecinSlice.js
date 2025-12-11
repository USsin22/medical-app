import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  medecins: [],
  status: 'idle',
  error: null,
};

export const medecinSlice = createSlice({
  name: 'medecin',
  
  initialState,
  reducers: {},
});

export default medecinSlice.reducer;