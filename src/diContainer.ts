import { Container } from 'inversify';
import * as appDi from './config/di.config';

const container = new Container({ defaultScope: 'Singleton' });

appDi.register(container);

export { container };