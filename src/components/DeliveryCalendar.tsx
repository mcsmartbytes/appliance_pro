'use client';

import { useState, useEffect, useMemo } from 'react';

interface DeliverySlot {
  date: string;
  slot_id: string;
  start_time: string;
  end_time: string;
  max_deliveries: number;
  active_count: number;
  remaining: number;
}

interface DeliveryCalendarProps {
  onSlotSelect?: (date: string, slot: DeliverySlot) => void;
}

export default function DeliveryCalendar({ onSlotSelect }: DeliveryCalendarProps) {
  const [availability, setAvailability] = useState<DeliverySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<DeliverySlot | null>(null);

  // Calculate date range (next 14 days)
  const startDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1); // Start from tomorrow
    return date.toISOString().split('T')[0];
  }, []);

  useEffect(() => {
    async function fetchAvailability() {
      try {
        const res = await fetch(
          `/api/public/delivery/availability?dateFrom=${startDate}&days=14`
        );
        if (!res.ok) throw new Error('Failed to fetch availability');

        const data = await res.json();
        setAvailability(data.availability || []);
      } catch (err) {
        setError('Failed to load delivery availability. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAvailability();
  }, [startDate]);

  // Group slots by date
  const slotsByDate = useMemo(() => {
    const grouped: Record<string, DeliverySlot[]> = {};
    for (const slot of availability) {
      const dateKey = slot.date.toString().split('T')[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(slot);
    }
    return grouped;
  }, [availability]);

  // Get unique dates
  const dates = useMemo(() => Object.keys(slotsByDate).sort(), [slotsByDate]);

  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return {
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
    };
  };

  // Check if date has available slots
  const hasAvailability = (dateStr: string) => {
    const slots = slotsByDate[dateStr];
    return slots?.some((slot) => slot.remaining > 0);
  };

  const handleSlotClick = (date: string, slot: DeliverySlot) => {
    if (slot.remaining === 0) return;

    setSelectedDate(date);
    setSelectedSlot(slot);
    onSlotSelect?.(date, slot);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-gray-600">Loading availability...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date Selector */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Select a Date</h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {dates.map((dateStr) => {
            const { dayName, dayNum, month } = formatDate(dateStr);
            const available = hasAvailability(dateStr);
            const isSelected = selectedDate === dateStr;

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                disabled={!available}
                className={`flex-shrink-0 w-20 py-3 rounded-lg border-2 text-center transition-colors ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : available
                    ? 'border-gray-200 bg-white hover:border-gray-300 text-gray-900'
                    : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                <div className="text-xs font-medium">{dayName}</div>
                <div className="text-2xl font-bold">{dayNum}</div>
                <div className="text-xs">{month}</div>
                {!available && (
                  <div className="text-xs text-red-500 mt-1">Full</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slot Selector */}
      {selectedDate && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Select a Time</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {slotsByDate[selectedDate]?.map((slot) => {
              const isSelected =
                selectedSlot?.slot_id === slot.slot_id &&
                selectedDate === selectedDate;
              const isAvailable = slot.remaining > 0;

              return (
                <button
                  key={slot.slot_id}
                  onClick={() => handleSlotClick(selectedDate, slot)}
                  disabled={!isAvailable}
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50'
                      : isAvailable
                      ? 'border-gray-200 bg-white hover:border-gray-300'
                      : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span
                        className={`font-semibold ${
                          isAvailable ? 'text-gray-900' : 'text-gray-400'
                        }`}
                      >
                        {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                      </span>
                    </div>
                    <span
                      className={`text-sm px-2 py-0.5 rounded ${
                        slot.remaining > 2
                          ? 'bg-emerald-100 text-emerald-700'
                          : slot.remaining > 0
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {slot.remaining > 0
                        ? `${slot.remaining} spots`
                        : 'Full'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Summary */}
      {selectedDate && selectedSlot && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Selected Time Slot</h4>
          <p className="text-blue-800">
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
            {' • '}
            {formatTime(selectedSlot.start_time)} - {formatTime(selectedSlot.end_time)}
          </p>
          <p className="text-sm text-blue-600 mt-1">
            Call us to confirm your delivery appointment.
          </p>
        </div>
      )}
    </div>
  );
}
