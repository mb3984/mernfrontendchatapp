import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async action to fetch bot's reply
export const fetchBotReply = createAsyncThunk(
  "chat/fetchBotReply",
  async (message, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://mernbackendchatapp.onrender.com/api/chat/ask",
        { message }
      );
      return response.data.reply;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    status: "idle", // idle, loading, failed
    error: null,
  },
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({ from: "user", text: action.payload });
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBotReply.fulfilled, (state, action) => {
        state.messages.push({ from: "bot", text: action.payload });
        state.status = "idle";
        state.error = null;
      })
      .addCase(fetchBotReply.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBotReply.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { addUserMessage, clearMessages } = chatSlice.actions;

export default chatSlice.reducer;
