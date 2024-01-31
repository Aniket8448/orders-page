import { defineStore } from "pinia";
import axios from 'axios';
import {TrackingState} from "@/Dto";

export const useTrackingStore = defineStore('tracking', {
    state: (): TrackingState => ({
        trackingData: [],
        error: false,
        wrongCreds: false,
        loading: false
    }),
    actions: {
        setTrackingData(data: any) {
            this.trackingData = data;
            this.error = false;
        },
        setErrorState(hasError: boolean) {
            this.error = hasError;
        },
        async fetchTrackingData(orderId: string, email: string, storeHash: string) {
            this.loading = true;
            try {
                const response = await axios.get(`https://3096-103-61-252-151.ngrok-free.app/track/order-shipment`, {
                    params: { orderId, email, storeHash },
                    headers: { 'ngrok-skip-browser-warning': 'true','X-Frame-Options': 'ALLOW-FROM' }
                });
                this.setTrackingData(response.data);
                return response.data;
            } catch (error) {
                if (axios.isAxiosError(error) && error.response && error.response.status === 403) {
                    this.wrongCreds = true; // Set wrongCreds to true if the status code is 403
                } else {
                    this.setErrorState(true); // Set error state for other types of errors
                }
            } finally {
                this.loading = false;
            }
        },
        async fetchTrackingDataByID(trackingId: string, storeHash: string) {
            this.loading = true;
            try {
                const response = await axios.get(`https://3096-103-61-252-151.ngrok-free.app/track/order-shipment-id`, {
                    params: { trackingId, storeHash },
                    headers: { 'ngrok-skip-browser-warning': 'true' ,'X-Frame-Options': 'ALLOW-FROM'}
                });
                this.setTrackingData(response.data);
                return response.data;
            } catch (error) {
                if (axios.isAxiosError(error) && error.response && error.response.status === 403) {
                    this.wrongCreds = true; // Set wrongCreds to true if the status code is 403
                } else {
                    this.setErrorState(true); // Set error state for other types of errors
                }
            } finally {
                this.loading = false;
            }
        }
    }
})

