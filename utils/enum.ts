export enum ERole {
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  AGENCY_ADMIN = 'AGENCY_ADMIN',
}

export enum EGuaranteeStatus {
  REQUESTING = 1,
  APPROVED = 2,
}

export enum EContactStatus {
  UNANSWERED = 1,
  ANSWERED = 2,
}

export enum EContractStatus {
  ALL = 1,
  UNDER_CONTRACT = 2,
  CANCELED = 3,
}

export enum EContactFilter {
  ALL = 1,
  DEALER_REGISTER = 2,
  DEALER_UNREGISTER = 3,
}
