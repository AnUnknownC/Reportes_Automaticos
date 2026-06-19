import { supabase } from '../config/supabase.js';
import { PLAN_LIMITS } from '../services/auth.service';
import { Request, Response, NextFunction } from 'express'

export function checkPlanLimit(action = 'create_client') {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (action !== 'create_client') return next();

    const { count } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('agency_id', req.agency?.agency_id);

    const limit = PLAN_LIMITS[req.agency?.plan ?? 'free'] ?? 0;
    if ((count ?? 0) >= limit) {
      return res.status(403).json({
        error: 'Límite de clientes alcanzado',
        current: count,
        limit,
        upgrade_url: '/pricing'
      });
    }
    next();
  };
}