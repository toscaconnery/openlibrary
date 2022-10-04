# joybox

## How to run the project

- install dependencies with this command: 
npm install

- run the project with this command:
npm run dev 

Author: Tosca Yoel Connery
GitHub: https://github.com/toscaconnery/openlibrary

Assumptions: 
- Pick up time has 30 minute range.
- Pick up schedule is only for one day, user will make a reservation for today date. Therefore, user does not required to choose the date.
- User does not required to logged in into the system.

Notes:
- API result does contain 'available_to_browse' field, which I use to show books only with 'true' value.
- API result does contain 'available_to_borrow' field, which I use to determine if the book can be borrowed.
- Schedule list will be ordered by time.
- Vuex used as storage in the system, you can navigate through the app and the data will persist. Hard refresh will wipe the data.

# joybox
