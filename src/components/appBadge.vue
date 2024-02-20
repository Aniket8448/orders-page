<template>
  <span
    class="inline-flex items-center gap-x-1.5 rounded-full font-medium"
    :class="[bgColor(), textColor(), textSize(), getPadding()]">
    <svg
      class="h-1.5 w-1.5"
      :class="[fillColor()]"
      viewBox="0 0 6 6"
      aria-hidden="true">
      <circle
        cx="3"
        cy="3"
        r="3" />
    </svg>
    <slot> Badge </slot>
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: "primary" | "secondary" | "danger" | "success" | "warning";
    size?: "xs" | "sm" | "md" | "lg" | "xl";
  }>(),
  {
    variant: "primary",
    size: "xs",
  }
);

const textColor = () => {
  switch (props.variant) {
    case "primary":
      return "text-indigo-700";
    case "secondary":
      return "text-gray-600";
    case "danger":
      return "text-red-700";
    case "success":
      return "text-green-700";
    case "warning":
      return "text-yellow-800";
  }
};

const bgColor = () => {
  switch (props.variant) {
    case "primary":
      return "bg-indigo-100";
    case "secondary":
      return "bg-gray-100";
    case "danger":
      return "bg-red-100";
    case "success":
      return "bg-green-100";
    case "warning":
      return "bg-yellow-100";
  }
};

const textSize = () => {
  switch (props.size) {
    case "xs":
      return "text-xs";
    case "sm":
      return "text-sm";
    case "md":
      return "text-md";
    case "lg":
      return "text-lg";
    case "xl":
      return "text-xl";
  }
};

const getPadding = () => {
  switch (props.size) {
    case "xs":
      return "px-1.5 py-0.5";
    case "sm":
      return "px-2 py-0.75";
    case "md":
      return "px-2.5 py-0.75";
    case "lg":
      return "px-3 py-0.75";
    case "xl":
      return "px-3 py-1.25";
  }
};

const fillColor = () => {
  switch (props.variant) {
    case "primary":
      return "fill-indigo-500";
    case "secondary":
      return "fill-gray-400";
    case "danger":
      return "fill-red-500";
    case "success":
      return "fill-green-500";
    case "warning":
      return "fill-yellow-500";
  }
};
</script>
