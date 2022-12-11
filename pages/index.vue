<template>
  <main class="homepage flex flex-col justify-center items-center">
    <h1 class="text-3xl">
      SIFT (Scale-invariant feature transform)
    </h1>

    <form enctype="multipart/form-data" method="post" name="fileinfo" class="mt-3 w-6/12" @submit.prevent="sendForm">
      <p class="my-3">
        <label>Select your image:
          <input id="fileInput" type="file" name="file" required>
          <!-- <input id="fileInput" type="file" name="file"> -->
        </label>
      </p>

      <p class="my-3">
        <label>Number of pictures to return:
          <input
            v-model="knn"
            type="number"
            name="knn"
            min="0"
            required
            class="border-2 p-1"
          >
        </label>
      </p>

      <p class="my-3">
        <label>Maximum number of best features to retain (0 means Unlimited):
          <input
            v-model="maxDescritptors"
            min="0"
            type="number"
            name="knn"
            required
            class="border-2 p-1"
          >
        </label>
      </p>

      <p class="my-3">
        <label>Lowest number of matching features:
          <input
            v-model="matches"
            type="number"
            name="matches"
            min="1"
            required
            class="border-2 p-1"
          >
        </label>
      </p>

      <p class="my-3">
        <label>Lowe's Ratio test constant:
          <input
            v-model="ratio"
            type="number"
            step="0.01"
            name="ratio"
            required
            min="0.01"
            max="0.99"
            class="border-2 p-1"
          >
        </label>
      </p>

      <p class="my-3">
        <label>Show image comparisons:
          <input
            v-model="showComparisons"
            type="checkbox"
            name="ratio"
            class="border-2 p-1"
          ></label>
      </p>

      <div class="my-3 flex justify-between">
        <input :disabled="loading" type="submit" value="Find" class="border-2 py-1 px-5 rounded-full bg-blue-200">
        <div>
          <span>{{ timeStr }}</span>
        </div>
      </div>
    </form>

    <div v-if="loading" class="lds-spinner">
      <div /><div /><div /><div /><div /><div /><div /><div /><div /><div /><div /><div />
    </div>

    <div v-if="(data && !loading)" class="flex flex-row flex-wrap m-4">
      <div class="border-2 mr-2">
        <span>Input image</span>
        <img class="block w-12/12 max-w-sm object-cover" :src="('http://127.0.0.1:8000/testImg/' + testImg)" alt="">
      </div>
      <div v-for="(img, i) in data" :key="i">
        <span>{{ img[0] }} - {{ img[1] }} matches</span>
        <img class="block w-12/12 max-w-sm object-cover" :src="('http://127.0.0.1:8000/img/' + img[0])" alt="">
      </div>
    </div>

    <div v-if="(data && !loading && showComparisons)" class="flex flex-col">
      <h2 class="text-2xl m-5">
        Comparisons:
      </h2>
      <div v-for="i in fileCnt" :key="i">
        <img class="block w-12/12 max-w-xl object-cover" :src="('http://127.0.0.1:8000/results/a' + (i - 1))" alt="">
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { Ref } from "@vue/reactivity"

const knn = ref(3)
const matches = ref(10)
const ratio = ref(0.7)
const maxDescritptors = ref(0)
const loading = ref(false)
const showComparisons = ref(false)
const data = ref(null)
const testImg = ref("")
const fileCnt = ref(0)

const timer: Ref<NodeJS.Timer | null> = ref(null)
const milliseconds = ref(0)
const timeStr = ref("")
const seconds = ref(0)
const minutes = ref(0)

function stopTimer () {
  if (timer.value) {
    clearInterval(timer.value)
  }
}
function startTimer () {
  if (timer.value) {
    clearInterval(timer.value)
    milliseconds.value = 0
    seconds.value = 0
    minutes.value = 0
  }
  timer.value = setInterval(displayTimer, 10)
}

function displayTimer () {
  milliseconds.value += 10
  if (milliseconds.value === 1000) {
    milliseconds.value = 0
    seconds.value++
    if (seconds.value === 60) {
      seconds.value = 0
      minutes.value++
    }
  }

  const m = minutes.value < 10 ? "0" + minutes.value : minutes.value
  const s = seconds.value < 10 ? "0" + seconds.value : seconds.value
  const ms = milliseconds.value < 10 ? "00" + milliseconds.value : milliseconds.value < 100 ? "0" + milliseconds.value : milliseconds.value

  timeStr.value = `${m > 0 ? m + " : " : ""} ${s} : ${ms}`
}

async function sendForm () {
  startTimer()
  loading.value = true
  const formData = new FormData(document.forms.namedItem("fileinfo") as HTMLFormElement)
  const res = await fetch(`http://127.0.0.1:8000/uploadfile/?ratio=${ratio.value}&maxDescritptors=${maxDescritptors.value}`, {
    method: "POST", body: formData
  })

  const fileInput = document.getElementById("fileInput") as HTMLInputElement
  if (fileInput.files) {
    const fileName = fileInput.files[0].name
    testImg.value = fileName.split(".")[0]
  }

  const response = await res.json()
  fileCnt.value = response.data.length
  data.value = response.data.reverse().slice(0, knn.value).filter(res => +res[1] >= matches.value)
  stopTimer()
  loading.value = false
}

</script>

<style scoped>
.lds-spinner {
  color: official;
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-spinner div {
  transform-origin: 40px 40px;
  animation: lds-spinner 1.2s linear infinite;
}
.lds-spinner div:after {
  content: " ";
  display: block;
  position: absolute;
  top: 3px;
  left: 37px;
  width: 6px;
  height: 18px;
  border-radius: 20%;
  background: green;
}
.lds-spinner div:nth-child(1) {
  transform: rotate(0deg);
  animation-delay: -1.1s;
}
.lds-spinner div:nth-child(2) {
  transform: rotate(30deg);
  animation-delay: -1s;
}
.lds-spinner div:nth-child(3) {
  transform: rotate(60deg);
  animation-delay: -0.9s;
}
.lds-spinner div:nth-child(4) {
  transform: rotate(90deg);
  animation-delay: -0.8s;
}
.lds-spinner div:nth-child(5) {
  transform: rotate(120deg);
  animation-delay: -0.7s;
}
.lds-spinner div:nth-child(6) {
  transform: rotate(150deg);
  animation-delay: -0.6s;
}
.lds-spinner div:nth-child(7) {
  transform: rotate(180deg);
  animation-delay: -0.5s;
}
.lds-spinner div:nth-child(8) {
  transform: rotate(210deg);
  animation-delay: -0.4s;
}
.lds-spinner div:nth-child(9) {
  transform: rotate(240deg);
  animation-delay: -0.3s;
}
.lds-spinner div:nth-child(10) {
  transform: rotate(270deg);
  animation-delay: -0.2s;
}
.lds-spinner div:nth-child(11) {
  transform: rotate(300deg);
  animation-delay: -0.1s;
}
.lds-spinner div:nth-child(12) {
  transform: rotate(330deg);
  animation-delay: 0s;
}
@keyframes lds-spinner {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

</style>
