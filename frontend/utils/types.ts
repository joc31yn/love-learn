export interface EventProp {
    title: string;
    start_date: string;
    end_date: string;
    location: string;
    description: string;
}

export const emptyEventData = {
  title: '',
  start_date: '',
  end_date: '',
  location: '',
  description: ''
};

export interface CalendarEvent {
  title: string;
  start: string;
  end: string;
  extendedProps: {
    location: string;
    description: string;
  };
};

export const emptyCalendarEvent = {
  title: '',
  start: '',
  end: '',
  extendedProps: {
    location: '',
    description: ''
  }
};