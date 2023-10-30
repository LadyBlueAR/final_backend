import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {

    req.logger.debug('Prueda de logger de nivel debug');
    req.logger.http('Prueba de logger de nivel http');
    req.logger.info('Prueba de logger de nivel info');
    req.logger.warning('Prueba de logger de nivel warning');
    req.logger.error('Prueba de logger de nivel error');
    req.logger.fatal('Prueba de logger de nivel fatal');    
  
    res.send('Prueba de registros de logs');
  });

export default router;