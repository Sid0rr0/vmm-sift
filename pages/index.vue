<template>
  <main class="homepage m-auto">
    <h1 class="text-3xl">
      SIFT (Scale-invariant feature transform)
    </h1>
    <!-- <input ref="file" enctype="multipart/form-data" type="file" name="file" class="mt-3 border-2">
    <button class="border" @click="getaa">
      fetch img
    </button> -->

    <form enctype="multipart/form-data" method="post" name="fileinfo" class="mt-3" @submit.prevent="sendForm">
      <p class="my-4">
        <label>Select your image:
          <input type="file" name="file" required>
        </label>
      </p>

      <p class="my-4">
        <label>knn:
          <input v-model="knn" type="number" name="knn" required class="border-2 p-1">
        </label>
      </p>

      <p class="my-4">
        <input type="submit" value="Find" class="border-2 py-1 px-5 rounded-full bg-blue-200">
      </p>
    </form>

    <template v-if="data">
      <img v-for="(img, i) in data" :key="i" :src="('http://127.0.0.1:8000/img/' + img[0])" alt="">
    </template>

    {{ data }}
  </main>
</template>

<script setup lang="ts">
const knn = ref(3)
const loading = ref(false)
const data = ref(null)

// async function getaa () {
//   const formData = new FormData()
//   formData.append("file", file.value?.files[0])
//   // console.log(formData, file.value?.files[0])
//   for (const value of formData.entries()) {
//     console.log({ value })
//   }
//   const res = await fetch("http://127.0.0.1:8000/uploadfile/", {
//     method: "POST", /* headers: { "Content-Type": "multipart/form-data" }, */ body: formData
//   })
//   // request.post()
//   // const res = await fetch("http://127.0.0.1:8000/files/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: formData })
//   console.log(res)
//   // return await true
// }

async function sendForm () {
  loading.value = true
  const formData = new FormData(document.forms.namedItem("fileinfo"))
  for (const value of formData.entries()) {
    console.log(value)
  }
  const res = await fetch(`http://127.0.0.1:8000/uploadfile/?knn=${knn.value}`, {
    method: "POST", body: formData
  })

  const response = await res.json()
  data.value = response.data.reverse().slice(0, knn.value)
  loading.value = false
}

</script>

<style scoped lang="scss">
</style>
