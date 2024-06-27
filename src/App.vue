<template>
<!--  <track-order-status></track-order-status>-->
  <!-- Section 1 -->
  <div v-if="!id">
    <section
        TrackOrder
        class="m-8 md:m-0">
      <div class="max-w-lg mx-auto shadow-md p-8 mb-2 mt-6">
        <h2 class="text-3xl text-center">Track Order</h2>
        <form
            class="mt-8"
            @submit.prevent="trackOrder">
          <div>
            <label
                for="ordernumber"
                class="block text-sm font-medium leading-6 text-gray-900"
            >Order No.
            </label>
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
          <div
              v-if="emailValidationStatus"
              class="mt-4">
            <label
                for="email"
                class="block text-sm font-medium leading-6 text-gray-900"
            >Email
            </label>
            <div class="mt-2">
              <input
                  type="email"
                  name="email"
                  id="email"
                  class="p-4 block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="you@example.com"
                  v-model="email" required/>
            </div>
          </div>
          <input
              type="submit"
              class="cursor-pointer mt-8 rounded-md bg-indigo-600 px-3.5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              value="Track Order" />
        </form>
      </div>
      <div class="max-w-lg mx-auto text-sm text-gray-600">
        <a
            target="_blank"
            href=""
        >Powered by
          <img
              src="/img/full-logo-track-order.png"
              alt="logo"
              class="ml-2 h-6 inline"
          /></a>
      </div>
    </section>
  </div>

<!--  <div-->
<!--      v-if="isError"-->
<!--      class="mx-auto p-8 mb-4">-->
<!--    <AppAlert-->
<!--        v-if="isError"-->
<!--        :variant="'danger'"-->
<!--        :title="errorMessage"></AppAlert>-->
<!--  </div>-->
  <p v-if="store.wrongCreds" class="text-center text-red-500">Invalid details provided.</p>

  <!-- Section 2 -->
  <track-order-status
      v-if="id"
      :fulfillments="trackingData"
      :storeHash="storeHash"
      :isLoading="isDataLoading"></track-order-status>
</template>

<script setup lang="ts">
import TrackOrderStatus from "./components/track-order-status.vue";
import { ref, computed, onMounted } from "vue";
import {useTrackingStore} from './store/tracking';
import {ITrackingData} from "@/Dto";


const orderNumber = ref("");
const email = ref("");
// const helper = new AppHelper();
const store = useTrackingStore();

const trackingData = ref<ITrackingData[]>([] as unknown as ITrackingData[]);
const isDataLoading = ref(false);

const id = ref("");
const storeHash = ref("");
const isError = computed(() => errorMessage.value !== "");
const errorMessage = ref("");
const css = ref("");

const errorOrderNo = ref("");
const errorEmail = ref("");
const isConfigLoading = ref(false);
const emailValidationStatus = ref(true);

onMounted(async () => {
  const params = new URLSearchParams(document.location.search);

  id.value = params.get("id") as string;
  storeHash.value = (params.get("hash") || "a1ty1hczd3") as string;

  css.value = params.get("customCss") as string;
  console.log("css value", css.value);
  if (css.value) {
    const styleEl = document.createElement('style');
    document.head.appendChild(styleEl);
    styleEl.appendChild(document.createTextNode(css.value));
  }

  if (id.value) {
    getTrackingData(id.value);
  } else if (storeHash.value) {
    const emailStatus: {emailValidationStatus: boolean} = await store.fetchEmailValidationStatus(params.get('hash') ?? 'a1ty1hczd3');
    emailValidationStatus.value = emailStatus.emailValidationStatus;
    console.log("Email-Validation-Status", emailValidationStatus.value);
  }

  setupMutationObserver();
});

// Example function to change query parameters
const updateQueryParams = newParams => {
  const params = new URLSearchParams(document.location.search);
  params.set("id", newParams.id);
  document.location.search = "?" + params.toString();
};

const trackOrder = async () => {
  console.log("Hello!!");
  if (!validate()) return;
  isDataLoading.value = true;
  console.log("Hello  track-order");
  let res;
  try {
    if (emailValidationStatus) {
      res = await store.fetchTrackingData(orderNumber.value, storeHash.value, email.value);
    } else {
      res = await store.fetchTrackingData(orderNumber.value, storeHash.value);
    }
    console.log("respose",res);

    trackingData.value = res;
    updateQueryParams({ id: trackingData.value[0]?.orderId});
    errorMessage.value = "";
  } catch (e) {
    errorMessage.value = e?.response?.data?.message || "Error in fetching data.";
  } finally {
    isDataLoading.value = false;
  }
};

const getTrackingData = async (uid: string) => {
  isDataLoading.value = true;
  try {
    const res = await store.fetchTrackingDataByID(uid, storeHash.value);
    trackingData.value = res;
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

</script>

<style scoped>

</style>
