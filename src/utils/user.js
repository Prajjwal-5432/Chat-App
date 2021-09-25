const users = []

const addUser = ({ id, username, room }) => {
    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required'
        }
    }

    //check for existing user
    const existingUser = users.find(user => user.room === room && user.username === username)

    if (existingUser) {
        return {
            error: 'Username is in use'
        }
    }

    //store user
    const user = { id, username, room }
    users.push(user)

    return { user }
}

const removeUser = id => {
    const index = users.findIndex(user => user.id === id)
    if(index !== -1) {
        return users.splice(index, 1)[0]
    }
}