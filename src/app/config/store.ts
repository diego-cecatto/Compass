import { configureStore } from '@reduxjs/toolkit';
import sectionSlice from '../pages/partial/sections/component-section.slice';

export default configureStore({
    reducer: {
        sectionItems: sectionSlice,
    },
});
