// state
export const state = () => ({
    schedule: [],
});

// mutations
export const mutations = {
    ADD_SCHEDULE(state, schedule) {
        let existingSchedule = state.schedule;
        existingSchedule.push(schedule);
        existingSchedule.sort(function(x,y) {
            return x.time - y.time;
        })
        state.schedule = existingSchedule;
    }
};

