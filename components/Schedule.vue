<template>
    <div class="relative flex items-top justify-center min-h-screen bg-gray-100 sm:items-center sm:pt-0">
        <div class="max-w-4xl cc mx-auto sm:px-6 lg:px-8">
            <div class="mt-8 mb-8 bg-white overflow-hidden shadow sm:rounded-lg p-6">
                <h2 class="text-2xl leading-7 font-semibold">
                    Schedule
                </h2>
                <p class="mt-3 mb-3 text-gray-600">
                    List of pick up schedules, ordered by time.
                </p>
                <div v-if="isEmpty" class="relative flex justify-center">
                    No data
                </div>
                <div>
                    <div v-for="sc in $store.state.schedule">
                        <div class="bg-white shadow mb-2 pt-3 pb-3 pl-3 pr-3 book-card sm:rounded-lg">
                            <div class="book-name">{{sc.book.title}}</div>
                            <div class="info">
                                <span>Author(s) name: </span>
                                <br>
                                <div>{{sc.book.authors}}</div>
                            </div>
                            <div class="info">
                                <span>Edition number: </span>
                                <br>
                                <div>{{sc.book.edition_number}}</div>
                            </div>
                            <div class="info border-t border-dashed pt-2 mt-2">
                                <span>Borrower name: </span>
                                <br>
                                <div>{{sc.borrowerName}}</div>
                            </div>
                            <div class="info">
                                <span>Pick up time: </span>
                                <br>
                                <div>{{formatTime(sc.time)}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="border-t border-dashed pt-4">
                    <NuxtLink to="/" class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                        Back
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data: () => ({
        isEmpty: false
    }),
    methods: {
        formatTime(timestamp) {
            let dateObj = new Date(timestamp);
            let hours = dateObj.getHours();
            let ampm = '';
            if (hours >= 12) {
                ampm = 'PM';
                hours -= 12;
            } else {
                ampm = 'AM';
            }
            let minutes = dateObj.getMinutes();
            return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')} ${ampm}`;
        },
    },
    created() {
        if (this.$store.state.schedule.length == 0) {
            this.isEmpty = true;
        }
    }
}
</script>

<style>
.book-card {
    padding: 30px;
    background-color: orange;
}
.book-name {
    font-weight: bold;
    font-size: 1.5rem;
}
.info {
    display: flex;
    margin-bottom: 6px;
}
.info span {
    color: #606060;
    min-width: 120px;
}
.info div {
    margin-left: 10px;
}
.cc {
    min-width: 70%;
}
</style>