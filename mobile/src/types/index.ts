export interface User {
  id: string;
  name: string;
  email: string;
}

export interface JobStatus {
  id: string;
  label: string;
  value: string;
}

export interface Tag {
  id: string;
  label: string;
  value: string;
}

export interface Job {
  id: string;
  jobUrl?: string | null;
  description: string;
  jobType: string;
  workplaceType?: string | null;
  applied: boolean;
  appliedDate?: string | null;
  dueDate?: string | null;
  salaryRange?: string | null;
  matchScore?: number | null;
  createdAt: string;
  Status: JobStatus;
  JobTitle: { id: string; label: string; value: string };
  Company: { id: string; label: string; value: string; logoUrl?: string | null };
  Location?: { id: string; label: string; value: string } | null;
  JobSource?: { id: string; label: string; value: string } | null;
  tags: Tag[];
  _count?: {
    Notes: number;
    Interview: number;
  };
}

export interface PairingPayload {
  version: number;
  appName: string;
  serverUrl: string;
  token: string;
  user: User;
  createdAt: string;
}

export type RootStackParamList = {
  Login: undefined;
  QrScan: undefined;
  Main: undefined;
  JobDetails: { jobId: string };
  AddJob: { prefilledUrl?: string };
};

export type MainTabParamList = {
  Jobs: undefined;
  AddJobTab: undefined;
  Settings: undefined;
};
