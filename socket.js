const SocketIO = require('socket.io'); 
module.exports = (server, app, sessionMiddleware) => {
    const io = SocketIO(server, { path: '/socket.io',cors: { origin: "*"} });
    app.set('io', io);
    const chat = io.of('chat');
  

    chat.on('connection', (socket) => {
      console.log('chat 네임스페이스에 접속');
  
      socket.on('chatConnect', async (data) => {
          console.log(data);
          socket.join(data.user_name);
      });
  
      socket.on('disconnect', async () => {
        console.log('chat 네임스페이스 접속 해제');

      });
    });
  };