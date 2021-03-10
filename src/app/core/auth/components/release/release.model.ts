export interface ReleaseModel {
  Description: string;
  Date: string;
  Features: FeaturesModel[];
  Bugs: BugsModel[];
}

export interface FeaturesModel {
  Title: string;
  Description: string;
}

export interface BugsModel {
  Title: string;
  Description: string;
}
