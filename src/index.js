import { container } from './diContainer';
import { SERVICE_IDENTIFIER } from './constants/identifier';

// Run application
(container.get(SERVICE_IDENTIFIER.Application)).initializeApplication();
