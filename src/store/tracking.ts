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
        async fetchTrackingData(orderId: string, storeHash: string, email?: string) {
            this.loading = true;
            try {
                const response = await axios.get(`https://da38-103-61-252-156.ngrok-free.app/track/order-shipment`, {
                    params: { orderId, email, storeHash },
                    headers: { 'ngrok-skip-browser-warning': 'true','X-Frame-Options': 'ALLOW-FROM' }
                });
                console.log(response);
                this.setTrackingData(response.data);
                console.log("Tracking-data", this.trackingData);
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
                const response = await axios.get(`https://da38-103-61-252-156.ngrok-free.app/track/order-shipment-id`, {
                    params: { trackingId, storeHash },
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
        async fetchEmailValidationStatus(storeHash: string) {
            this.loading = true;
            try {
                const response = await axios.get(`https://da38-103-61-252-156.ngrok-free.app/track/email-validation-status`, {
                    params: { storeHash },
                    headers: { 'ngrok-skip-browser-warning': 'true','X-Frame-Options': 'ALLOW-FROM' }
                });
                return response.data;
            } catch (error) {
                this.setErrorState(true);
            } finally {
                this.loading = false;
            }
        },
        async fetchImagesByProductIds(storeHash: string, productIds: string) {
            const response = await axios.get(`https://da38-103-61-252-156.ngrok-free.app/products/images`, {
                params: {storeHash, productIds},
                headers: { 'ngrok-skip-browser-warning': 'true','X-Frame-Options': 'ALLOW-FROM' }
            });

            return response.data;
        }


    }
})

