import {createSlice} from '@reduxjs/toolkit';
import { get } from 'mongoose';

// train slice
const trainSlice = createSlice({
    name: 'train',
    initialState: {
        loading: false,
        error: null,
        trains: [],
        train: {},
        pnr: {},
        reservationChart: {},
        fare: null,
        isDeleted: false,
        isCreated: false,
        isUpdated: false
    },
    reducers: {
        clearTrainError(state, action) {
            return {
                ...state,
                error: null,
            };
        },
        searchTrainsRequest(state, action) {
            return {
                ...state,
                loading: true,
            };
        },
        searchTrainsSuccess(state, action) {
            return {
                ...state,
                loading: false,
                trains: action.payload,
            };
        },
        searchTrainsFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        },
        getTrainRequest(state, action) {
            return {
                ...state,
                loading: true,
            };
        },
        getTrainSuccess(state, action) {
            return {
                ...state,
                loading: false,
                train: action.payload,
            };
        },
        getTrainFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        },
        getPnrRequest(state, action) {
            return {
                ...state,
                loading: true,
            };
        },
        getPnrSuccess(state, action) {
            return {
                ...state,
                loading: false,
                pnr: action.payload,
            };
        },
        getPnrFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        },
        reservationChartRequest(state, action) {
            return {
                ...state,
                loading: true,
            };
        },
        reservationChartSuccess(state, action) {
            return {
                ...state,
                loading: false,
                reservationChart: action.payload,
            };
        },
        reservationChartFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        },
        getFareRequest(state, action) {
            return {
                ...state,
                loading: true,
            };
        },
        getFareSuccess(state, action) {
            return {
                ...state,
                loading: false,
                fare: action.payload,
            };
        },
        getFareFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        },
        newTrainRequest(state, action) {
            return {
                ...state,
                loading: true,
            };
        },
        newTrainSuccess(state, action) {
            return {
                ...state,
                loading: false,
                train: action.payload,
                isCreated: true
            };
        },
        newTrainFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload,
                isCreated: false
            };
        },
        deleteTrainRequest(state, action){
            return {
                ...state,
                loading: true,
                isDeleted: false
            }
        },
        deleteTrainSuccess(state, action) {
            return {
                ...state,
                loading: false,
                isDeleted: true
            }
        },
        deleteTrainFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload,
                isDeleted: false
            }
        },
        updateTrainRequest(state, action){
            return {
                ...state,
                loading: true,
                isUpdated: false
            }
        },
        updateTrainSuccess(state, action) {
            return {
                ...state,
                loading: false,
                isUpdated: true
            }
        },
        updateTrainFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload,
                isUpdated: false
            }
        },
        clearIsTrainCreated(state, action) {
            return {
                ...state,
                isCreated: false,
            }
        },
        clearIsTrainUpdated(state, action) {
            return {
                ...state,
                isUpdated: false
            }
        },
        clearIsTrainDeleted(state, action) {
            return {
                ...state,
                isDeleted: false
            }
        },
    }
});

// export reducer and action
const {actions, reducer} = trainSlice;

export const {
    clearTrainError,
    searchTrainsFail,
    searchTrainsRequest,
    searchTrainsSuccess,
    getTrainFail,
    getTrainRequest,
    getTrainSuccess,
    getPnrFail,
    getPnrRequest,
    getPnrSuccess,
    reservationChartFail,
    reservationChartRequest,
    reservationChartSuccess,
    getFareFail,
    getFareRequest,
    getFareSuccess,
    newTrainFail,
    newTrainRequest,
    newTrainSuccess,
    deleteTrainFail,
    deleteTrainRequest,
    deleteTrainSuccess,
    updateTrainFail,
    updateTrainRequest,
    updateTrainSuccess,
    clearIsTrainCreated,
    clearIsTrainUpdated,
    clearIsTrainDeleted

} = actions;

export default reducer;