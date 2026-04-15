import { type BusinessTypeID, type PainPointID } from "./constants";

export interface ServiceFeature {
  id: number;
  name: string;
  serviceId: number;
}

export interface Service {
  id: number;
  title: string;
  slug: string;
  description: string;
  icon?: string | null;
  image: string;

  businessTypes: BusinessTypeID[];
  painPoints: PainPointID[];

  features: ServiceFeature[];

  isVisible: boolean;
  order: number;

  createdAt: string;
  updatedAt: string;
}
