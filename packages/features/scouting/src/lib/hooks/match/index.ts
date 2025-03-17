import {
  createFormSchemaHook,
  createRefetchFormSchema,
} from '../use-fetch-form-schema';
import { createSubmitFormHook } from '../use-submit-form';

export const useFetchMatchFormSchema = createFormSchemaHook('match');
export const refetchMatchFormSchema = createRefetchFormSchema('match');
export const useSubmitMatchForm = createSubmitFormHook('match');

export * from './use-fetch-all-match-data';
export * from './use-fetch-match-scouting-assignments';
export * from './use-local-match-data';
