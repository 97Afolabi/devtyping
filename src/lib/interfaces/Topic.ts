export interface Topic {
  title: string;
  slug?: string;
  summary: string;
  description: string;
  count: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
