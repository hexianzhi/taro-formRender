import * as React from 'react';

declare const FormRender: React.FC<FRProps>;
export interface FRProps {
  formSchema: Object;
  formValue: Object;
  onChange: () => void;
}
export default FormRender;
