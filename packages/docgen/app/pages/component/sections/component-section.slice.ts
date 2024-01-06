import React from 'react';
import { createSlice } from '@reduxjs/toolkit';
import { Normalizer } from '@docmate/core';

declare type SectionItem = {
    id: string;
    level: number;
};

const initialState: { sections: Record<string, SectionItem>; page: string } = {
    sections: {},
    page: '',
};

const sectionSlice = createSlice({
    name: 'sectionItems',
    initialState,
    reducers: {
        add(state, action: { payload: { level: number; name: string } }) {
            const { name, level } = action.payload;
            if (state.sections[name]) {
                return state;
            }
            state.sections = {
                ...state.sections,
                [name]: { id: Normalizer.sectionName(name), level },
            };
            return state;
        },
        clear() {
            return initialState;
        },
    },
});

export const { add, clear } = sectionSlice.actions;

export default sectionSlice.reducer;
