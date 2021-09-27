import { container } from './diContainer';
import { SERVICE_IDENTIFIER } from './constants/identifier';

// Register containers
global.diContainer = container;

// Run application
(container.get(SERVICE_IDENTIFIER.Application)).initializeApplication();
