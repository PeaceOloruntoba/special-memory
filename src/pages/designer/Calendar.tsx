import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Label from "../../components/ui/Label";
import Textarea from "../../components/ui/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/Select";
import Badge from "../../components/ui/Badge";
import {
  BiCalendar,
  BiTime,
  BiPlus,
  BiChevronLeft,
  BiChevronRight,
  BiMap,
  BiUser,
} from "react-icons/bi";
import { useCalendarStore } from "../../store/useCalendarStore";
import { useClientStore } from "../../store/useClientStore";
import type { CalendarEvent } from "../../types/types";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose }) => {
  const { addEvent } = useCalendarStore();
  const { clients } = useClientStore();
  const [newEvent, setNewEvent] = useState({
    clientId: "",
    title: "",
    description: "",
    type: "consultation" as CalendarEvent["type"],
    startTime: "",
    endTime: "",
    location: "",
    status: "scheduled" as CalendarEvent["status"],
  });

  const handleSubmit = async () => {
    try {
      await addEvent({
        ...newEvent,
        status: "scheduled",
      });
      onClose();
    } catch (error) {
      // Error is handled by useCalendarStore with toast notification
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-[500px] mx-4">
        <h2 className="text-2xl font-bold text-gray-900">Add New Event</h2>
        <p className="text-gray-600 mb-4">
          Schedule a new appointment or event
        </p>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
              placeholder="e.g., Final Fitting - Wedding Dress"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="clientId">Client</Label>
              <Select
                value={newEvent.clientId}
                onValueChange={(value) =>
                  setNewEvent({ ...newEvent, clientId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Event Type</Label>
              <Select
                value={newEvent.type}
                onValueChange={(value) =>
                  setNewEvent({ ...newEvent, type: value as CalendarEvent["type"] })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="fitting">Fitting</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                  <SelectItem value="deadline">Deadline</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={newEvent.startTime}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, startTime: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={newEvent.endTime}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, endTime: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={newEvent.location}
              onChange={(e) =>
                setNewEvent({ ...newEvent, location: e.target.value })
              }
              placeholder="Studio, Client Office, etc."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
              placeholder="Additional notes about the event..."
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            onClick={onClose}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-black/90 text-white hover:bg-black/80"
          >
            Add Event
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function Calendar() {
  const { events, isLoading, error, getAllEvents } = useCalendarStore();
  const { clients, getAllClients } = useClientStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>("");
  selectedDate;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    getAllClients();
    getAllEvents();
  }, [getAllClients, getAllEvents]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const getEventsForDate = (date: string) => {
    return events.filter((event) => event.startTime.startsWith(date));
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "fitting":
        return "bg-blue-100 text-blue-800";
      case "consultation":
        return "bg-green-100 text-green-800";
      case "delivery":
        return "bg-purple-100 text-purple-800";
      case "deadline":
        return "bg-red-100 text-red-800";
      case "meeting":
        return "bg-yellow-100 text-yellow-800";
      case "other":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (isLoading && !events.length && !clients.length) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4 min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900" />
          <p className="text-xl text-gray-700">Loading calendar...</p>
        </div>
      </div>
    );
  }

  if (error && !events.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4 min-h-screen">
        <p className="text-xl text-red-500 mb-4">Error: {error}</p>
        <Button
          className="bg-black/90 text-white hover:bg-black/80 px-4 py-2 rounded-md cursor-pointer"
          onClick={() => {
            getAllClients();
            getAllEvents();
          }}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600">
            Manage appointments, fittings, and deadlines
          </p>
        </div>
        <Button
          className="bg-black/90 flex items-center justify-center text-nowrap text-white hover:bg-black/80 px-4 py-2 rounded-md cursor-pointer"
          onClick={() => setIsAddModalOpen(true)}
        >
          <BiPlus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <Card className="bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BiCalendar className="h-5 w-5" />
                  {monthNames[currentDate.getMonth()]}{" "}
                  {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex gap-2">
                  <Button onClick={() => navigateMonth("prev")}>
                    <BiChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => navigateMonth("next")}>
                    <BiChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {dayNames.map((day) => (
                  <div
                    key={day}
                    className="p-2 text-center text-sm font-medium text-gray-500"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  if (day === null) {
                    return <div key={index} className="p-2 h-24"></div>;
                  }

                  const dateString = formatDate(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    day
                  );
                  const dayEvents = getEventsForDate(dateString);
                  const isToday =
                    dateString === new Date().toISOString().split("T")[0];

                  return (
                    <div
                      key={day}
                      className={`p-2 h-24 border border-gray-200 cursor-pointer hover:bg-gray-50 ${
                        isToday ? "bg-blue-50 border-blue-200" : ""
                      }`}
                      onClick={() => setSelectedDate(dateString)}
                    >
                      <div
                        className={`text-sm font-medium mb-1 ${
                          isToday ? "text-blue-600" : ""
                        }`}
                      >
                        {day}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs p-1 rounded truncate ${getEventTypeColor(
                              event.type
                            )}`}
                          >
                            {new Date(event.startTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <div className="space-y-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Next 7 days</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {events
                .filter((event) => {
                  const eventDate = new Date(event.startTime);
                  const today = new Date();
                  const nextWeek = new Date(
                    today.getTime() + 7 * 24 * 60 * 60 * 1000
                  );
                  return eventDate >= today && eventDate <= nextWeek;
                })
                .sort(
                  (a, b) =>
                    new Date(a.startTime).getTime() -
                    new Date(b.startTime).getTime()
                )
                .map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      <BiTime className="h-4 w-4 text-gray-500 mt-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate">
                          {event.title}
                        </h4>
                        <Badge className={getEventTypeColor(event.type)}>
                          {event.type}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex items-center gap-1">
                          <BiUser className="h-3 w-3" />
                          {event.clientName || "No Client"}
                        </div>
                        <div className="flex items-center gap-1">
                          <BiCalendar className="h-3 w-3" />
                          {new Date(
                            event.startTime
                          ).toLocaleDateString()} at{" "}
                          {new Date(event.startTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <BiMap className="h-3 w-3" />
                            {event.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              {events.filter((event) => {
                const eventDate = new Date(event.startTime);
                const today = new Date();
                const nextWeek = new Date(
                  today.getTime() + 7 * 24 * 60 * 60 * 1000
                );
                return eventDate >= today && eventDate <= nextWeek;
              }).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <BiCalendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No events scheduled in the next 7 days</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {events
                .filter((event) =>
                  event.startTime.startsWith(
                    new Date().toISOString().split("T")[0]
                  )
                )
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between py-2 border-b last:border-b-0"
                  >
                    <div>
                      <div className="font-medium text-sm">{event.title}</div>
                      <div className="text-xs text-gray-600">
                        {event.clientName || "No Client"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {new Date(event.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <Badge className={getEventTypeColor(event.type)}>
                        {event.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              {events.filter((event) =>
                event.startTime.startsWith(
                  new Date().toISOString().split("T")[0]
                )
              ).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <BiCalendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No events scheduled for today</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
