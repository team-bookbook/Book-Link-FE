export type MarkerTone = 'info' | 'warning' | 'success' | 'error' | 'primary';

export type Marker = {
  date: string; // 'YYYY-MM-DD'
  tone?: MarkerTone; // default 'info'
};

export type CalendarProps = {
  value?: Date;
  onChange?: (date: Date) => void;
  markers?: Marker[];
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  prevIconName?: string;
  nextIconName?: string;
};
