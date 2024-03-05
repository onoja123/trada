import App from './app';
import { PORT } from '@/core/config';
import Logging from './core/utils/logging';

const appPORT = PORT;
const app = new App();

app.express.listen(PORT, () => {
    Logging.info(`Server is listening on port ${appPORT}`);
});
