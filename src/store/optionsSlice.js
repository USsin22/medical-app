import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE = "http://localhost:3000";

export const fetchGroupesSanguins = createAsyncThunk(
  "options/fetchGroupesSanguins",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE}/groupes_sanguins`);
      return data;
    } catch (e) {
      return rejectWithValue("Failed to load groupes sanguins");
    }
  }
);

export const fetchMotifsRdv = createAsyncThunk(
  "options/fetchMotifsRdv",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE}/motifs_rdv`);
      return data;
    } catch (e) {
      return rejectWithValue("Failed to load motifs RDV");
    }
  }
);

export const fetchStatutsRdv = createAsyncThunk(
  "options/fetchStatutsRdv",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE}/statuts_rdv`);
      return data;
    } catch (e) {
      return rejectWithValue("Failed to load statuts RDV");
    }
  }
);

export const fetchModesPaiement = createAsyncThunk(
  "options/fetchModesPaiement",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE}/modes_paiement`);
      return data;
    } catch (e) {
      return rejectWithValue("Failed to load modes paiement");
    }
  }
);

export const fetchStatistiques = createAsyncThunk(
  "options/fetchStatistiques",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE}/statistiques`);
      return data;
    } catch (e) {
      return rejectWithValue("Failed to load statistiques");
    }
  }
);

const initialState = {
  groupesSanguins: [],
  motifsRdv: [],
  statutsRdv: [],
  modesPaiement: [],
  statistiques: null,
  status: "idle",
  error: null,
};

export const optionsSlice = createSlice({
  name: "options",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroupesSanguins.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(fetchGroupesSanguins.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.groupesSanguins = a.payload;
      })
      .addCase(fetchGroupesSanguins.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload || a.error.message;
      })
      .addCase(fetchMotifsRdv.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(fetchMotifsRdv.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.motifsRdv = a.payload;
      })
      .addCase(fetchMotifsRdv.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload || a.error.message;
      })
      .addCase(fetchStatutsRdv.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(fetchStatutsRdv.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.statutsRdv = a.payload;
      })
      .addCase(fetchStatutsRdv.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload || a.error.message;
      })
      .addCase(fetchModesPaiement.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(fetchModesPaiement.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.modesPaiement = a.payload;
      })
      .addCase(fetchModesPaiement.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload || a.error.message;
      })
      .addCase(fetchStatistiques.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(fetchStatistiques.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.statistiques = a.payload;
      })
      .addCase(fetchStatistiques.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload || a.error.message;
      });
  },
});

export default optionsSlice.reducer;
