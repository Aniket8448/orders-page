<template>
  <div
      v-if="isLoading"
      class="container max-w-6xl m-auto px-5 lg:px-0">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 lg:gap-y-0">
      <!-- Grid One  -->
      <div class="overflow-hidden bg-white rounded-lg shadow">
        <div class="border-b border-gray-200 bg-white px-4 py-5 px-6">
          <h3 class="text-base font-semibold leading-6 text-gray-900">Estimated Delivery</h3>
        </div>
        <ul>
          <li class="text-indigo-600 text-4xl border-b border-gray-200 p-10 px-6">
            <AppSkeleton></AppSkeleton>
          </li>
          <li class="border-b border-gray-200 p-6 px-6">
            <div class="pb-6">
              <p>Current Location</p>
              <AppSkeleton class="mt-2"></AppSkeleton>
            </div>
            <div>
              <p>Destination</p>
              <AppSkeleton class="mt-2"></AppSkeleton>
            </div>
          </li>
          <li class="border-b border-gray-200 p-6 px-6">
            <div>
              <p>Tracking Number</p>
              <p class="text-indigo-600">
                <AppSkeleton class="mt-2"></AppSkeleton>
              </p>
            </div>
          </li>
          <li class="p-6 px-6">
            <div class="flex flex-col gap-6">
              <div class="flex flex-row justify-between items-center">
                <AppSkeleton></AppSkeleton>
                <a href="#">
                  <PhoneIcon
                      class="h-4 w-4 outline outline-1 outline-gray-300 outline-offset-4 rounded-full text-indigo-600"
                      aria-hidden="true" />
                </a>
              </div>
              <div class="flex flex-row justify-between items-center">
                <AppSkeleton></AppSkeleton>
                <a href="#">
                  <EnvelopeIcon
                      class="h-4 w-4 outline outline-1 outline-gray-300 outline-offset-4 rounded-full text-indigo-600"
                      aria-hidden="true" />
                </a>
              </div>
              <div class="flex flex-row justify-between items-center">
                <AppSkeleton></AppSkeleton>
                <a href="#">
                  <ReceiptRefundIcon
                      class="h-4 w-4 outline outline-1 outline-gray-300 outline-offset-4 rounded-full text-indigo-600"
                      aria-hidden="true" />
                </a>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <!-- Grid Two  -->
      <div class="overflow-hidden bg-white rounded-lg shadow">
        <div class="border-b border-gray-200 bg-white px-4 py-5 px-6">
          <h3 class="text-base font-semibold leading-6 text-gray-900">Shipment Progress</h3>
        </div>

        <div
            class="px-6 mt-6"
            v-for="i in 3"
            :key="i">
          <AppSkeleton class="h-8"></AppSkeleton>
        </div>
      </div>
      <!-- Grid Three  -->
      <div class="overflow-hidden bg-white rounded-lg shadow">
        <div class="border-b border-gray-200 bg-white px-4 py-5 px-6">
          <h3 class="text-base font-semibold leading-6 text-gray-900 text-uppercase">
            Recommended
          </h3>
        </div>
        <ul>
          <li>
            <div
                class="px-6 mt-6"
                v-for="i in 3"
                :key="i">
              <AppSkeleton class="h-8"></AppSkeleton>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="text-sm text-gray-600 mt-4">
      <a :href="``"
      >Powered by
        <img
            src="/img/full-logo-track-order.png"
            alt="logo"
            class="ml-2 h-6 inline"
        /></a>
    </div>
  </div>

  <div class="mt-16 pt-8" v-else>
    <div v-if="trackingData?.transitStatus === 'NO_RECORD' || trackingData?.transitStatus === 'INIT' || store.$state.error"
         class="container max-w-6xl m-auto my-20 px-5 lg:px-0 flex justify-center items-center h-[61vh]">
      <div class="text-center text-red-500">
        Tracking Details Not Found
      </div>
    </div>

    <div
        class="container max-w-6xl m-auto" v-if="!selectedFulfillment">
      <div class="bg-white px-6 py-6 shadow sm:rounded-lg sm:px-6 mb-4">
        <div
            v-for="fulfillment in fulfillments as ITrackingData[]"
            :key="fulfillment?.trackingDetails?.id"
            class="border-b last:border-none py-2 last:pb-0 first:pt-0">
          <div class="grid grid-cols-12">
            <div class="col-span-2">
              <div
                  class="mx-2"
                  v-if="isImageLoading">
                <div class="bg-gray-200 animate-pulse h-[100px] my-auto"></div>
              </div>
              <div v-else>
                <img
                    :src="fulfillment.bannerImgUrl"
                    alt="fulfillment image"
                    class="h-[100px]" />
              </div>
            </div>
            <div class="col-span-3">
              <AppBadge :variant="fulfillment?.trackingDetails?.transitStatus === 'DELIVERED' ? 'success' : 'warning'">
                <p class="">
                  {{
                    fulfillment?.trackingDetails?.transitStatus === "NO_RECORD"
                        ? "NOT AVAILABLE"
                        : fulfillment?.trackingDetails?.transitStatus === "DELIVERED"
                            ? "DELIVERED"
                            : fulfillment?.trackingDetails?.transitStatus
                  }}
                </p>
              </AppBadge>

              <p class="text-indigo-600 text-2xl border-gray-200">
                {{
                  fulfillment?.trackingDetails?.deliveredTime
                      ? AppHelper.formatDate(new Date(fulfillment?.trackingDetails?.deliveredTime).toISOString())
                      : fulfillment?.trackingDetails?.expectedDelivery
                          ? AppHelper.formatDate(new Date(fulfillment?.trackingDetails?.expectedDelivery).toISOString())
                          : "NOETA"
                }}
              </p>
              <p class="text-sm">{{ fulfillment?.trackingDetails?.courierName }}&nbsp; #{{ fulfillment?.trackingDetails?.trackNo }}</p>
            </div>
            <div class="col-span-5">
              <p class="text-xs text-gray-700 pt-1 mb-1">Delivering to</p>
              <p class="text-sm">
                {{
                  fulfillment.shippingAddress?.first_name && fulfillment.shippingAddress?.last_name
                      ? `${fulfillment.shippingAddress?.first_name} ${fulfillment.shippingAddress?.last_name}`
                      : ""
                }}
              </p>
              <p class="text-sm">
                {{ fulfillment.shippingAddress?.city ? `\n${fulfillment.shippingAddress.city},` : "" }}
                {{ fulfillment.shippingAddress?.country ? `\n${fulfillment.shippingAddress.country}` : "" }}
              </p>
            </div>
            <div class="col-span-2 flex">
              <div class="my-auto">
                <button
                    @click="selectFulfillment(fulfillment)"
                    class="cursor-pointer mx-auto rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  Track
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container max-w-6xl m-auto my-20 px-5 lg:px-0" v-if="selectedFulfillment">
      <div
          @click="selectedFulfillment = null"
          v-if="fulfillments?.length > 1"
          class="inline-block my-auto hover:cursor-pointer text-indigo-600 mb-4">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            height="16"
            width="16"
            class="fill-indigo-600 my-auto mr-2 inline"
            viewBox="0 0 512 512">
          <path
              d="M7 239c-9.4 9.4-9.4 24.6 0 33.9L143 409c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-95-95L488 280c13.3 0 24-10.7 24-24s-10.7-24-24-24L81.9 232l95-95c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0L7 239z" />
        </svg>
        <p class="inline">Back</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 lg:gap-y-0">
        <!-- Grid One -->
        <div class="overflow-hidden bg-white rounded-lg shadow">
          <div class="border-b border-gray-200 bg-white px-4 py-5 px-6">
            <h3 class="text-base font-semibold leading-6 text-gray-900">Estimated Delivery</h3>
          </div>
          <ul>
            <li class="text-indigo-600 text-4xl border-b border-gray-200 p-10 px-6">
              {{ AppHelper.formatDate(trackingData?.deliveredTime) }}
            </li>
            <li class="border-b border-gray-200 p-6 px-6">
              <div class="pb-6">
                <span>Current Location: </span>
                <span class="text-gray-600" v-if="trackingData?.transitStatus === 'DELIVERED'">
                  {{ trackingDetails[0].address }}, {{ trackingData?.shipTo }}
                </span>
                <span class="text-gray-600" v-else>
                  {{ trackingData?.shipFrom ?? trackingDetails[0]?.address }}
                </span>
              </div>
              <div>
                <span>Destination: </span>
                <span class="text-gray-600">{{ trackingData?.shipTo }}</span>
              </div>
            </li>
            <li class="border-b border-gray-200 p-6 px-6">
              <div>
                <p>Tracking Number:</p>
                <p class="text-indigo-600">
                  <img class="h-10 inline"
                       src="https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/125_Fedex_logo_logos-512.png" />
                  #{{ trackingData?.trackNo }}
                </p>
              </div>
            </li>
            <li class="p-6 px-6">
              <div class="flex flex-col gap-6">
                <div class="flex flex-row justify-between items-center">
                  <a class="text-indigo-600" :href="'tel:' + contactInfo?.phone">{{ contactInfo?.phone }}</a>
                  <a href="#">
                    <PhoneIcon
                        class="h-4 w-4 outline outline-1 outline-gray-300 outline-offset-4 rounded-full text-indigo-600"
                        aria-hidden="true" />
                  </a>
                </div>
                <div class="flex flex-row justify-between items-center">
                  <a class="text-indigo-600" :href="'mailto:' + contactInfo?.email">{{ contactInfo?.email }}</a>
                  <a href="#">
                    <EnvelopeIcon
                        class="h-4 w-4 outline outline-1 outline-gray-300 outline-offset-4 rounded-full text-indigo-600"
                        aria-hidden="true" />
                  </a>
                </div>
                <div class="flex flex-row justify-between items-center">
                  <a class="text-indigo-600" :href="contactInfo?.policy" target="_blank">Return Policy</a>
                  <a href="#">
                    <ReceiptRefundIcon
                        class="h-4 w-4 outline outline-1 outline-gray-300 outline-offset-4 rounded-full text-indigo-600"
                        aria-hidden="true" />
                  </a>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <!-- Grid Two -->
        <div class="overflow-hidden bg-white rounded-lg shadow">
          <div class="border-b border-gray-200 bg-white px-4 py-5 px-6">
            <h3 class="text-base font-semibold leading-6 text-gray-900">Shipment Progress</h3>
          </div>
          <div>
            <div v-if="trackingDetails && trackingDetails.length > 0" class="h-[610px] overflow-auto">
              <div v-for="(detail, index) in trackingDetails" :key="index"
                   class="pb-6 relative leading-7 flex gap-4 border-b border-gray-200 p-6 px-6 max-h-[80vh] overflow-auto">
                <div :class="[
                  'dot mt-[10px]',
                  isDelivered ? 'outline outline-4 outline-green-200 bg-green-600' :
                  (trackingData?.lastTrackingTime === detail.eventTime) ? 'outline outline-4 outline-indigo-200 bg-indigo-600' :
                  'bg-gray-400'
                ]"></div>
                <div>
                  <p class="font-medium">{{ detail?.eventTime }}</p>
                  <p class="text-gray-600 font-light text-sm">{{ detail?.eventDetail }}</p>
                  <p class="text-gray-600 font-light text-sm">{{ detail?.address }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Grid Three -->
        <div class="overflow-hidden bg-white rounded-lg shadow">
          <div class="border-b border-gray-200 bg-white px-4 py-5 px-6">
            <h3 class="text-base font-semibold leading-6 text-gray-900 text-uppercase">Recommended</h3>
          </div>
          <ul>
            <li>
              <div class="mt-6 grid grid-rows-1 px-6">
                <div v-for="product in upsellingProducts" :key="product.id"
                     class="group relative grid grid-cols-3 pb-6 gap-x-10">
                  <div class="w-24 overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-20 xl:h-24">
                    <img :src="product.image"
                         class="h-full w-full object-cover object-center" />
                  </div>
                  <div class="col-span-2">
                    <h3 class="text-sm text-gray-700">
                      <span class="absolute inset-0"></span>
                      {{ product.name }}
                    </h3>
                    <p class="mt-1 text-sm font-medium text-gray-900">{{ contactInfo?.currency }} {{ product.price }}</p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="text-sm text-gray-600 mt-4">
        <a>Powered By
          <img src="../assets/full-logo-track-order.png" alt="logo" class="ml-2 h-6 inline" />
        </a>
      </div>
    </div>

    <div v-if="store.loading && hasQuery" class="container max-w-6xl m-auto my-20 px-5 lg:px-0 flex justify-center items-center h-[61vh]">
      <div class="text-center">
        <p class="text-base font-semibold leading-6 text-gray-900">Loading...</p>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import {PhoneIcon} from "@heroicons/vue/20/solid";
import {EnvelopeIcon, ReceiptRefundIcon} from "@heroicons/vue/24/outline";
import {useTrackingStore} from '../store/tracking';
import {computed, onMounted, ref, watch} from 'vue';
import {AppHelper} from '../Helper';
import {ITrackingData} from "@/Dto";
const isOrderTracked = ref(false);
const store = useTrackingStore();
const orderNumber = ref('');
const isImageLoading = ref(true);
const trackingFulfilmentData = ref (null);

const email = ref('');
const params = new URLSearchParams(document.location.search);
const emailValidationStatus = ref<boolean>(false);
const selectedFulfillment = ref(null);
// let trackingData = ref(null);

const props = withDefaults(
    defineProps<{
      fulfillments: any;
      storeHash: string;
      isLoading: boolean;
    }>(),
    {
      fulfillments: [],
      storeHash: "",
      isLoading: false,
    }
);

const getQueryParam = (param: any) => {
  const urlParams = new URLSearchParams(window.location.search);
  console.log("Params",urlParams.get(param));
  return urlParams.get(param);
}

onMounted(async () => {
  console.log("Selected-fulfilment", selectedFulfillment.value);
});


const fetchImageUrls = async () => {
  isImageLoading.value = true;

  const productIds: string[] = store?.trackingData
      .filter(f => f.items && f.items.length > 0)
      .map(f => f.items[0].product_id);

  try {
    const res = await store.fetchImagesByProductIds(params.get('hash') ?? 'a1ty1hczd3', productIds.join(','));
    console.log("Image-urls-response", res);

    store.trackingData.forEach(fulfillment => {
      const firstProductId = fulfillment.items[0].product_id;
      console.log("Product-id", firstProductId);
      const productImage = (res.filter(x => x.id ==firstProductId))[0]?.imageUrl;
      if (productImage) {
        fulfillment.bannerImgUrl = productImage;
      }
    });
  } catch (e) {
  } finally {
    isImageLoading.value = false;
  }
};

const hasQuery = computed(() => {
  return !!getQueryParam('orderId');
});


watch(
    [() => props.isLoading, () => props.fulfillments],
    ([isLoading, fulfillments]) => {
      if (!isLoading && fulfillments.length > 0) {
        if (fulfillments.length === 1) {
          selectedFulfillment.value = fulfillments[0].trackingDetails;
        }
        fetchImageUrls();
      }
    },
    { immediate: true }
);

let trackingData = computed(() => {
  return selectedFulfillment.value;
});

let trackingDetails = computed(() => {
  console.log("selected-fulfilment", selectedFulfillment.value);
  return selectedFulfillment.value ? selectedFulfillment.value.localLogisticsInfo.trackingDetails : [];
})

const selectFulfillment = (fulfilment) => {
  console.log("Fulfilment", fulfilment);
  selectedFulfillment.value = fulfilment?.trackingDetails;
}

const isDelivered = computed(() => {
  return store.trackingData[0].trackingDetails.transitStatus === 'DELIVERED';
})

const upsellingProducts = computed(() => {
  return store.trackingData.length > 0 ? store.trackingData[0].upsellingProducts : [];
})

const contactInfo = computed(() => {
  return store.trackingData.length > 0 ? store.trackingData[0].info : null
})
</script>

<style scoped>

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
</style>