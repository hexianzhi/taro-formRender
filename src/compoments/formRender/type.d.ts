declare const FormRender: React.FC<FRProps>;

export interface FRProps {
  ref?: React.RefObject<IFormRef>;

  /** 数据源 */
  formSchema: IFormSchema[];
  /** 值 */
  formValue: IAnyObject;
  /** 值改变回调 */
  onChange: (newFormValue: any, key: string, value: any) => void;
}

export interface IFormSchema {
  /** 唯一标志,用于onChange 中回调 */
  key: string;
  /** 名称 */
  title: string;
  /** 组件类型 */
  type: string;
  /** 组件Props */
  typeProps?: IAnyObject;
  /** 是否必填 */
  required?: boolean | IFunctionProps;
  /** 类名 */
  className?: string;
  /** 是否隐藏 */
  hidden?: boolean | IFunctionProps;
  /** 是否禁用 */
  diabled?: boolean | IFunctionProps;
  /** 验证规则 */
  rules?: IRule[];
  /** 扩展组件 */
  widget?: string;
  /** 扩展组件props */
  widgetProps?: IAnyObject;
  /** 自定义组件 */
  custom?: (
    formValue: IAnyObject,
    formSchema: IFormSchema,
    onChange: (key: string, value: any) => void
  ) => JSX.Element;

  /** 任意字段 */
  [key: string]: any;
}
export type IAnyObject = { [key: string]: any };

export type IRule = IFormRule;

export type IFunctionProps = (
  formValue: any,
  formSchema: IFormSchema
) => boolean;

export type ICustomElement = (
  formValue: IAnyObject,
  formSchema: IFormSchema,
  onChange: (key: string, value: any) => void
) => JSX.Element;

export interface IFormRule {
  pattern?: RegExp;
  validate?: (value: any) => boolean;
  message: string;
}
export interface IFormRef {
  /** 返回 true 表示验证通过 */
  validate: () => boolean;
}

export interface IWidgetProps {
  value: any;
  item: IFormSchema;
  formSchema: IFormSchema[];
  formValue: IAnyObject;
  /** 值改变回调 */
  onChange: (value: any) => void;
  /** 任意字段 */
  [key: string]: any;
}

export default FormRender;
