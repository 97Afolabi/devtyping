export interface Topic {
  title: string;
  slug?: string;
  summary: string;
  description: string;
  countActive: number;
  countInactive: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
