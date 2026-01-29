const http = require('http');
const { Server } = require('socket.io');

// El puerto lo asigna Render automáticamente
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('ColorLive Server is Running\n');
});

const io = new Server(server, {
    cors: {
        origin: "*", // Permite conexiones desde cualquier lugar
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);

    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`Usuario ${socket.id} se unió a la sala: ${roomId}`);
    });

    socket.on('draw-line', (data) => {
        // Enviar a todos en la sala excepto al que dibujó
        socket.to(data.roomId).emit('draw-line', data);
    });

    socket.on('send-img', (data) => {
        socket.to(data.roomId).emit('send-img', data);
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});
