import { createSlice } from '@reduxjs/toolkit';
import { Normalizer } from '../../../../utils/normalizer';

declare type SectionItem = {
    id: string;
};

const initialState: { sections: Record<string, SectionItem>; page: string } = {
    sections: {},
    page: '',
};

const sectionSlice = createSlice({
    name: 'sectionItems',
    initialState,
    reducers: {
        add(state, action: { payload: string }) {
            const name = action.payload;
            if (state.sections[name]) {
                return state;
            }
            state.sections = {
                ...state.sections,
                [name]: { id: Normalizer.sectionName(name) },
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
