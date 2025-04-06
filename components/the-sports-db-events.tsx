"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image' // Import the Next.js Image component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Define an interface for the event data we expect
interface SportEvent {
  id: string
  date: string
  homeTeam: string
  awayTeam: string
  thumbnailUrl?: string | null // Added optional thumbnail URL
}

// Define the props if needed, e.g., to pass event IDs
interface TheSportsDbEventsProps {
  eventIds?: string[] // Optional: Pass IDs as props, otherwise use default
}

const DEFAULT_EVENT_IDS = ['2052711', '2052712', '2052713', '2052714'];
const API_BASE_URL = "https://www.thesportsdb.com/api/v1/json/3/lookupevent.php?id=";

export function TheSportsDbEvents({ eventIds = DEFAULT_EVENT_IDS }: TheSportsDbEventsProps) {
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      const fetchedEvents: SportEvent[] = [];

      try {
        // Fetch details for each event ID
        // Using Promise.all for concurrent fetching
        // Explicitly type the Promise.all result array elements
        const results = await Promise.all<SportEvent | null>(
          eventIds.map(async (id): Promise<SportEvent | null> => { // Explicitly type the async function's return promise
            const response = await fetch(`${API_BASE_URL}${id}`);
            if (!response.ok) {
              // Handle non-successful responses for individual events
              console.error(`Failed to fetch event ${id}: ${response.statusText}`);
              return null; // Skip this event on error
            }
            const data = await response.json();
            // The API returns an object with an "events" array (possibly null or empty)
            if (data && data.events && data.events.length > 0) {
              const eventData = data.events[0]; // Assuming lookup by ID returns one event
              // Construct the object matching SportEvent structure
              const eventObject: SportEvent = {
                id: eventData.idEvent,
                date: eventData.dateEvent,
                homeTeam: eventData.strHomeTeam,
                awayTeam: eventData.strAwayTeam,
                thumbnailUrl: eventData.strThumb || null // Ensure null if strThumb is missing/falsy
              };
              return eventObject;
            } else {
              console.warn(`No event data found for ID ${id}`);
              return null; // No event found for this ID
            }
          })
        );

        // Filter out null results and explicitly type the result
        const validEvents: SportEvent[] = results.filter(
          (event): event is SportEvent => event !== null
        );
        
        // Filter out duplicates based on event.id
        const uniqueEvents = validEvents.filter((event, index, self) =>
          index === self.findIndex((e) => e.id === event.id)
        );

        setEvents(uniqueEvents); // Pass the unique array
      } catch (fetchError: any) {
        console.error("Error fetching events:", fetchError);
        setError(`Failed to load events: ${fetchError.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [eventIds]); // Re-run effect if eventIds prop changes

  return (
    <Card className="bg-black/40 border-zinc-800">
      <CardHeader>
        <CardTitle>Upcoming Events (TheSportsDB)</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-muted-foreground">Loading events...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!isLoading && !error && events.length === 0 && (
          <p className="text-muted-foreground">No events found.</p>
        )}
        {!isLoading && !error && events.length > 0 && (
          <ul className="space-y-3">
            {events.map((event) => (
              <li key={event.id} className="flex items-center space-x-3 border-b border-zinc-700 pb-2 last:border-b-0">
                {event.thumbnailUrl ? (
                  <Image
                    src={event.thumbnailUrl} // Use the thumbnail URL
                    alt={`${event.homeTeam} vs ${event.awayTeam}`}
                    width={40} // Specify width
                    height={40} // Specify height
                    className="rounded object-cover"
                    unoptimized // Required for external URLs unless configured in next.config.js
                  />
                ) : (
                  <div className="w-10 h-10 bg-zinc-700 rounded flex items-center justify-center text-xs text-muted-foreground">
                    N/A
                  </div>
                )}
                <div>
                  <span className="font-medium text-sm">{event.date}:</span> 
                  <span className="text-sm">{event.homeTeam} vs {event.awayTeam}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
} 