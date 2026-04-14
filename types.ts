
export enum HealthCondition {
  ZINC_DEFICIENCY = 'Zinc Deficiency',
  ANAEMIA = 'Anaemia Indicators',
  JAUNDICE = 'Jaundice Indicators',
  SKIN_RASH = 'Skin Rash',
  NORMAL = 'Normal Condition'
}

export enum Severity {
  LOW = 'Low Risk',
  MODERATE = 'Moderate Risk',
  HIGH = 'High Risk'
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  symptoms: string[];
  latestCondition: HealthCondition;
  severity: Severity;
  lastScan: string;
  medicineHistory: string[];
  testimonial: string;
  visitHistory: { month: string; count: number }[];
  vitaminLevels: { type: string; level: number }[];
}

export interface Doctor {
  id: string;
  name: string;
  location: string;
  available: boolean;
  specialty: string;
  gender: 'Mr.' | 'Mrs.';
}

export interface ASHAWorker {
  id: string;
  name: string;
  distance: string;
  activeCases: number;
  available: boolean;
}

export interface Chemist {
  id: string;
  name: string;
  location: string;
  hours: string;
}

export interface BabyRegistration {
  id: string;
  campId: string;
  babyName: string;
  parentName: string;
  age: string;
  timestamp: string;
}

export interface HealthCamp {
  id: string;
  title: string;
  initiative: string;
  date: string;
  leadASHA: string;
  image: string;
  status: 'upcoming' | 'past';
  description: string;
  type: 'general' | 'vaccination' | 'maternal';
  location: string;
}

export interface Message {
  role: 'user' | 'doctor' | 'asha';
  text: string;
  image?: string;
  timestamp: string;
}

export interface PHC {
  name: string;
  distance: string;
  doctorAvailable: boolean;
  specialty: string;
}
