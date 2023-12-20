import { defineStore } from "pinia";
import axios from 'axios';
import {TrackingState} from "@/Dto";
export const useTrackingStore = defineStore('tracking', {
    state: (): TrackingState => ({
        trackingData: [],
        error: false,
    }),
    actions: {
        setTrackingData(data: any) {
            this.trackingData = data;
            this.error = false;
        },
        setErrorState(hasError: boolean) {
            this.error = hasError;
        },
        async fetchTrackingData(orderId: string, email: string) {
            try {
                const response = await axios.get(`https://e040-110-235-235-226.ngrok-free.app/track/order-shipment`, {
                    params: { orderId, email },
                    headers: { 'ngrok-skip-browser-warning': 'true','X-Frame-Options': 'SAMEORIGIN' }
                });
                this.setTrackingData(response.data);
                return response.data;
            }catch (error) {
                if (error.response && error.response.status === 500) {
                    this.setErrorState(true); // Set error state for HTTP 500 errors
                }
            }
        },
        async fetchTrackingDataByID(trackingId: string) {
            try {
                const response = await axios.get(`https://e040-110-235-235-226.ngrok-free.app/track/order-shipment-id`, {
                    params: { trackingId },
                    headers: { 'ngrok-skip-browser-warning': 'true' ,'X-Frame-Options': 'SAMEORIGIN'}
                });
                this.setTrackingData(response.data);
                return response.data;
            } catch (error) {
                if (error.response && error.response.status === 500) {
                    this.setErrorState(true);
                }
            }
        }
    }
})
