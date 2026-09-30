export type RidePass = { id: string; name: string; validity: string; price: number };

// TODO: Replace these placeholder passes and prices with live product data.
export const fallbackPasses: RidePass[] = [
  { id: 'weekly', name: 'Weekly Pass', validity: 'Valid for 7 days', price: 250 },
  { id: 'student', name: 'Student Card', validity: 'Valid for 24 hours', price: 120 },
  { id: 'monthly', name: 'Monthly Pass', validity: 'Valid for one month', price: 700 },
];
