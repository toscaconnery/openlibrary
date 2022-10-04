<template>
    <div class="relative flex items-top justify-center min-h-screen bg-gray-100 sm:items-center sm:pt-0">
        <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
            <div class="mt-8 mb-8 bg-white overflow-hidden shadow sm:rounded-lg p-6">
                <h2 class="text-2xl leading-7 font-semibold">
                    Browse
                </h2>
                <p class="mt-3 mb-3 text-gray-600 ">
                    List of books that are currently available to browse. Some books that doesn't available to browse will not be shown.
                </p>
                <div v-if="isLoading" class="relative flex justify-center loading">
                    Loading...
                </div>
                <div>
                    <div v-for="book in booklist" :key="book.key">
                        <div class="bg-white shadow mb-2 pt-3 pb-3 pl-3 pr-3 book-card sm:rounded-lg" v-if="book.available_to_browse">
                            <div class="book-name">{{book.title}}</div>
                            <div class="info">
                                <span>Author(s) name: </span>
                                <br>
                                <div>{{book.authors}}</div>
                            </div>
                            <div class="info">
                                <span>Edition number: </span>
                                <br>
                                <div>{{book.edition_number}}</div>
                            </div>
                            <button @click="showReservationModal(book)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded borrow-button" v-if="book.available_to_borrow">
                                Borrow this book
                            </button>
                            <button class="bg-gray-400 text-white font-bold py-2 px-4 rounded borrow-button" v-if="!book.available_to_borrow">
                                Not available to borrow
                            </button>
                        </div>
                    </div>
                </div>
                <div class="border-t border-dashed pt-4">
                    <NuxtLink to="/" class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                        Back
                    </NuxtLink>
                </div>
                
                <div class="modal" v-if="showModal">
                    <div class="modal-content">
                        <div class="modal-container py-4 px-4">
                            <span @click="toggleModal" class="close-button">&times;</span>
                            
                            <div class="flex flex-col items-center justify-center">
                                <div>Book a schedule to borrow this book on the library for today.</div>
                                <div>
                                    <div class="selected-book-title">{{selectedBook.title}}</div>
                                </div>
                                <div class="mt-2 mb-2 p-3 w-40 bg-white rounded-lg shadow-xl">
                                    <div class="flex justify-center">
                                        <select v-model="selectedHour" name="hours" class="bg-transparent text-xl appearance-none outline-none">
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                            <option value="9">9</option>
                                            <option value="10">10</option>
                                            <option value="11">11</option>
                                            <option value="12">12</option>
                                        </select>
                                        <span class="text-xl mr-3">:</span>
                                        <select v-model="selectedMinute" name="minutes" class="bg-transparent text-xl appearance-none outline-none mr-4">
                                            <option value="0">00</option>
                                            <option value="30">30</option>
                                        </select>
                                        <select v-model="selectedAmPm" name="ampm" class="bg-transparent text-xl appearance-none outline-none">
                                            <option value="am">AM</option>
                                            <option value="pm">PM</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="error-msg mb-2" v-if="showBookedTimeError">This selected time is already booked by someone else</div>
                                <div>
                                    <input v-model="borrowerName" class="mb-2 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-full-name" type="text" placeholder="Please tell us your name">
                                </div>
                                <div class="error-msg mb-2" v-if="showNameEmptyError">Please insert your name</div>
                                <div>
                                    <button @click="makeAReservation" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded borrow-button">
                                        Make a reservation
                                    </button>
                                </div>
                                <div class="mt-4">
                                    You cannot pick these time below:
                                </div>
                                <div class="flex mt-2 flex-wrap justify-center">
                                    <div class="mb-2 bg-blue-500 rounded mx-2 p-1 text-white" v-for="bt of $store.state.schedule.map(s => (s.time))">{{formatTime(bt)}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data: () => ({
        booklist: [],
        isLoading: true,
        showModal: false,
        showBookedTimeError: false,
        showNameEmptyError: false,
        selectedHour: 1,
        selectedMinute: 0,
        selectedAmPm: 'am',
        selectedBook: {},
        borrowerName: '',
    }),
    methods: {
        async fetchBooks() {
            console.log('> running fetchbook')
            const api = 'https://openlibrary.org/subjects/mathematics.json';
            const books = await axios.get(api).then((response) => {
                console.log('we have response')
                this.isLoading = false;
                return response.data
            }).catch(e => {
                this.isLoading = false;
                console.log(e)
            })
            console.log('> books : ', books)
            this.booklist = books.works.map(book => (
                {
                    title: book.title,
                    authors: book.authors.map(author => author.name).join(', '),
                    edition_number: book.edition_count,
                    available_to_browse: book.availability.available_to_browse,
                    available_to_borrow: book.availability.available_to_borrow
                }
            ));
        },
        makeAReservation() {
            this.resetModalFormError();
            let bookTimeStamp = this.generateTimeStamp(this.selectedHour, this.selectedMinute, this.selectedAmPm);
            let scheduledTime = this.$store.state.schedule.map(s => (s.time))
            let allowToSubmit = true;
            if (scheduledTime.includes(bookTimeStamp)) {
                console.log('already booked by someone');
                this.showBookedTimeError = true;
                allowToSubmit = false;
            }
            if (this.borrowerName == '') {
                this.showNameEmptyError = true;
                allowToSubmit = false;
            }
            if (allowToSubmit) {
                this.$store.commit('ADD_SCHEDULE', {book: this.selectedBook, time: bookTimeStamp, borrowerName: this.borrowerName})
                this.resetModalForm();
                this.toggleModal();
            }
        },
        generateTimeStamp(hour, minutes, ampm) {
            let hourInt = parseInt(hour);
            if (ampm == 'pm' && hourInt != 12) {
                hourInt += 12;
            }
            let selectedTimeObj = new Date();
            selectedTimeObj.setHours(hourInt,minutes,0,0);
            let timestamp = selectedTimeObj.valueOf()
            return timestamp;
        },
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
        toggleModal() {
            this.showModal = !this.showModal;
            if (this.showModal === false) {
                this.selectedBook = {};
                this.resetModalFormError();
            }
        },
        showReservationModal(book) {
            this.selectedBook = book;
            this.toggleModal();
        },
        resetModalFormError() {
            this.showBookedTimeError = false;
            this.showNameEmptyError = false;
        },
        resetModalForm() {
            this.selectedHour =  1;
            this.selectedMinute =  0;
            this.selectedAmPm =  'am';
            this.borrowerName =  '';
        }
    },
    created() {
        this.fetchBooks();
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
.borrow-button {
    min-width: 30%;
}
.close-button {
    color: red;
    position: absolute;
    top: 10px;
    right: 20px;
}
.modal {
    z-index: 3;
    display: block;
    padding-top: 100px;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0,0,0);
    background-color: rgba(0,0,0,0.4);
    padding-left : 10%;
    padding-right:10%
}
.modal-content {
    margin: auto;
    background-color: #fff;
    position: relative;
    padding: 0;
    outline: 0;
    width: 600px;
    padding: 40px;
}
.modal-container {
    padding: 40px !important;
}
.selected-book-title {
    font-size: 1.4rem;
    font-weight: bold;
    color:#616161;
}
.error-msg {
    color: red;
}
</style>