"use client";

import * as React from "react";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isBefore,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfMonth,
  startOfToday,
  startOfWeek,
  subDays,
} from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon, XIcon } from "lucide-react";
import Header from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Button from "./components/Buttons";
import { useMediaQuery } from "./components/useMediaQuery";
import { useSelectedDate } from "./components/SelectDate";
import { useBlockedDates } from "../../hooks/Calendar/use-blockdates";

const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];

export function FullScreenCalendar({ unavailableDates = [], onUserSelectedDate }) {
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = React.useState(today);
  const [currentMonth, setCurrentMonth] = React.useState(format(today, "MMM-yyyy"));
  const { setSelectedDate } = useSelectedDate();
  const [unavailableMessage, setUnavailableMessage] = React.useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);
  const [showErrorMessage, setShowErrorMessage] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [showBlockedMessage, setShowBlockedMessage] = React.useState(false);

  const {
    blockedDates,
    loading: isLoading,
    error: blockedDatesError,
    setAllBlockedDates,
    removeBlockedDate,
    addBlockedDate,
  } = useBlockedDates();

  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  });

  const disablePrev =
    isSameMonth(firstDayCurrentMonth, startOfMonth(today)) ||
    isBefore(firstDayCurrentMonth, startOfMonth(today));

  const handleDateClick = (day) => {
    const today = new Date();
    const isUnavailable = unavailableDates.some((d) => isSameDay(d, day));
    const isBlocked = blockedDates.some((d) => isSameDay(d, day));

    setUnavailableMessage(isUnavailable);

    if (isUnavailable) return;

    setSelectedDay(day);
    setSelectedDate(day);
    setShowBlockedMessage(isBlocked);

    const wasSelected = isToday(day) || !isBefore(day, today);
    if (typeof onUserSelectedDate === "function") {
      onUserSelectedDate(wasSelected);
    }
  };

  const toggleBlockDate = async () => {
    const isBlocked = blockedDates.some((d) => isSameDay(d, selectedDay));

    // Show message immediately before API call
    if (isBlocked) {
      setMessage("Date successfully unblocked");
    } else {
      setMessage("Date successfully blocked");
    }
    setShowSuccessMessage(true);
    setShowBlockedMessage(false);

    try {
      if (isBlocked) {
        await removeBlockedDate(selectedDay);
      } else {
        await addBlockedDate(selectedDay);
      }
    } catch (error) {
      setShowSuccessMessage(false);
      setShowErrorMessage(true);
      setMessage("Failed to update date status");
    } finally {
      setTimeout(() => {
        setShowSuccessMessage(false);
        setShowErrorMessage(false);
      }, 5000);
    }
  };

  React.useEffect(() => {
    if (typeof onUserSelectedDate === "function") {
      onUserSelectedDate(false);
    }
  }, []);

  function previousMonth() {
    const prevMonth = add(firstDayCurrentMonth, { months: -1 });
    const newSelectedDate = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), selectedDay.getDate());
    setCurrentMonth(format(prevMonth, "MMM-yyyy"));
    setSelectedDay(newSelectedDate);
    setSelectedDate(newSelectedDate);
  }
  
  function nextMonth() {
    const nextMonth = add(firstDayCurrentMonth, { months: 1 });
    const newSelectedDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), selectedDay.getDate());
    setCurrentMonth(format(nextMonth, "MMM-yyyy"));
    setSelectedDay(newSelectedDate);
    setSelectedDate(newSelectedDate);
  }

  const isSelectedToday = isToday(selectedDay);
  const isSelectedBlocked = blockedDates.some((d) => isSameDay(d, selectedDay));

  return (
    <div className="flex flex-col min-h-screen w-full bg-global-1">
      <Header />
      <div className="flex flex-row flex-1 min-h-0">
        <Sidebar />

        <div className="flex flex-col flex-1 p-6 bg-global-1 overflow-auto items-center">
          <div className="w-full max-w-[1348px] relative mt-5">
            {/* Combined Success/Error/Blocked Messages */}
            {(showSuccessMessage || showErrorMessage || showBlockedMessage) && (
              <div
                className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 flex items-center justify-between p-4 rounded-md shadow-lg ${
                  showSuccessMessage
                    ? "bg-green-100 font-semibold text-green-800"
                    : showBlockedMessage
                    ? "bg-[#f6e3c5] border font-semibold border-[#4b2b2b] text-[#4b2b2b]"
                    : "bg-red-100 text-red-800"
                }`}
              >
                <div className="flex items-center">
                  {showSuccessMessage ? (
                    <CheckIcon className="h-5 w-6 mr-2" />
                  ) : showBlockedMessage ? null : (
                    <XIcon className="h-5 w-5 mr-2" />
                  )}
                  <span className="flex items-center gap-2">
                    {showSuccessMessage ? (
                      message
                    ) : showBlockedMessage ? (
                      <>
                        This date is already blocked, Click unblock button
                        <XIcon className="h-5 w-5" />
                      </>
                    ) : (
                      message
                    )}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setShowSuccessMessage(false);
                    setShowErrorMessage(false);
                    setShowBlockedMessage(false);
                  }}
                  className="ml-4"
                ></button>
              </div>
            )}

            {/* Calendar Header with current date between arrows */}
            <div className="flex justify-end mb-1 mr-1">
            <div className="inline-flex border-2 p-2 border-[#808080] w-full mb-4 -space-x-px rounded-lg shadow-sm shadow-black/5 md:w-auto rtl:space-x-reverse">
              <Button
                onClick={previousMonth}
                disabled={disablePrev}
                className="rounded-none mr-2 pr-2 shadow-none first:rounded-s-lg last:rounded-e-lg border-2 border-r-[#] focus-visible:z-10 border-l-0 border-t-0 border-b-0"
                size="icon"
                aria-label="Navigate to previous month"
              >
                <ChevronLeftIcon size={16} strokeWidth={2} aria-hidden="true" />
              </Button>
              
              <Button
                className="w-full pr-2 mr-2 rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg border-[#000000] focus-visible:z-10 md:w-auto cursor-default"
                variant="outline"
              >
                {format(selectedDay, "MMM dd, yyyy")}
              </Button>
             
              <Button
                onClick={nextMonth}
                className="rounded-none  pl-2  shadow-none first:rounded-s-lg last:rounded-e-lg border-2 border-l-[#808080] focus-visible:z-10 border-r-0 border-t-0 border-b-0 "
                variant="outline"
                size="icon"
                aria-label="Navigate to next month"
              >
                <ChevronRightIcon size={16} strokeWidth={2} aria-hidden="true" />
              </Button>
            </div>
            </div>

            {/* Calendar Grid */}
            <div className="lg:flex lg:flex-auto lg:flex-col w-full max-w-[1344px] mx-auto">
              <div className="grid grid-cols-7 border-y border-l border-[#808080] text-center text-xs font-semibold leading-6 lg:flex-none">
                <div className="border-r border-[#808080] py-2.5">Sun</div>
                <div className="border-r border-[#808080] py-2.5">Mon</div>
                <div className="border-r border-[#808080] py-2.5">Tue</div>
                <div className="border-r border-[#808080] py-2.5">Wed</div>
                <div className="border-r border-[#808080] py-2.5">Thu</div>
                <div className="border-r border-[#808080] py-2.5">Fri</div>
                <div className="border-r border-[#808080] py-2.5">Sat</div>
              </div>

              <div className="flex text-xs leading-6 lg:flex-auto">
                <div className="hidden w-full border-l border-[#808080] lg:h-[470px] md:h-[400px] lg:grid lg:grid-cols-7 lg:grid-rows-5">
                  {days.map((day, dayIdx) => {
                    const isInCurrentMonth = isSameMonth(day, firstDayCurrentMonth);
                    const isCurrentDay = isToday(day);
                    const isSelected = isEqual(day, selectedDay);
                    const isBlocked = blockedDates.some((d) => isSameDay(d, day));

                    return (
                      <div
                        key={dayIdx}
                        onClick={
                          isSameMonth(day, firstDayCurrentMonth)
                            ? () => handleDateClick(day)
                            : undefined
                        }
                        className={[
                          dayIdx === 0 ? colStartClasses[getDay(day)] : "",
                          !isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          !isSameMonth(day, firstDayCurrentMonth)
                            ? "bg-accent/50 text-muted-foreground"
                            : "",
                          !isSelected && !isCurrentDay && !isInCurrentMonth
                            ? "bg-accent/50 text-muted-foreground bg-[#E0E0E0]"
                            : "",
                          !isSelected ? "hover:bg-accent/75" : "",
                          isSelected ? "bg-[#FFF1DC]" : "",
                          "relative flex flex-col border-b border-r border-[#808080] hover:bg-muted focus:z-10",
                          !isEqual(day, selectedDay) ? "hover:bg-accent/75" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        <header className="flex items-center justify-between p-2.5">
                          <div className="relative">
                            {isBlocked && (
                              <div className="absolute inset-0 bg-[#808080] opacity-30 rounded-full h-7 w-7" />
                            )}
                            <button
                              type="button"
                              className={[
                                isEqual(day, selectedDay) ? "text-primary-foreground" : "",
                                !isEqual(day, selectedDay) &&
                                !isToday(day) &&
                                isSameMonth(day, firstDayCurrentMonth)
                                  ? "text-foreground"
                                  : "",
                                !isEqual(day, selectedDay) &&
                                !isToday(day) &&
                                !isSameMonth(day, firstDayCurrentMonth)
                                  ? "text-muted-foreground"
                                  : "",
                                !isSelected && !isCurrentDay && isInCurrentMonth
                                  ? "text-foreground"
                                  : "",
                                !isInCurrentMonth ? "text-muted-foreground" : "",
                                isEqual(day, selectedDay) && isToday(day)
                                  ? "border bg-primary"
                                  : "",
                                isEqual(day, selectedDay) && !isToday(day)
                                  ? "bg-foreground"
                                  : "",
                                isEqual(day, selectedDay)
                                  ? "font-semibold bg-[#6B3D3D] text-[#FFF1DC]"
                                  : "",
                                isToday(day) ? "font-semibold border border-black" : "",
                                isInCurrentMonth ? "hover:border" : "",
                                isBlocked ? "text-gray-500" : "",
                                "flex h-7 w-7 items-center justify-center rounded-full text-xs relative z-10",
                              ]
                                .filter(Boolean)
                                .join(" ")}
                            >
                              <time dateTime={format(day, "yyyy-MM-dd")}>
                                {format(day, "d")}
                              </time>
                            </button>
                          </div>
                        </header>
                      </div>
                    );
                  })}
                </div>

                {/* Mobile version */}
                <div className="isolate grid w-full grid-cols-7 grid-rows-5 lg:[400px] border-l border-[#808080] lg:hidden">
                  {days.map((day, dayIdx) => {
                    const isBlocked = blockedDates.some((d) => isSameDay(d, day));

                    return (
                      <button
                        onClick={() => handleDateClick(day)}
                        key={dayIdx}
                        type="button"
                        disabled={!isSameMonth(day, firstDayCurrentMonth)}
                        className={[
                          isEqual(day, selectedDay) ? "text-primary-foreground" : "",
                          !isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          isSameMonth(day, firstDayCurrentMonth)
                            ? "text-foreground"
                            : "",
                          !isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          !isSameMonth(day, firstDayCurrentMonth)
                            ? "text-muted-foreground"
                            : "",
                          !isSameMonth(day, firstDayCurrentMonth) ? "bg-[#E0E0E0]" : "",
                          isEqual(day, selectedDay)
                            ? "font-semibold text-[#FFF1DC] bg-[#6B3D3D]"
                            : "",
                          isToday(day) ? "font-semibold border border-black" : "",
                          "flex h-14 flex-col border-b border-r border-[#808080] px-3 py-2 hover:bg-muted focus:z-10 relative",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        <div className="relative ml-auto">
                          {isBlocked && (
                            <div className="absolute inset-0 bg-[#808080] opacity-30 rounded-full h-6 w-6" />
                          )}
                          <time
                            dateTime={format(day, "yyyy-MM-dd")}
                            className={[
                              "flex size-6 items-center justify-center rounded-full relative z-10",
                              isEqual(day, selectedDay) && isToday(day)
                                ? "bg-primary text-primary-foreground"
                                : "",
                              isEqual(day, selectedDay) && !isToday(day)
                                ? "bg-primary text-primary-foreground"
                                : "",
                              isBlocked ? "text-gray-500" : "",
                            ]
                              .filter(Boolean)
                              .join(" ")}
                          >
                            {format(day, "d")}
                          </time>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Centered Block/Unblock Button */}
            <div className="flex justify-center mt-6 w-full">
              <button
                onClick={toggleBlockDate}
                disabled={isLoading}
                className={
                  isSelectedBlocked
                    ? "w-[200px] py-2 bg-[#f6e3c5] text-[#4b2b2b] font-serif text-xl rounded-md shadow-md border border-[#eac089] hover:shadow-lg transition-all disabled:opacity-50"
                    : "w-[200px] py-2 bg-sidebar-1 text-[#4b2b2b] font-serif text-xl rounded-md shadow-md border border-[#eac089] hover:shadow-lg transition-all disabled:opacity-50"
                }
              >
                {isLoading ? "Processing..." : isSelectedBlocked ? "Unblock" : "Block"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}