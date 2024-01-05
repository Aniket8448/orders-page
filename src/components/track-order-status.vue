<template>
  <section TrackOrder class="m-8 md:m-0" v-if="!hasQuery && !store.$state.error">
    <div class="max-w-lg mx-auto shadow-md p-8 mb-8 md:w-1/4 w-4/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <h2 class="text-3xl text-center">Track Order</h2>
      <form class="my-8" @submit.prevent="trackOrder">
        <div>
          <label for="ordernumber" class="block text-sm font-medium leading-6 text-gray-900">Order No.</label>
          <div class="mt-2">
            <input
                type="text"
                name="ordernumber"
                id="ordernumber"
                class="p-4 block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="343453432"
                v-model="orderNumber" required/>
          </div>
        </div>
        <div class="mt-4">
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email</label>
          <div class="mt-2">
            <input type="email" name="email" id="email"
                   class="p-4 block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                   placeholder="you@example.com" v-model="email" required/>
          </div>
        </div>
        <input type="submit"
               class="cursor-pointer mt-8 rounded-md bg-indigo-600 px-3.5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
               value="Track Order"/>
      </form>
      <p v-if="store.wrongCreds" class="text-center text-red-500">Invalid details provided.</p>
    </div>
  </section>

  <div class="mt-16 pt-8">
    <div v-if="trackingData?.transitStatus === 'NO_RECORD' || trackingData?.transitStatus === 'INIT' || store.$state.error"
         class="container max-w-6xl m-auto my-20 px-5 lg:px-0 flex justify-center items-center h-[61vh]">
      <div class="text-base font-semibold leading-6 text-gray-900" >
        No Result Found
      </div>
    </div>
    <div class="container max-w-6xl m-auto my-20 px-5 lg:px-0" v-if="trackingDetails && hasQuery">
      <div class="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 lg:gap-y-0">
        <!-- Grid One  -->
        <div class="overflow-hidden bg-white rounded-lg shadow">
          <div class="border-b border-gray-200 bg-white px-4 py-5 px-6">
            <h3 class="text-base font-semibold leading-6 text-gray-900">Estimated Delivery</h3>
          </div>
          <ul>
            <li class="text-indigo-600 text-4xl border-b border-gray-200 p-10 px-6">{{
                AppHelper.formatDate(trackingData?.deliveredTime)
              }}
            </li>
            <li class="border-b border-gray-200 p-6 px-6">
              <div class="pb-6">
                <span>Current Location: </span>
                <span class="text-gray-600" v-if="trackingData?.transitStatus === 'DELIVERED'"> {{
                    trackingDetails[0].address
                  }},{{ trackingData?.shipTo }} </span>
                <span class="text-gray-600" v-else> {{ trackingData?.shipFrom ?? trackingDetails[0]?.address }} </span>
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
                       src="https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/125_Fedex_logo_logos-512.png"/>
                  #{{ trackingData?.trackNo }}
                </p>
              </div>
            </li>
            <li class="p-6 px-6">
              <div class="flex flex-col gap-6">
                <div class="flex flex-row  justify-between items-center">
                  <a class="text-indigo-600" :href="'tel:' + contactInfo?.phone">{{contactInfo?.phone}}</a>
                  <a href="#">
                    <PhoneIcon
                        class="h-4 w-4 outline outline-1 outline-gray-300 outline-offset-4 rounded-full text-indigo-600"
                        aria-hidden="true"/>
                  </a>
                </div>
                <div class="flex flex-row justify-between items-center">
                  <a class="text-indigo-600" :href="'mailto:' + contactInfo?.email">{{contactInfo?.email}}</a>
                  <a href="#">
                    <EnvelopeIcon
                        class="h-4 w-4 outline outline-1 outline-gray-300 outline-offset-4 rounded-full text-indigo-600"
                        aria-hidden="true"/>
                  </a>
                </div>
                <div class="flex flex-row justify-between items-center">
                  <a class="text-indigo-600" :href=contactInfo?.policy target="_blank">Return Policy</a>
                  <a href="#">
                    <ReceiptRefundIcon
                        class="h-4 w-4 outline outline-1 outline-gray-300 outline-offset-4 rounded-full text-indigo-600"
                        aria-hidden="true"/>
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

          <div>
            <div v-if="trackingDetails && trackingDetails.length > 0" class="h-[610px] overflow-auto">
              <!-- Existing loop over trackingDetails -->
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
        <!-- Grid Three  -->
        <div class="overflow-hidden bg-white rounded-lg shadow">
          <div class="border-b border-gray-200 bg-white px-4 py-5 px-6">
            <h3 class="text-base font-semibold leading-6 text-gray-900 text-uppercase">Recommended</h3>
          </div>
          <ul>
            <li>
              <div class="mt-6  grid grid-rows-1 px-6">
                <div v-for="product in upsellingProducts" :key="product.id"
                     class="group relative grid grid-cols-3 pb-6 gap-x-10">
                  <div
                      class="w-24 overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-20 xl:h-24">
                    <img :src="product.image"
                         class="h-full w-full object-cover object-center"/>
                  </div>
                  <div class="col-span-2">
                    <h3 class="text-sm text-gray-700">
                      <span class="absolute inset-0"/>
                      {{ product.name }}
                    </h3>
                    <p class="mt-1 text-sm font-medium text-gray-900">{{contactInfo?.currency}} {{ product.price }}</p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="text-sm text-gray-600 mt-4">
        <a
        >Powered By
          <img
              src="../assets/full-logo-track-order.png"
              alt="logo"
              class="ml-2 h-6 inline"
          /></a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {PhoneIcon} from "@heroicons/vue/20/solid";
import {EnvelopeIcon, ReceiptRefundIcon} from "@heroicons/vue/24/outline";
import {useTrackingStore} from '../store/tracking';
import {computed, onMounted, ref} from 'vue';
import {AppHelper} from '../Helper';
const isOrderTracked = ref(false);
const store = useTrackingStore();
const orderNumber = ref('');
const email = ref('');
const params = new URLSearchParams(document.location.search);

const trackOrder = async () => {
  await store.fetchTrackingData(orderNumber.value, email.value,params.get('hash') ?? '6pkpnzjnue');
  if (store.trackingData.length > 0) {
    isOrderTracked.value = true; // Set to true when data is fetched
    const trackingId = store.trackingData[0].trackingDetails.id;
    window.location.href = `${window.location.origin}${window.location.pathname}?track=${trackingId}`;
  }
}

const getQueryParam = (param: any) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

onMounted(() => {
  const trackingId = getQueryParam('track');
  if (trackingId) {
    store.fetchTrackingDataByID(trackingId,params.get('hash') ?? "6pkpnzjnue");
  }
});

const hasQuery = computed(() => {
  return !!getQueryParam('track');
});

const trackingData = computed(() => {
  return store.trackingData.length > 0 ? store.trackingData[0].trackingDetails : null;
});

const trackingDetails = computed(() => {
  return trackingData.value ? trackingData.value.localLogisticsInfo.trackingDetails : [];
})

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