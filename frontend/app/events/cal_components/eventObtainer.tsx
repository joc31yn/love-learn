export interface EventProp {
    eventName: string;
    time: string;
    date: string;
    end_time: string;
    end_date: string;
    location: string;
    description: string;
  }
  
  export interface EventProps {
    events: EventProp[];
  }
  
  export function FetchEvents(): EventProps {
    return {
      events: [
        {
          eventName: "React Conference",
          time: "10:00:00",
          date: "2024-11-12",
          end_time: "11:00:00",
          end_date: "2024-11-12",
          location: "San Francisco, CA",
          description: "A conference for React enthusiasts and developers.",
        },
        {
          eventName: "TypeScript Workshop",
          time: "14:00:00",
          date: "2024-10-30",
          end_time: "18:00:00",
          end_date: "2024-10-30",
          location: "New York, NY",
          description:
            "An in-depth workshop covering advanced TypeScript topics.",
        },
        {
          eventName: "Frontend Meetup",
          time: "18:30:00",
          date: "2024-11-18",
          end_time: "20:30:00",
          end_date: "2024-11-18",
          location: "Los Angeles, CA",
          description:
            "A meetup for frontend developers to network and share knowledge.",
        },
      ],
    };
  }
