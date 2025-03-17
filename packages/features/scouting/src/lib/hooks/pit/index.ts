import {
  createFormSchemaHook,
  createRefetchFormSchema,
} from '../use-fetch-form-schema';
import { createSubmitFormHook } from '../use-submit-form';

export const useFetchPitFormSchema = createFormSchemaHook('pit');
export const refetchPitFormSchema = createRefetchFormSchema('pit');
export const useSubmitPitForm = createSubmitFormHook('pit');

export * from './use-fetch-all-pit-data';
export * from './use-fetch-pit-scouting-assignments';
export * from './use-local-pit-data';
