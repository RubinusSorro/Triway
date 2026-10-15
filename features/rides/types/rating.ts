export type RideRating = {
  rideId: string;
  riderId: string;
  driverId?: string;
  score: 1 | 2 | 3 | 4 | 5;
  createdAt: string;
};

export type CreateRideRatingInput = Omit<RideRating, 'createdAt'>;
