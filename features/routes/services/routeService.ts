import { antipoloRoutes } from '@/features/routes/data/antipoloRoutes';
import { TriwayRoute } from '@/features/routes/types/route';

export const routeService = {
  async listRoutes(): Promise<TriwayRoute[]> {
    return antipoloRoutes;
  },

  async getRouteById(routeId: string): Promise<TriwayRoute | undefined> {
    return antipoloRoutes.find((route) => route.id === routeId);
  },
};
