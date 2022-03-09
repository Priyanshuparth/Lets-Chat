// Node server which will handle socket.io

// const { Socket } = require('socket.io');

const io = require('socket.io')(8000, {
    cors: {
      origin: '*',
    }
  });
 
const users = {};

io.on('connection',socket =>{
    // If any new user joins let other users connected to the server know
    socket.on('new-user-joined',name =>{
        // console.log("New user",name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined',name);
    });
    // If someoun sends a message broadcast it to other people
    socket.on('send',message =>{
        socket.broadcast.emit('receive',{message: message, name:users[socket.id]})
    });
    //If someone leaves the chat let others know
    socket.on('disconnect',message =>{ //Otner names eg:new-user,send etc.. are given by programmer but disconnect is an inbuilt name
        socket.broadcast.emit('leave',users[socket.id]);
        delete users[socket.id];
    });
})