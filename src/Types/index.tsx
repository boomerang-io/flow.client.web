export type DataDrivenInput = {
  id: string;
  defaultValue?: string;
  description?: string;
  key: string;
  label: string;
  options?: [{ key: string; value: string }];
  readOnly: boolean;
  required: boolean;
  value: string;
  values: [string] | [{ key: string; value: string }];
  type: string;
};

export interface ModalTriggerProps {
  openModal(): void;
}

export interface ComposedModalChildProps {
  closeModal(): void;
}

export type FormikSetFieldValue = (id: string, value: string | [string] | boolean | undefined) => void;

export interface WorkflowSummary {
  id: string;
  description: string;
  enableACCIntegration: boolean;
  enablePersistentStorage: boolean;
  icon: string;
  name: string;
  revisionCount: number;
  shortDescription: string;
  properties: [DataDrivenInput];
  triggers: {
    event: {
      enable: boolean;
      topic: string;
    };
    scheduler: {
      enable: boolean;
      schedule: string;
      timezone: boolean;
      advancedCron: boolean;
    };
    webhook: {
      enable: boolean;
      token: string;
    };
  };
}
