<template>
  <!-- Section 1 -->
    <!-- Section 1: Order Tracking Form -->
    <div v-if="!id">
      <section class="track-order m-8 md:m-0">
        <div class="max-w-lg mx-auto shadow-md p-8 mb-2 mt-6">
          <h2 class="text-3xl text-center" id="to-head">Track Order</h2>
          <form class="mt-8" @submit.prevent="trackOrder" id="to-button-text">
            <div if="to-order">
              <label for="ordernumber" class="block text-sm font-medium leading-6 text-gray-900">Order No.</label>
              <div class="mt-2">
                <input type="text" name="ordernumber" id="ordernumber" v-model="orderNumber"
                       class="p-4 block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                       placeholder="343453432" required/>
              </div>
            </div>
            <div v-if="emailValidationStatus" class="mt-4" id="to-email">
              <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email</label>
              <div class="mt-2">
                <input type="email" name="email" id="email" v-model="email"
                       class="p-4 block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                       placeholder="you@example.com" required/>
              </div>
            </div>
            <input type="submit" value="Track Order"
                   id="to-button"
                   class="cursor-pointer w-full mt-8 rounded-md bg-indigo-600 px-3.5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"/>
          </form>
          <p v-if="errorMessage" class="mt-4 text-center text-red-500">{{ errorMessage }}</p>
          <p v-if="store.wrongCreds" class="text-center text-red-500">Invalid details provided.</p>
        </div>
      </section>
    </div>
    <!-- Section 2 -->
    <div v-if="id">
      <track-order-status
          :fulfillments="trackingData"
          :storeHash="storeHash"
          :isLoading="isDataLoading"></track-order-status>
    </div>
</template>

<script setup lang="ts">
import TrackOrderStatus from "./components/track-order-status.vue";
import {ref, computed, onMounted} from "vue";
import {useTrackingStore} from './store/tracking';
import {ITrackingData} from "@/Dto";


const orderNumber = ref("");
const email = ref("");
const store = useTrackingStore();

const trackingData = ref<ITrackingData[]>([] as unknown as ITrackingData[]);
const isDataLoading = ref(false);

const id = ref("");
const customCss = ref("");
const storeHash = ref("");
const isError = computed(() => errorMessage.value !== "");
const errorMessage = ref("");

const errorOrderNo = ref("");
const errorEmail = ref("");
const isConfigLoading = ref(false);
const emailValidationStatus = ref(true);

onMounted(async () => {
  const params = new URLSearchParams(document.location.search);

  id.value = params.get("id") as string;
  storeHash.value = params.get("hash") as string;

  // Decode the customCss parameter to handle any special characters
  const customCssRaw = params.get("customCss");
  customCss.value = customCssRaw ? decodeURIComponent(customCssRaw) : "";
  console.log("custom css value",customCss.value)
  console.log("params",params)
  if (customCss.value) {
    const styleEl = document.createElement('style');
    styleEl.type = 'text/css';
    styleEl.appendChild(document.createTextNode(customCss.value));
    document.head.appendChild(styleEl);
  }

  if (id.value) {
    await getTrackingData(id.value);
  } else if (storeHash.value) {
    const emailStatus = await store.fetchEmailValidationStatus(storeHash.value);
    emailValidationStatus.value = emailStatus.emailValidationStatus;
  }

  setupMutationObserver();
});



// Example function to change query parameters
const updateQueryParams = newParams => {
  const params = new URLSearchParams(document.location.search);
  params.set("id", newParams.id);
  document.location.search = "?" + params.toString();
};

// Updated trackOrder function with improved handling
const trackOrder = async () => {
  if (!validate()) return;
  isDataLoading.value = true;

  try {
    let res;
    if (emailValidationStatus.value) {
      res = await store.fetchTrackingData(orderNumber.value, storeHash.value, email.value);
    } else {
      res = await store.fetchTrackingData(orderNumber.value, storeHash.value);
    }

    if (res && res.length > 0) {
      trackingData.value = res;
      if (res[0]?.orderId) {
        updateQueryParams({id: res[0].orderId}); // Ensure the ID is valid if transitStatus is not NO_RECORD
        id.value = res[0].orderId; // Update the component state if transitStatus is not NO_RECORD
        errorMessage.value = "";
      }
      // } else if (res[0]?.trackingDetails?.transitStatus === "NO_RECORD") {
      //   // Handle NO_RECORD status without changing the URL
      //   console.log("errorMessage",store.$state.error)
      //   errorMessage.value = "Tracking details not found";
      // } else if (res[0]?.trackingDetails?.transitStatus === "INIT") {
      //   // Handle NO_RECORD status without changing the URL
      //   console.log("errorMessage",store.$state.error)
      //   errorMessage.value = "Tracking details not found";
      // }
    }
  } catch (e) {
    errorMessage.value = e?.message || "Error in fetching data.";
  } finally {
    isDataLoading.value = false;
  }
};


const getTrackingData = async (uid: string) => {
  isDataLoading.value = true;
  try {
    const res = await store.fetchTrackingDataByID(uid, storeHash.value);
    trackingData.value = res.filter(x => x?.trackingDetails?.id);
  } catch (e) {
    errorMessage.value = e?.response?.data?.message || "Error in fetching data.";
  } finally {
    isDataLoading.value = false;
  }
};

const validate = (): boolean => {
  errorOrderNo.value = "";
  // errorEmail.value = "";

  if (!orderNumber.value) errorOrderNo.value = "orderNumberRequired";

  // if (!email.value && emailValidationStatus) errorEmail.value = "emailRequired";

  return true;
};

const setupMutationObserver = () => {
  const observer = new MutationObserver(mutations => {
    window.parent.postMessage(
        {
          iframeHeight: document.documentElement.scrollHeight,
        },
        "*"
    );
  });

  observer.observe(document.body, {
    attributes: true,
    childList: true,
    subtree: true,
    characterData: true,
  });
};

import {computed, onMounted, ref} from 'vue';

onMounted(() => {
  setupMutationObserver();
})

</script>

<style scoped>

</style>