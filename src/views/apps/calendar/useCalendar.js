import { supabase } from '@/libs/supabase'
import { useCalendarStore } from '@/views/apps/calendar/useCalendarStore'
import { useConfigStore } from '@core/stores/config'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import timeGridPlugin from '@fullcalendar/timegrid'

const date = new Date()
const nextDay = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
const nextMonth = date.getMonth() === 11 ? new Date(date.getFullYear() + 1, 0, 1) : new Date(date.getFullYear(), date.getMonth() + 1, 1)
const prevMonth = date.getMonth() === 11 ? new Date(date.getFullYear() - 1, 0, 1) : new Date(date.getFullYear(), date.getMonth() - 1, 1)
export const db = {
  events: [
    {
      id: 1,
      url: '',
      title: 'Design Review',
      start: date,
      end: nextDay,
      allDay: false,
      extendedProps: {
        calendar: 'Business',
      },
    },
    {
      id: 2,
      url: '',
      title: 'Meeting With Client',
      start: new Date(date.getFullYear(), date.getMonth() + 1, -11),
      end: new Date(date.getFullYear(), date.getMonth() + 1, -10),
      allDay: true,
      extendedProps: {
        calendar: 'Business',
      },
    },
    {
      id: 3,
      url: '',
      title: 'Family Trip',
      allDay: true,
      start: new Date(date.getFullYear(), date.getMonth() + 1, -9),
      end: new Date(date.getFullYear(), date.getMonth() + 1, -7),
      extendedProps: {
        calendar: 'Holiday',
      },
    },
    {
      id: 4,
      url: '',
      title: "Doctor's Appointment",
      start: new Date(date.getFullYear(), date.getMonth() + 1, -11),
      end: new Date(date.getFullYear(), date.getMonth() + 1, -10),
      allDay: true,
      extendedProps: {
        calendar: 'Personal',
      },
    },
    {
      id: 5,
      url: '',
      title: 'Dart Game?',
      start: new Date(date.getFullYear(), date.getMonth() + 1, -13),
      end: new Date(date.getFullYear(), date.getMonth() + 1, -12),
      allDay: true,
      extendedProps: {
        calendar: 'ETC',
      },
    },
    {
      id: 6,
      url: '',
      title: 'Meditation',
      start: new Date(date.getFullYear(), date.getMonth() + 1, -13),
      end: new Date(date.getFullYear(), date.getMonth() + 1, -12),
      allDay: true,
      extendedProps: {
        calendar: 'Personal',
      },
    },
    {
      id: 7,
      url: '',
      title: 'Dinner',
      start: new Date(date.getFullYear(), date.getMonth() + 1, -13),
      end: new Date(date.getFullYear(), date.getMonth() + 1, -12),
      allDay: true,
      extendedProps: {
        calendar: 'Family',
      },
    },
    {
      id: 8,
      url: '',
      title: 'Product Review',
      start: new Date(date.getFullYear(), date.getMonth() + 1, -13),
      end: new Date(date.getFullYear(), date.getMonth() + 1, -12),
      allDay: true,
      extendedProps: {
        calendar: 'Business',
      },
    },
    {
      id: 9,
      url: '',
      title: 'Monthly Meeting',
      start: nextMonth,
      end: nextMonth,
      allDay: true,
      extendedProps: {
        calendar: 'Business',
      },
    },
    {
      id: 10,
      url: '',
      title: 'Monthly Checkup',
      start: prevMonth,
      end: prevMonth,
      allDay: true,
      extendedProps: {
        calendar: 'Personal',
      },
    },
  ],
}

export const blankEvent = {
  title: '',
  start: '',
  end: '',
  allDay: true,
  url: '',
  extendedProps: {
    calendar: undefined,
    location: '',
    map_url: '',
  },
}

