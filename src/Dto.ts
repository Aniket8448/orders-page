export interface TrackingState {
    trackingData: any | null;
    error: boolean;
    wrongCreds: boolean;
    loading: boolean;
}
export interface ITrackingData  {
    trackingDetails: {
        id: string;
        deliveredTime: string;
        expectedDelivery: string;
        courierName: string;
        trackNo: string;
        transitStatus: string;
    },
    bannerImageUrl: string;
    upsellingProducts: string[];
    shippingAddress: {
        first_name: string;
        last_name: string;
        country: string;
        city: string;
    },
    items: string[],
    info: {
        email: string;
        phone: string;
        currency: string;
        policy: string;
    }
}