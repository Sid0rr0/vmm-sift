<template>
  <main class="homepage flex flex-col justify-center items-center">
    <h1 class="text-3xl">
      SIFT (Scale-invariant feature transform)
    </h1>

    <form enctype="multipart/form-data" method="post" name="fileinfo" class="mt-3 w-6/12" @submit.prevent="sendForm">
      <p class="my-4">
        <label>Select your image:
          <input id="fileInput" type="file" name="file" required>
        </label>
      </p>

      <p class="my-4">
        <label>Number of pictures to return:
          <input v-model="knn" type="number" name="knn" required class="border-2 p-1">
        </label>
      </p>

      <p class="my-4">
        <label>Lowest number of matches:
          <input v-model="matches" type="number" name="matches" required class="border-2 p-1">
        </label>
      </p>

      <p class="my-4">
        <label>Ratio test:
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

      <p class="my-4">
        <input type="submit" value="Find" class="border-2 py-1 px-5 rounded-full bg-blue-200">
      </p>
    </form>

    <div v-if="loading" class="lds-spinner">
      <div /><div /><div /><div /><div /><div /><div /><div /><div /><div /><div /><div />
    </div>

    <div v-if="(data && !loading)" class="flex flex-row">
      <div class="border-2 mr-2">
        <span>Input image</span>
        <img class="block w-12/12 max-w-sm object-cover" :src="('http://127.0.0.1:8000/testImg/' + testImg)" alt="">
      </div>
      <div v-for="(img, i) in data" :key="i">
        <span>{{ img[0] }} - {{ img[1] }} matches</span>
        <img class="block w-12/12 max-w-sm object-cover" :src="('http://127.0.0.1:8000/img/' + img[0])" alt="">
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
const knn = ref(3)
const matches = ref(5)
const ratio = ref(0.7)
const loading = ref(false)
const data = ref(null)
const testImg = ref(null)

async function sendForm () {
  loading.value = true
  const formData = new FormData(document.forms.namedItem("fileinfo"))
  const res = await fetch(`http://127.0.0.1:8000/uploadfile/?ratio=${ratio.value}&matches=${matches.value}`, {
    method: "POST", body: formData
  })

  const fileInput = document.getElementById("fileInput")
  const fileName = fileInput.files[0].name
  testImg.value = fileName.split(".")[0]

  const response = await res.json()
  data.value = response.data.reverse().slice(0, knn.value)
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
