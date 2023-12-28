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
                const response = await axios.get(`https://4bc0-110-235-235-75.ngrok-free.app/track/order-shipment`, {
                    params: { orderId, email },
                    headers: { 'ngrok-skip-browser-warning': 'true','X-Frame-Options': 'ALLOW-FROM' }
                });
                this.setTrackingData(response.data);
                return response.data;
            } catch (error) {
                this.setErrorState(true); // Set error state for any error
            }
        },
        async fetchTrackingDataByID(trackingId: string) {
            try {
                const response = await axios.get(`https://4bc0-110-235-235-75.ngrok-free.app/track/order-shipment-id`, {
                    params: { trackingId },
                    headers: { 'ngrok-skip-browser-warning': 'true' ,'X-Frame-Options': 'ALLOW-FROM'}
                });
                this.setTrackingData(response.data);
                return response.data;
            } catch (error) {
                this.setErrorState(true); // Set error state for any error
            }
        }
    }
})

