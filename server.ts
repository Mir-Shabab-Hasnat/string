import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    path: '/api/socketio',
    addTrailingSlash: false,
  });

  io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('broadcast-message', (message) => {
      io.emit('new-message', {
        id: Date.now().toString(),
        ...message
      });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
}); 