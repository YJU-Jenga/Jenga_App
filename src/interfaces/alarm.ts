export interface IAlarmData {
  map(
    arg0: (item: IAlarmData, i: number) => JSX.Element,
  ): import('react').ReactNode;
  user_id?: number;
  file?: string;
  id: number;
  name: string;
  repeat: string;
  sentence: string;
  state: boolean;
  time_id: string;
  updatedAt?: string;
  createdAt?: string;
  [Symbol.iterator](): Iterator<any>;
}