export const useCalendar = (event, isEventHandlerSidebarActive, isLeftSidebarOpen) => {
  const configStore = useConfigStore()
  const store = useCalendarStore()
  const refCalendar = ref()
  const calendarApi = ref(null)
  const loading = ref(false)
  const errorMsg = ref('')

  // Calendar color mapping (customize as needed)
  const calendarsColor = {
    Business: 'primary',
    Holiday: 'success',
    Personal: 'error',
    Family: 'warning',
    ETC: 'info',
  }

  // Map Supabase event row to FullCalendar event
  const mapDbEvent = dbEvent => ({
    id: dbEvent.id,
    title: dbEvent.title,
    start: dbEvent.event_date,
    end: dbEvent.event_date,
    allDay: true,
    url: dbEvent.map_url || '',
    extendedProps: {
      calendar: 'Business', // or map to a type if you have one
      location: dbEvent.location,
      map_url: dbEvent.map_url,
    },
  })

  // Fetch events from Supabase
  const fetchEvents = async (info, successCallback) => {
    loading.value = true
    errorMsg.value = ''
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true })
      if (error) {
        errorMsg.value = error.message
        successCallback([])
        loading.value = false
        return
      }
      let events = data.map(mapDbEvent)
      // Filter by selected calendars if needed (optional)
      if (store.selectedCalendars.length) {
        events = events.filter(e =>
          store.selectedCalendars.includes(e.extendedProps.calendar)
        )
      }
      successCallback(events)
    } catch (e) {
      errorMsg.value = 'Failed to fetch events'
      successCallback([])
    }
    loading.value = false
  }

  // Add event to Supabase
  const addEvent = async _event => {
    loading.value = true
    errorMsg.value = ''
    try {
      const { error } = await supabase
        .from('events')
        .insert([{
          title: _event.title,
          event_date: _event.start,
          location: _event.extendedProps.location,
          map_url: _event.extendedProps.map_url,
        }])
      if (error) errorMsg.value = error.message
      refetchEvents()
    } catch (e) {
      errorMsg.value = 'Failed to add event'
    }
    loading.value = false
  }

  // Update event in Supabase
  const updateEvent = async _event => {
    loading.value = true
    errorMsg.value = ''
    try {
      const { error } = await supabase
        .from('events')
        .update({
          title: _event.title,
          event_date: _event.start,
          location: _event.extendedProps.location,
          map_url: _event.extendedProps.map_url,
        })
        .eq('id', _event.id)
      if (error) errorMsg.value = error.message
      refetchEvents()
    } catch (e) {
      errorMsg.value = 'Failed to update event'
    }
    loading.value = false
  }

  // Remove event from Supabase
  const removeEvent = async eventId => {
    loading.value = true
    errorMsg.value = ''
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)
      if (error) errorMsg.value = error.message
      refetchEvents()
    } catch (e) {
      errorMsg.value = 'Failed to remove event'
    }
    loading.value = false
  }

  // Refetch events in calendar UI
  const refetchEvents = () => {
    calendarApi.value?.refetchEvents()
  }

  watch(() => store.selectedCalendars, refetchEvents)


  // 👉 Update event in calendar [UI]
  const updateEventInCalendar = (updatedEventData, propsToUpdate, extendedPropsToUpdate) => {
    calendarApi.value = refCalendar.value.getApi()

    const existingEvent = calendarApi.value?.getEventById(String(updatedEventData.id))
    if (!existingEvent) {
      console.warn('Can\'t found event in calendar to update')

      return
    }

    // ---Set event properties except date related
    // Docs: https://fullcalendar.io/docs/Event-setProp
    // dateRelatedProps => ['start', 'end', 'allDay']
    for (let index = 0; index < propsToUpdate.length; index++) {
      const propName = propsToUpdate[index]

      existingEvent.setProp(propName, updatedEventData[propName])
    }

    // --- Set date related props
    // ? Docs: https://fullcalendar.io/docs/Event-setDates
    existingEvent.setDates(updatedEventData.start, updatedEventData.end, { allDay: updatedEventData.allDay })

    // --- Set event's extendedProps
    // ? Docs: https://fullcalendar.io/docs/Event-setExtendedProp
    for (let index = 0; index < extendedPropsToUpdate.length; index++) {
      const propName = extendedPropsToUpdate[index]

      existingEvent.setExtendedProp(propName, updatedEventData.extendedProps[propName])
    }
  }


  // 👉 Remove event in calendar [UI]
  const removeEventInCalendar = eventId => {
    const _event = calendarApi.value?.getEventById(eventId)
    if (_event)
      _event.remove()
  }


  watch(() => store.selectedCalendars, refetchEvents)


  // 👉 Calendar options
  const calendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      start: 'drawerToggler,prev,next title',
      end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
    },
    events: fetchEvents,

    // ❗ We need this to be true because when its false and event is allDay event and end date is same as start data then Full calendar will set end to null
    forceEventDuration: true,

    /*
        Enable dragging and resizing event
        Docs: https://fullcalendar.io/docs/editable
      */
    editable: true,

    /*
        Enable resizing event from start
        Docs: https://fullcalendar.io/docs/eventResizableFromStart
      */
    eventResizableFromStart: true,

    /*
        Automatically scroll the scroll-containers during event drag-and-drop and date selecting
        Docs: https://fullcalendar.io/docs/dragScroll
      */
    dragScroll: true,

    /*
        Max number of events within a given day
        Docs: https://fullcalendar.io/docs/dayMaxEvents
      */
    dayMaxEvents: 2,

    /*
        Determines if day names and week names are clickable
        Docs: https://fullcalendar.io/docs/navLinks
      */
    navLinks: true,
    eventClassNames({ event: calendarEvent }) {
      const colorName = calendarsColor[calendarEvent._def.extendedProps.calendar]

      return [
        // Background Color
        `bg-light-${colorName} text-${colorName}`,
      ]
    },
    eventClick({ event: clickedEvent, jsEvent }) {
      // Prevent the default action
      jsEvent.preventDefault()
      if (clickedEvent.url) {
        // Open the URL in a new tab
        // window.open(clickedEvent.url, '_blank')
      }

      // * Only grab required field otherwise it goes in infinity loop
      // ! Always grab all fields rendered by form (even if it get `undefined`) otherwise due to Vue3/Composition API you might get: "object is not extensible"
      event.value = {
        id: clickedEvent.id,
        title: clickedEvent.title,
        start: clickedEvent.startStr,
        end: clickedEvent.endStr,
        allDay: clickedEvent.allDay,
        url: clickedEvent.url,
        extendedProps: {
          calendar: clickedEvent.extendedProps?.calendar,
          location: clickedEvent.extendedProps?.location,
          map_url: clickedEvent.extendedProps?.map_url,
        },
      }
      isEventHandlerSidebarActive.value = true
    },

    // customButtons
    dateClick(info) {
      event.value = { ...event.value, start: info.dateStr }
      isEventHandlerSidebarActive.value = true
    },

    /*
          Handle event drop (Also include dragged event)
          Docs: https://fullcalendar.io/docs/eventDrop
          We can use `eventDragStop` but it doesn't return updated event so we have to use `eventDrop` which returns updated event
        */
    eventDrop({ event: droppedEvent }) {
      updateEvent({
        id: droppedEvent.id,
        title: droppedEvent.title,
        start: droppedEvent.startStr,
        extendedProps: {
          location: droppedEvent.extendedProps?.location,
          map_url: droppedEvent.extendedProps?.map_url,
          calendar: droppedEvent.extendedProps?.calendar,
        },
      })
    },

    /*
          Handle event resize
          Docs: https://fullcalendar.io/docs/eventResize
        */
    eventResize({ event: resizedEvent }) {
      updateEvent({
        id: resizedEvent.id,
        title: resizedEvent.title,
        start: resizedEvent.startStr,
        extendedProps: {
          location: resizedEvent.extendedProps?.location,
          map_url: resizedEvent.extendedProps?.map_url,
          calendar: resizedEvent.extendedProps?.calendar,
        },
      })
    },
    customButtons: {
      drawerToggler: {
        text: 'calendarDrawerToggler',
        click() {
          isLeftSidebarOpen.value = true
        },
      },
    },
  }


  // 👉 onMounted
  onMounted(() => {
    nextTick(() => {
      if (refCalendar.value)
        calendarApi.value = refCalendar.value.getApi()
    })
  })


  // 👉 Jump to date on sidebar(inline) calendar change
  const jumpToDate = currentDate => {
    calendarApi.value?.gotoDate(new Date(currentDate))
  }

  watch(() => configStore.isAppRTL, val => {
    calendarApi.value?.setOption('direction', val ? 'rtl' : 'ltr')
  }, { immediate: true })

  return {
    refCalendar,
    calendarOptions,
    refetchEvents,
    fetchEvents,
    addEvent,
    updateEvent,
    removeEvent,
    jumpToDate,
    loading,
    errorMsg,
  }
}
