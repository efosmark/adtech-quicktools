
import ara from './middleware/ara';
import byos from './middleware/byos';
import cors from './middleware/cors';
import enablements from './middleware/enablements';
import favicon from './middleware/favicon';
import permissions from './middleware/permissions';
import socketLogger from './middleware/socketLogger';
import serve from './serve';

export default {
    ara,
    byos,
    cors,
    enablements,
    favicon,
    permissions,
    socketLogger,
    serve
}