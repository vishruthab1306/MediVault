import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';

const DEFAULT_USER_ID = 'default-user-id';

export const getTimeline = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { groupByCluster } = req.query;

    const events = await prisma.timelineEvent.findMany({
      where: { userId: DEFAULT_USER_ID },
      orderBy: { date: 'desc' } // DD/MM/YYYY parsed or sorted by date, but since SQLite stores dates as strings, let's sort by date strings or creation time. We'll order by createdAt/date.
    });

    if (groupByCluster === 'true') {
      // Group events by their conditionCluster tag
      const clusters: { [key: string]: typeof events } = {};

      events.forEach((event) => {
        const clusterName = event.conditionCluster || 'General Health';
        if (!clusters[clusterName]) {
          clusters[clusterName] = [];
        }
        clusters[clusterName].push(event);
      });

      res.status(200).json(clusters);
      return;
    }

    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};
