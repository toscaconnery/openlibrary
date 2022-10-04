<template>
    <div class="relative flex items-top justify-center min-h-screen bg-gray-100 sm:items-center sm:pt-0">
        <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
            <div class="mt-8 bg-white overflow-hidden shadow sm:rounded-lg p-6">
                <h2 class="text-2xl leading-7 font-semibold">
                    Welcome to E-library
                </h2>
                <p class="mt-3 mb-3 text-gray-600 ">
                    Due to the nature of the pandemic, you need to make a reservation to borrow the books.
                </p>
                <div class="border-t border-dashed pt-4">
                    <NuxtLink to="/browse" class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                        Browse
                    </NuxtLink>
                    <NuxtLink to="/schedule" class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow ml-2">
                        Schedule
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    methods: {
        goToBrowse() {
            console.log('> going to browse page')
        },
        goToSchedule() {
            console.log('> going to schedule page')
        }
    }
}
</script>